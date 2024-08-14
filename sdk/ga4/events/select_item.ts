import { toAnalyticsItems } from "$store/sdk/ga4/transform/toAnalyticsItems.ts";
import type { AnalyticsView, ProductItem } from "$store/sdk/ga4/types/index.ts";

export interface ToSelectItem {
  type?: "select_item";
  items: ProductItem[];
  view: AnalyticsView;
}

export const toSelectItem = (data: ToSelectItem) => {
  const items = toAnalyticsItems({ items: data.items, view: data.view });

  return {
    name: "select_item" as const,
    params: {
      item_list_id: data.view.id,
      item_list_name: data.view.name,
      items,
    },
  };
};
