import { toViewCart } from "$store/sdk/ga4/events/view_cart.ts";
import { toAddToCart } from "$store/sdk/ga4/events/add_to_cart.ts";
import { toRemoveFromCart } from "$store/sdk/ga4/events/remove_from_cart.ts";
import { toViewPromotion } from "$store/sdk/ga4/events/view_promotion.ts";
import { toSelectPromotion } from "$store/sdk/ga4/events/select_promotion.ts";
import { toViewItem } from "$store/sdk/ga4/events/view_item.ts";
import { toViewItemList } from "$store/sdk/ga4/events/view_item_list.ts";
import { toSelectItem } from "$store/sdk/ga4/events/select_item.ts";
import { toAddToWishlist } from "$store/sdk/ga4/events/add_to_wishlist.ts";
import type {
  AnalyticsEventTypes,
  ToAnalyticsProps,
} from "$store/sdk/ga4/types/index.ts";

type HandlerReturnTypes = {
  view_cart: ReturnType<typeof toViewCart>;
  add_to_cart: ReturnType<typeof toAddToCart>;
  remove_from_cart: ReturnType<typeof toRemoveFromCart>;
  view_promotion: ReturnType<typeof toViewPromotion>;
  select_promotion: ReturnType<typeof toSelectPromotion>;
  view_item: ReturnType<typeof toViewItem>;
  view_item_list: ReturnType<typeof toViewItemList>;
  select_item: ReturnType<typeof toSelectItem>;
  add_to_wishlist: ReturnType<typeof toAddToWishlist>;
};

const handlers: {
  [T in keyof AnalyticsEventTypes]: (
    data: AnalyticsEventTypes[T],
  ) => HandlerReturnTypes[T];
} = {
  view_cart: toViewCart,
  add_to_cart: toAddToCart,
  remove_from_cart: toRemoveFromCart,
  view_promotion: toViewPromotion,
  select_promotion: toSelectPromotion,
  view_item: toViewItem,
  view_item_list: toViewItemList,
  select_item: toSelectItem,
  add_to_wishlist: toAddToWishlist,
};

export const toAnalytics = <T extends keyof AnalyticsEventTypes>({
  type,
  data,
}: ToAnalyticsProps<T>) => {
  if (!type) {
    throw new Error("Type is undefined");
  }

  const handler = handlers[type];

  if (!handler) {
    throw new Error(`Unsupported type: ${type}`);
  }

  return handler(data);
};
