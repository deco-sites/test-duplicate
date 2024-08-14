import type { ToViewCart } from "$store/sdk/ga4/events/view_cart.ts";
import type { ToAddToCart } from "$store/sdk/ga4/events/add_to_cart.ts";
import type { ToRemoveFromCart } from "$store/sdk/ga4/events/remove_from_cart.ts";
import type { ToViewPromotion } from "$store/sdk/ga4/events/view_promotion.ts";
import type { ToSelectPromotion } from "$store/sdk/ga4/events/select_promotion.ts";
import type { ToViewItem } from "$store/sdk/ga4/events/view_item.ts";
import type { ToViewItemList } from "$store/sdk/ga4/events/view_item_list.ts";
import type { ToSelectItem } from "$store/sdk/ga4/events/select_item.ts";
import type { ToAddToWishlist } from "$store/sdk/ga4/events/add_to_wishlist.ts";

export type AnalyticsEventTypes = {
  view_cart: ToViewCart;
  add_to_cart: ToAddToCart;
  remove_from_cart: ToRemoveFromCart;
  view_promotion: ToViewPromotion;
  select_promotion: ToSelectPromotion;
  view_item: ToViewItem;
  view_item_list: ToViewItemList;
  select_item: ToSelectItem;
  add_to_wishlist: ToAddToWishlist;
};

export type ToAnalyticsProps<T extends keyof AnalyticsEventTypes> = {
  type: T;
  data: AnalyticsEventTypes[T];
};

export interface AnalyticsItem {
  item_category: string;
  item_id: string;
  item_name: string;
  affiliation: string;
  coupon: string;
  currency: string;
  discount: number;
  index: number;
  item_brand: string;
  item_list_id: string;
  item_list_name: string;
  item_variant: string;
  location_id: string;
  price: number;
  quantity: number;
}

export interface ProductItem {
  sku: string;
  inProductGroupWithID: string;
  name: string;
  seller: string;
  listPrice: number;
  price: number;
  category: string;
  url: string;
  brand?: string;
  coupon?: string;
  variant?: string;
  locationID?: string;
  extended: ExtendedProductItem;
}

export interface ExtendedProductItem {
  index: number;
  quantity: number;
  currency?: string;
}

export interface AnalyticsView {
  id: string;
  name: string;
}

export interface ToAnalyticsItemsProps {
  items: ProductItem[];
  view: AnalyticsView;
}
