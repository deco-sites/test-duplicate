import type { OrderForm, OrderFormItem } from "apps/vtex/utils/types.ts";
import type { Product } from "apps/commerce/types.ts";

export interface SelectPromotionParams {
  /** @title promotion_id */
  promotion_id: string;
  /** @title promotion_name */
  promotion_name: string;
}

export type EventAnalytics =
  | "view_item"
  | "view_item_list"
  | "select_item"
  | "view_item_list"
  | "select_promotion"
  | "view_promotion";

export type List = {
  id: string;
  name: string;
};

export interface OrderFormToAnalytics {
  items: OrderFormItem[];
  cart: OrderForm;
  view: List;
  currentSKU?: string;
}

export type ProductToAnalyticsItem = Product & {
  quantity: number;
  seller: string;
  index: number;
  price: number;
  listPrice: number;
};

export interface ProductToAnalytics {
  items: ProductToAnalyticsItem[];
  cart: OrderForm;
  list: List;
}
