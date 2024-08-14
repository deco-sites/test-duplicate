import { AppContext } from "apps/wake/mod.ts";
import { Product, ProductDetailsPage } from "apps/commerce/types.ts";

export interface Props {
  productDetailsPage: ProductDetailsPage | null;
}

/**
 * @title Wake Compre Junto
 */
export default function loader(
  { productDetailsPage }: Props,
  _req: Request,
  _ctx: AppContext,
): Product[] | null {
  if (!productDetailsPage) return null;

  const { product } = productDetailsPage;
  const buyTogetherProducts =
    product.isRelatedTo?.filter((product) =>
      product.additionalType === "BuyTogether"
    ) ?? [];

  return buyTogetherProducts;
}
