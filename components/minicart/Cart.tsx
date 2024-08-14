// import { platform } from "$store/apps/storefront.ts";
import { lazy } from "preact/compat";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import { MinicartConfig } from "deco-sites/fast-fashion/components/minicart/common/Cart.tsx";

const CartVTEX = lazy(() => import("./vtex/Cart.tsx"));
const CartVNDA = lazy(() => import("./vnda/Cart.tsx"));
const CartWake = lazy(() => import("./wake/Cart.tsx"));
const CartLinx = lazy(() => import("./linx/Cart.tsx"));
const CartShopify = lazy(() => import("./shopify/Cart.tsx"));
const CartNuvemshop = lazy(() => import("./nuvemshop/Cart.tsx"));

export interface Props {
  platform: ReturnType<typeof usePlatform>;
  minicartConfig?: MinicartConfig;
}

function Cart({ platform, minicartConfig }: Props) {
  if (platform === "vtex") {
    return <CartVTEX minicartConfig={minicartConfig} />;
  }

  if (platform === "vnda") {
    return <CartVNDA minicartConfig={minicartConfig} />;
  }

  if (platform === "wake") {
    return <CartWake minicartConfig={minicartConfig} />;
  }

  if (platform === "linx") {
    return <CartLinx minicartConfig={minicartConfig} />;
  }

  if (platform === "shopify") {
    return <CartShopify minicartConfig={minicartConfig} />;
  }

  if (platform === "nuvemshop") {
    return <CartNuvemshop minicartConfig={minicartConfig} />;
  }

  return null;
}

export default Cart;
