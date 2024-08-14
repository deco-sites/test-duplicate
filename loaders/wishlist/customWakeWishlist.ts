import { AppContext } from "apps/wake/mod.ts";
import { Product } from "apps/commerce/types.ts";

/**
 * @title Wake Lista de Desejos
 */
export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<Product[] | null> {
  const { invoke } = ctx;

  try {
    const wishlistProducts = await invoke.wake.loaders.wishlist();

    const productsIds = wishlistProducts.map((item) => Number(item.productId));

    const products = productsIds.length > 0
      ? await invoke.wake.loaders.productList({
        first: productsIds.length,
        sortDirection: "ASC",
        sortKey: "NAME",
        filters: {
          productId: productsIds,
          mainVariant: true,
        },
      })
      : null;

    return products?.filter((product) => !product) ?? [];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.log(error);

    return null;
  }
}
