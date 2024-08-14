import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { clx } from "$store/sdk/clx.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { useSignal, useSignalEffect } from "@preact/signals";
import type { SKU } from "apps/vtex/utils/types.ts";
import { useUI } from "deco-sites/fast-fashion/sdk/useUI.ts";
import { useCallback } from "preact/hooks";

export type ShippingSimulatorVariants = "pdp" | "cart";

export interface Props {
  items: Array<SKU>;
  variant?: ShippingSimulatorVariants;
  onSimulateRequest: (postalCode: string) => Promise<ShippingItem[]>;
  onRemoveUserPostalCode?: () => void;
}

export interface ShippingItem {
  name: string;
  estimate: string;
  price: number;
}

function ShippingContent({
  shippingItems,
  variant,
  maxItems,
}: {
  shippingItems: ShippingItem[] | null;
  variant: "pdp" | "cart";
  maxItems?: number;
}) {
  if (shippingItems == null) {
    return null;
  }

  if (maxItems) {
    shippingItems = shippingItems.slice(0, maxItems);
  }

  const locale = "pt-BR";
  const currencyCode = "BRL";

  if (shippingItems.length === 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <div
      class={clx(
        "w-full py-2",
        variant === "cart"
          ? "border-b border-solid border-neutral-300 pb-1.5"
          : "pb-2",
      )}
    >
      <table class="gap-4 w-full">
        {shippingItems.map(({ name, estimate, price }) => (
          <tr class="">
            <th class="font-bold text-left w-auto">{name}</th>
            <th class="font-normal text-left px-3 w-28">{estimate}</th>
            <th class="font-bold text-right py-1.5 w-auto">
              {price === 0
                ? "Grátis"
                : formatPrice(price / 100, currencyCode, locale)}
            </th>
          </tr>
        ))}
      </table>
    </div>
  );
}

function ShippingSimulatorCommon({
  variant = "pdp",
  onSimulateRequest,
  onRemoveUserPostalCode,
}: Props) {
  const { displayCart } = useUI();
  const loading = useSignal(false);
  const shippingItems = useSignal<ShippingItem[] | null>(null);
  const postalCode = useSignal(localStorage.getItem("postalCode") || "");

  const saveUserPostalCode = (postalCode: string) => {
    localStorage.setItem("postalCode", postalCode);
  };

  const removeUserPostalCode = () => {
    try {
      onRemoveUserPostalCode?.();

      localStorage.removeItem("postalCode");
    } catch (error) {
      console.error("Error removing postal code", error);
      return;
    }
  };

  const handleSimulation = useCallback(async () => {
    if (postalCode.value.length > 9 || postalCode.value.length < 8) {
      return;
    }

    try {
      loading.value = true;

      shippingItems.value = await onSimulateRequest(postalCode.value);

      saveUserPostalCode(postalCode.value);
    } finally {
      loading.value = false;
    }
  }, []);

  useSignalEffect(() => {
    if (displayCart.value && shippingItems.value === null) {
      handleSimulation();
    }
  });

  return (
    <div class="flex flex-col gap-2">
      <div
        class={clx(
          "flex justify-between gap-4",
          variant === "pdp" ? "items-start max-lg:flex-col" : "items-center",
        )}
      >
        <div class="flex flex-col font-bold">
          <span>{variant === "cart" ? "Frete" : "Calcule o Frete:"}</span>
        </div>

        {shippingItems.value === null || variant === "pdp"
          ? (
            <div
              class={clx(
                "flex-1 max-w-[264px]",
                variant === "pdp" ? "max-lg:max-w-none w-full" : "",
              )}
            >
              <form
                class="flex gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimulation();
                }}
              >
                <div
                  class="relative w-full group/input"
                  data-success={Boolean(shippingItems.value)}
                >
                  <input
                    as="input"
                    type="text"
                    class="input h-12 text-sm placeholder:text-neutral-400 border border-neutral-300 w-full outline-none bg-transparent group-data-[success='true']/input:border-success-500"
                    placeholder="Digite seu CEP"
                    value={postalCode.value}
                    maxLength={9}
                    size={9}
                    onChange={(e: { currentTarget: { value: string } }) => {
                      postalCode.value = e.currentTarget.value;
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  class="btn-primary hover:!bg-primary-400 hover:!border-primary-400 h-12 w-24"
                  loading={loading.value}
                  ariaLabel="Calcular"
                >
                  Calcular
                </Button>
              </form>
              {variant === "pdp" && (
                <a
                  class="block text-info-500 underline mt-2"
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                >
                  Não sei meu CEP
                </a>
              )}
            </div>
          )
          : (
            <Button
              class="gap-2 text-primary btn-ghost h-8 min-h-8 hover:bg-transparent p-0"
              onClick={() => {
                postalCode.value = "";
                shippingItems.value = null;
                removeUserPostalCode();
              }}
            >
              {postalCode.value}{" "}
              <Icon id="Close" size={24} class="text-neutral-600" />
            </Button>
          )}
      </div>

      <ShippingContent
        shippingItems={shippingItems.value}
        variant={variant}
        maxItems={variant === "cart" ? 1 : undefined}
      />
    </div>
  );
}

export default ShippingSimulatorCommon;
