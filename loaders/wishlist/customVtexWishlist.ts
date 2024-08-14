import { AppContext } from "apps/vtex/mod.ts";
import { Product } from "apps/commerce/types.ts";

/**
 * @title Vtex Lista de Desejos
 */
export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<Product[] | null> {
  const { invoke } = ctx;

  try {
    const wishlistProducts = await invoke.vtex.loaders.wishlist();

    const productsIds = wishlistProducts.map((item) => item.sku);

    const products = productsIds.length > 0
      ? await invoke.vtex.loaders.intelligentSearch.productList({
        props: {
          ids: productsIds,
        },
      })
      : [];

    return products?.filter((product: Product) => product != undefined) ?? [];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}
