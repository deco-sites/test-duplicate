import { AppContext } from "$store/apps/site.ts";
import { AppContext as VTEXAppContext } from "apps/vtex/mod.ts";

export interface Props {
  productGroupID: string;
  stars?: boolean;
}
export interface AverageRating {
  average: number;
  starsFive?: number;
  starsFour?: number;
  starsThree?: number;
  starsTwo?: number;
  starsOne?: number;
  total: number;
}

export type ProductAverageRating = AverageRating;

/**
 * @title Product Average Rating
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext & VTEXAppContext,
): Promise<ProductAverageRating | null> => {
  const { stars = true, productGroupID } = props;

  try {
    const ratings = await ctx.vtex?.io.query<
      {
        averageRatingByProductId: ProductAverageRating;
      },
      unknown
    >({
      operationName: "ReviewsByProductId",
      query: `
        query ReviewsByProductId(
          $productId: String!
        ) {
          averageRatingByProductId(productId: $productId) {
            average
            total
            ${stars ? "starsFive" : ""}
            ${stars ? "starsFour" : ""}
            ${stars ? "starsThree" : ""}
            ${stars ? "starsTwo" : ""}
            ${stars ? "starsOne" : ""}
          }
        }
      `,
      variables: {
        productId: productGroupID,
      },
    });

    if (!ratings) {
      return null;
    }

    return ratings.averageRatingByProductId;
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
  const { productGroupID, stars = true } = props;

  const params = new URLSearchParams([
    ["productGroupID", productGroupID],
    ["page", stars.toString()],
  ]);

  return params.toString();
};

export default loader;
