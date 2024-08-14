import { AppContext } from "$store/apps/site.ts";
import { AppContext as VTEXAppContext } from "apps/vtex/mod.ts";
import { parseCookie } from "apps/vtex/utils/vtexId.ts";

export interface Props {
  productGroupID: string;
}

export type HasShopperReviewedProduct = boolean;

/**
 * @title Has Shopper Reviewed Product
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext & VTEXAppContext,
): Promise<HasShopperReviewedProduct> => {
  try {
    const { payload } = parseCookie(req.headers, "b2cthamaracapelao");

    const { productGroupID } = props;

    const user = payload?.sub;

    if (!user) {
      return false;
    }

    const ratings = await ctx.vtex?.io.query<
      {
        hasShopperReviewed?: boolean;
      },
      unknown
    >({
      operationName: "ReviewsByProductId",
      query: `
        query ReviewsByProductId(
          $productId: String!
          $shopperId: String!
        ) {
          hasShopperReviewed(shopperId: $shopperId, productId: $productId)
        }
      `,
      variables: {
        productId: productGroupID,
        shopperId: user,
      },
    });

    return !!ratings?.hasShopperReviewed;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.error(error);
  }
  return false;
};

export default loader;
