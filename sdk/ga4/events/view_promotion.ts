import { toAnalyticsItems } from "$store/sdk/ga4/transform/toAnalyticsItems.ts";
import type { AnalyticsView, ProductItem } from "$store/sdk/ga4/types/index.ts";

export interface ToViewPromotion {
  type?: "view_promotion";
  promotion_id: string;
  promotion_name: string;
  creative_name?: string;
  creative_slot?: string;
  location_id?: string;
  view: AnalyticsView;
  items?: ProductItem[];
}

export const toViewPromotion = (data: ToViewPromotion) => {
  const items = data.items &&
    toAnalyticsItems({ items: data.items, view: data.view });

  return {
    name: "view_promotion" as const,
    params: {
      promotion_id: data.promotion_id,
      promotion_name: data.promotion_name,
      creative_name: data?.creative_name,
      creative_slot: data?.creative_slot,
      location_id: data?.location_id,
      ...(items ? { items } : {}),
    },
  };
};
