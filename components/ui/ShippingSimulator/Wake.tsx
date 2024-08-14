import ShippingSimulatorCommon, {
  ShippingSimulatorVariants,
} from "$store/components/ui/ShippingSimulator/Common.tsx";
import { SKU } from "apps/vtex/utils/types.ts";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";

export interface Address {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location: Location;
}

export interface Location {
  type: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  longitude: string;
  latitude: string;
}

interface Props {
  items: Array<SKU>;
  variant: ShippingSimulatorVariants;
}

export function ShippingSimulatorWake({ items, variant }: Props) {
  const handleSimulateRequest = async (postalCode: string) => {
    const response = await invoke.wake.actions.shippingSimulation({
      cep: postalCode,
      productVariantId: variant === "pdp" ? items[0].id : undefined,
      quantity: variant === "pdp" ? items[0].quantity : undefined,
      simulateCartItems: variant === "cart",
    }) ?? [];

    if (!response) return [];

    const shippingMethods = response.map((item) => ({
      name: item?.name ?? "",
      price: (item?.value ?? 0) * 100,
      estimate: `${item?.deadline} dias`,
    }));

    return shippingMethods;
  };

  return (
    <ShippingSimulatorCommon
      items={items}
      onSimulateRequest={handleSimulateRequest}
      variant={variant}
    />
  );
}
