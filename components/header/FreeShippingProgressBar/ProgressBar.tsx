// import { platform } from "$store/apps/storefront.ts";
import { usePlatform } from "$store/sdk/usePlatform.tsx";

import ProgressBarVTEX from "$store/islands/header/FreeShippingProgressBar/vtex.tsx";
import ProgressBarVNDA from "$store/islands/header/FreeShippingProgressBar/vnda.tsx";
import ProgressBarWake from "$store/islands/header/FreeShippingProgressBar/wake.tsx";
import ProgressBarLinx from "$store/islands/header/FreeShippingProgressBar/linx.tsx";
import ProgressBarShopify from "$store/islands/header/FreeShippingProgressBar/shopify.tsx";
import ProgressBarNuvemshop from "$store/islands/header/FreeShippingProgressBar/nuvemshop.tsx";

export interface Props {
  platform: ReturnType<typeof usePlatform>;
  target: number;
}

function ProgressBar({ platform, target }: Props) {
  if (platform === "vtex") {
    return <ProgressBarVTEX target={target} />;
  }

  if (platform === "vnda") {
    return <ProgressBarVNDA target={target} />;
  }

  if (platform === "wake") {
    return <ProgressBarWake target={target} />;
  }

  if (platform === "linx") {
    return <ProgressBarLinx target={target} />;
  }

  if (platform === "shopify") {
    return <ProgressBarShopify target={target} />;
  }

  if (platform === "nuvemshop") {
    return <ProgressBarNuvemshop target={target} />;
  }

  return null;
}

export default ProgressBar;
