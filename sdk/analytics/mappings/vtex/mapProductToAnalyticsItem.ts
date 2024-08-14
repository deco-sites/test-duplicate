import { useOffer } from "$store/sdk/useOffer.ts";
import type { Product } from "apps/commerce/types.ts";

interface MapProductToAnalyticsItem {
  product: Product;
  index: number;
}

function mapProductToAnalyticsItem({
  product,
  index,
}: MapProductToAnalyticsItem) {
  const {
    productID,
    name,
    offers,
    sku,
    inProductGroupWithID,
    brand,
    additionalProperty,
    category,
  } = product;

  const { listPrice, price, seller, availability } = useOffer(offers);
  const isAvailability = availability === "https://schema.org/InStock";

  return {
    "@type": product["@type"],
    productID: productID,
    id: sku,
    sku: sku,
    inProductGroupWithID: inProductGroupWithID,
    name: name,
    listPrice: listPrice!,
    price: price!,
    brand: brand,
    additionalProperty: additionalProperty,
    quantity: 1,
    seller: seller ?? "1",
    category: category,
    isAvailability,
    index,
  };
}

export default mapProductToAnalyticsItem;
