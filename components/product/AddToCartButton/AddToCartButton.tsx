import { usePlatform } from "$store/sdk/usePlatform.tsx";
import { PropertyValue } from "apps/commerce/types.ts";
import AddToCartButtonVtex from "$store/islands/AddToCartButton/vtex.tsx";
import AddToCartButtonWake from "$store/islands/AddToCartButton/wake.tsx";
import AddToCartButtonLinx from "$store/islands/AddToCartButton/linx.tsx";
import AddToCartButtonVNDA from "$store/islands/AddToCartButton/vnda.tsx";
import AddToCartButtonShopify from "$store/islands/AddToCartButton/shopify.tsx";
import AddToCartButtonNuvemshop from "$store/islands/AddToCartButton/nuvemshop.tsx";

import { ToAddToCart } from "deco-sites/fast-fashion/sdk/ga4/events/add_to_cart.ts";

export type AddToCartItem = {
  quantity: number;
  seller: string;
  id: string;
};

export interface Props {
  variant?: "plp" | "pdp";
  hideIcon?: boolean;
  quantitySelector?: boolean;
  platform: ReturnType<typeof usePlatform>;
  items: AddToCartItem[];
  productGroupID: string;
  additionalProperty: PropertyValue[];
  analytics?: ToAddToCart;
  class?: string;
}

export default function AddToCartButton({
  platform,
  analytics,
  productGroupID,
  additionalProperty,
  quantitySelector = true,
  variant = "plp",
  items,
  hideIcon,
  class: _class,
}: Props) {
  return (
    // <div class={twMerge("flex-1", _class)}>
    <>
      {platform === "vtex" && (
        <AddToCartButtonVtex
          class={_class}
          items={items}
          analytics={analytics}
          quantity={1}
          variant={variant}
          quantitySelector={quantitySelector}
          hideIcon={hideIcon}
        />
      )}
      {platform === "wake" && (
        <AddToCartButtonWake
          class={_class}
          productID={items[0].id}
          analytics={analytics}
          quantity={1}
          variant={variant}
          quantitySelector={quantitySelector}
        />
      )}
      {platform === "linx" && (
        <AddToCartButtonLinx
          class={_class}
          productID={items[0].id}
          productGroupID={productGroupID}
          quantity={1}
          variant={variant}
        />
      )}
      {platform === "vnda" && (
        <AddToCartButtonVNDA
          class={_class}
          productID={items[0].id}
          additionalProperty={additionalProperty}
          quantity={1}
          variant={variant}
        />
      )}
      {platform === "shopify" && (
        <AddToCartButtonShopify
          class={_class}
          productID={items[0].id}
          quantity={1}
          variant={variant}
        />
      )}
      {platform === "nuvemshop" && (
        <AddToCartButtonNuvemshop
          class={_class}
          productGroupID={productGroupID}
          additionalProperty={additionalProperty}
          quantity={1}
          variant={variant}
        />
      )}
    </>
    // </div>
  );
}
