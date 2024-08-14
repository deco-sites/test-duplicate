import type { OrderFormToAnalytics } from "$store/sdk/analytics/types.ts";
import {
  categoriesToAnalytics,
  formatPriceToAnalytics,
} from "$store/sdk/analytics/utils/index.ts";

export function orderFormToAnalytics({
  items,
  cart,
  view,
  currentSKU,
}: OrderFormToAnalytics) {
  const filteredItems = currentSKU
    ? items.filter((item) => item.id === currentSKU)
    : items;

  const mappedItems = filteredItems.map((item, index) => {
    const categories = categoriesToAnalytics(
      Object.values(item.productCategories),
    );

    return {
      item_id: `${item.productId}_${item.id}`,
      item_name: item.name,
      affiliation: item.seller ?? "1",
      coupon: cart.marketingData?.coupon ?? "",
      currency: cart.storePreferencesData.currencyCode,
      discount: formatPriceToAnalytics(item.listPrice - item.price),
      index: index - 1,
      item_brand: item.additionalInfo.brandName ?? "",
      item_list_id: view.id,
      item_list_name: view.name,
      item_variant: "",
      location_id: "",
      price: formatPriceToAnalytics(item.price),
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
