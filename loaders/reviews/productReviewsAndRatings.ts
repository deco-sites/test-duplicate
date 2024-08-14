import { AppContext } from "$store/apps/site.ts";
import { AppContext as VTEXAppContext } from "apps/vtex/mod.ts";
import { ProductReviewData } from "apps/vtex/utils/types.ts";
import { parseCookie } from "apps/vtex/utils/vtexId.ts";

export type ReviewsAndRatingsOrder =
  | "SearchDate:asc"
  | "SearchDate:desc"
  | "Rating:asc"
  | "Rating:desc";

export interface Props {
  productGroupID: string;
  rating?: number;
  page?: number;
  orderBy?: ReviewsAndRatingsOrder;
  // orderBy?: string;
}

export interface AverageRating {
  average: number;
  starsFive: number;
  starsFour: number;
  starsThree: number;
  starsTwo: number;
  starsOne: number;
  total: number;
}

export interface EnhancedReviewsAndRatings {
  reviews: ProductReviewData;
  averageRating: AverageRating;
  hasShopperReviewed: boolean;
}

/**
 * @title Product Reviews and Ratings
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext & VTEXAppContext,
): Promise<EnhancedReviewsAndRatings | null> => {
  const { payload } = parseCookie(req.headers, "b2cthamaracapelao");

  const { productGroupID, orderBy = "SearchDate:desc", page = 1, rating } =
    props;

  const user = payload?.sub;
  try {
    const reviews = await ctx.vtex?.io.query<
      {
        reviewsByProductId: ProductReviewData;
        averageRatingByProductId: AverageRating;
        hasShopperReviewed?: boolean;
      },
      unknown
    >({
      operationName: "ReviewsByProductId",
      query: `
        query ReviewsByProductId(
          $productId: String!
          $rating: Int
          $locale: String
          $pastReviews: Boolean
          $from: Int
          $to: Int
          $orderBy: String
          $status: String
          ${user ? "$shopperId: String!" : ""}
        ) {
          reviewsByProductId(
            productId: $productId
            rating: $rating
            locale: $locale
            pastReviews: $pastReviews
            from: $from
            to: $to
            orderBy: $orderBy
            status: $status
          ) {
            data {
              id
              productId
              rating
              title
              text
              reviewerName
              location
              locale
              pastReviews
              reviewDateTime
              verifiedPurchaser
              sku
              approved
            }
            range {
              total
              from
              to
            }
          }

          averageRatingByProductId(productId: $productId) {
            average
            starsFive
            starsFour
            starsThree
            starsTwo
            starsOne
            total
          }
          ${
        user
          ? "hasShopperReviewed(shopperId: $shopperId, productId: $productId)"
          : ""
      }
        }
      `,
      variables: {
        productId: productGroupID,
        from: page * 5 - 5,
        to: page * 5 - 1,
        orderBy: orderBy,
        rating: rating,
        shopperId: user,
      },
    });

    if (!reviews) {
      return null;
    }

    return {
      averageRating: reviews.averageRatingByProductId,
      reviews: reviews.reviewsByProductId,
      hasShopperReviewed: !!reviews.hasShopperReviewed,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.error(error);
  }

  return null;
};

export const cache = "stale-while-revalidate";

export const cacheKey = (props: Props, _req: Request) => {
  const { productGroupID, orderBy = "SearchDate:desc", page = 1, rating } =
    props;

  const params = new URLSearchParams([
    ["productGroupID", productGroupID],
    ["page", page.toString()],
    ["orderBy", orderBy],
    ["rating", rating?.toString() ?? ""],
  ]);

  return params.toString();
};

export default loader;
