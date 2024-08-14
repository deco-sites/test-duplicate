import type { Platform } from "$store/apps/site.ts";
import type { ShippingSimulatorVariants } from "deco-sites/fast-fashion/components/ui/ShippingSimulator/Common.tsx";
import { ShippingSimulatorVtex } from "deco-sites/fast-fashion/islands/ShippingSimulator/Vtex.tsx";
import { ShippingSimulatorWake } from "deco-sites/fast-fashion/islands/ShippingSimulator/Wake.tsx";

interface Props {
  items: Array<{
    id: number;
    quantity: number;
    seller: string;
  }>;
  variant: ShippingSimulatorVariants;
  platform: Platform;
}

function ShippingSimulator({ items, variant, platform }: Props) {
  if (platform === "vtex") {
    return <ShippingSimulatorVtex items={items} variant={variant} />;
  }

  if (platform === "wake") {
    return <ShippingSimulatorWake items={items} variant={variant} />;
  }

  return null;
}

export default ShippingSimulator;
