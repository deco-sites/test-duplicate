import { toAnalyticsItems } from "$store/sdk/ga4/transform/toAnalyticsItems.ts";
import type { AnalyticsView, ProductItem } from "$store/sdk/ga4/types/index.ts";

export interface ToViewItemList {
  type?: "view_item_list";
  items: ProductItem[];
  view: AnalyticsView;
}

export const toViewItemList = (data: ToViewItemList) => {
  const items = toAnalyticsItems({ items: data.items, view: data.view });

  return {
    name: "view_item_list" as const,
    params: {
      item_list_id: data.view.id,
      item_list_name: data.view.name,
      items,
    },
  };
};
