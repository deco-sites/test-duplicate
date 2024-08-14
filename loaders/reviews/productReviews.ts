import { AppContext } from "$store/apps/site.ts";
import { AppContext as VTEXAppContext } from "apps/vtex/mod.ts";
import { ProductReviewData } from "apps/vtex/utils/types.ts";
import { Review } from "apps/commerce/types.ts";

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
}

export interface VTEXProductReviews {
  reviews: Review[];
  range: ProductReviewData["range"];
}

export const REVIEWS_PER_PAGE = 5;

/**
 * @title Product Average Rating
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext & VTEXAppContext,
): Promise<VTEXProductReviews | null> => {
  try {
    const { productGroupID, orderBy = "SearchDate:desc", page = 1, rating } =
      props;

    const reviews = await ctx.vtex?.io.query<
      {
        reviewsByProductId: ProductReviewData;
      },
      unknown
    >({
      operationName: "ReviewsByProductId",
      query: `query ReviewsByProductId(
          $productId: String!
          $rating: Int
          $locale: String
          $pastReviews: Boolean
          $from: Int
          $to: Int
          $orderBy: String
          $status: String
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
        }
      `,
      variables: {
        productId: productGroupID,
        from: page * REVIEWS_PER_PAGE - REVIEWS_PER_PAGE,
        to: page * REVIEWS_PER_PAGE - 1,
        orderBy: orderBy,
        rating: rating,
      },
    });

    if (!reviews) {
      return null;
    }

    const productReviews = reviews.reviewsByProductId.data;

    return {
      reviews: productReviews?.map((_, reviewIndex) => ({
        "@type": "Review",
        id: productReviews[reviewIndex]?.id?.toString(),
        author: [{
          "@type": "Author",
          name: productReviews[reviewIndex]?.reviewerName,
          verifiedBuyer: productReviews[reviewIndex]?.verifiedPurchaser,
        }],
        itemReviewed: productReviews[reviewIndex]?.productId,
        datePublished: productReviews[reviewIndex]?.reviewDateTime,
        reviewHeadline: productReviews[reviewIndex]?.title,
        reviewBody: productReviews[reviewIndex]?.text,
        reviewRating: {
          "@type": "AggregateRating",
          ratingValue: productReviews[reviewIndex]?.rating || 0,
        },
      })) ?? [],
      range: reviews.reviewsByProductId.range,
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
