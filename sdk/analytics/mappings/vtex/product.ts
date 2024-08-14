import type { ProductToAnalytics } from "$store/sdk/analytics/types.ts";
import { categoriesToAnalytics } from "$store/sdk/analytics/utils/index.ts";

export function productToAnalytics({ items, cart, list }: ProductToAnalytics) {
  const mappedItems = items.map((item, index) => {
    const categories = categoriesToAnalytics(item.category?.split(">") ?? []);

    return {
      item_id: `${item.inProductGroupWithID}_${item.sku}`,
      item_name: item.name,
      affiliation: item.seller ?? "1",
      coupon: cart.marketingData?.coupon ?? "",
      currency: cart.storePreferencesData.currencyCode,
      discount: parseFloat((item.listPrice - item.price).toFixed(2)),
      index,
      item_brand: item.brand?.name ?? "",
      item_list_id: list.id,
      item_list_name: list.name,
      item_variant: "",
      location_id: "",
      price: item.price,
      quantity: item.quantity,
      ...categories,
    };
  });

  const value = mappedItems
    .reduce((acc, { price, quantity }) => acc + (price * quantity), 0)
    .toFixed(2);

  return {
    currency: cart.storePreferencesData.currencyCode,
    value: parseFloat(value),
    items: mappedItems,
  };
}
