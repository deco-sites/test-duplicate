import { toAnalyticsItems } from "$store/sdk/ga4/transform/toAnalyticsItems.ts";
import { getTotalValue } from "$store/sdk/ga4/transform/getTotalValue.ts";
import type { AnalyticsView, ProductItem } from "$store/sdk/ga4/types/index.ts";

export interface ToViewItem {
  type?: "view_item";
  items: ProductItem[];
  view: AnalyticsView;
}

export const toViewItem = (data: ToViewItem) => {
  const items = toAnalyticsItems({ items: data.items, view: data.view });
  const value = getTotalValue(items);

  return {
    name: "view_item" as const,
    params: {
      currency: data.items[0]?.extended?.currency ?? "BRL",
      value,
      items,
    },
  };
};
