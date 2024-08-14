import { useOffer } from "$store/sdk/useOffer.ts";
import type { Product } from "apps/commerce/types.ts";
import type { ExtendedProductItem } from "$store/sdk/ga4/types/index.ts";

export function toProductItem(product: Product, extended: ExtendedProductItem) {
  const {
    name = "",
    offers,
    sku,
    brand: productBrand,
    inProductGroupWithID = "",
    url = "",
    category = "",
  } = product;
  const brand = productBrand?.name ?? "";
  const { price = 0, listPrice = 0, seller = "1" } = useOffer(offers);

  return {
    sku,
    inProductGroupWithID,
    name,
    seller,
    listPrice,
    price,
    url,
    brand,
    category,
    variant: name,
    extended,
  };
}
