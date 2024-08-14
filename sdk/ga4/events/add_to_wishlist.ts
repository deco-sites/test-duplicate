import { toAnalyticsItems } from "$store/sdk/ga4/transform/toAnalyticsItems.ts";
import { getTotalValue } from "$store/sdk/ga4/transform/getTotalValue.ts";
import type { AnalyticsView, ProductItem } from "$store/sdk/ga4/types/index.ts";

export interface ToAddToWishlist {
  type?: "add_to_wishlist";
  items: ProductItem[];
  view: AnalyticsView;
}

export const toAddToWishlist = (data: ToAddToWishlist) => {
  const items = toAnalyticsItems({ items: data.items, view: data.view });
  const value = getTotalValue(items);

  return {
    name: "add_to_wishlist" as const,
    params: {
      currency: data.items[0]?.extended?.currency ?? "BRL",
      value,
      items,
    },
  };
};
