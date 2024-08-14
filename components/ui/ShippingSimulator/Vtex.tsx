import ShippingSimulatorCommon, {
  ShippingSimulatorVariants,
} from "$store/components/ui/ShippingSimulator/Common.tsx";
import { useCart } from "apps/vtex/hooks/useCart.ts";
import { SKU, Sla } from "apps/vtex/utils/types.ts";
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

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

export function ShippingSimulatorVtex({ items, variant }: Props) {
  const { simulate, cart } = useCart();

  const saveUserPostalCode = async (postalCode: string) => {
    try {
      const { city, state, street, neighborhood } = await fetch(
        `https://brasilapi.com.br/api/cep/v2/${postalCode}`,
      ).then((res) => res.json()) as Address;

      await invoke.vtex.actions.cart.updateAttachment({
        attachment: "shippingData",
        body: {
          selectedAddresses: [
            {
              postalCode,
              city,
              state,
              country: "BRA",
              street,
              neighborhood,
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching postal code", error);
      return;
    }
  };

  const handleRemoveUserPostalCode = () => {
    invoke.vtex.actions.cart.updateAttachment({
      attachment: "shippingData",
      body: {
        selectedAddresses: [],
      },
    });
  };

  const handleSimulateRequest = async (postalCode: string) => {
    const { logisticsInfo } = await simulate({
      items: items,
      postalCode: postalCode,
      country: cart.value?.storePreferencesData.countryCode || "BRA",
    });

    const slas = logisticsInfo.reduce(
      (acc, { slas }) => [...acc, ...slas],
      [] as Sla[],
    );

    const shippingMethods = slas.map(({ name, price, shippingEstimate }) => ({
      name: name,
      price: price,
      estimate: formatShippingEstimate(shippingEstimate) ?? shippingEstimate,
    }));

    saveUserPostalCode(postalCode);

    return shippingMethods;
  };

  return (
    <ShippingSimulatorCommon
      items={items}
      onRemoveUserPostalCode={handleRemoveUserPostalCode}
      onSimulateRequest={handleSimulateRequest}
      variant={variant}
    />
  );
}
