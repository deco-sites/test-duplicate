import type { ToAnalyticsItemsProps } from "$store/sdk/ga4/types/index.ts";

const categoriesToAnalytics = (
  categories: string[],
): Record<`item_category${number | ""}`, string> => {
  return categories.slice(0, 5).reduce((result, category, index) => {
    result[`item_category${index === 0 ? "" : index + 1}`] = category;
    return result;
  }, {} as Record<`item_category${number | ""}`, string>);
};

export function toAnalyticsItems({ items, view }: ToAnalyticsItemsProps) {
  const analyticsItems = items.map((item) => {
    const categories = categoriesToAnalytics(item.category?.split(">") ?? []);

    return {
      item_id: `${item.inProductGroupWithID}_${item.sku}`,
      item_name: item.name,
      item_url: item.url,
      affiliation: item.seller ?? "1",
      coupon: item.coupon ?? "",
      currency: item.extended?.currency ?? "BRL",
      discount: parseFloat(
        ((item.listPrice - item.price) * item.extended.quantity).toFixed(2),
      ),
      index: item.extended.index + 1,
      item_brand: item.brand ?? "",
      item_list_id: view.id,
      item_list_name: view.name,
      item_variant: item.variant ?? "",
      location_id: item.locationID ?? "",
      price: item.listPrice,
      quantity: item.extended.quantity,
      ...categories,
    };
  });

  return analyticsItems;
}
