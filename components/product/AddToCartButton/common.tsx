import Button from "$store/components/ui/Button.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";
import { JSX } from "preact/jsx-runtime";
import { twMerge } from "$store/sdk/twMerge.ts";
import { ToAddToCart } from "deco-sites/fast-fashion/sdk/ga4/events/add_to_cart.ts";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import { sendEvent } from "deco-sites/fast-fashion/sdk/analytics/index.tsx";

export interface Props {
  /** @description: sku name */

  onAddItem: () => Promise<void>;
  variant: "plp" | "pdp";
  hideIcon?: boolean;
  children?: JSX.Element | JSX.Element[];

  class?: string;

  disabled?: boolean;
  analytics?: ToAddToCart;
}

const useAddToCart = ({ onAddItem, disabled, analytics }: Props) => {
  const loading = useSignal(false);
  const { displayCart } = useUI();

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      loading.value = true;

      await onAddItem();

      if (analytics) {
        const addToCartEvent = toAnalytics({
          type: "add_to_cart",
          data: analytics,
        });

        sendEvent(addToCartEvent);
      }

      displayCart.value = true;
    } finally {
      loading.value = false;
    }
  };

  return {
    onClick,
    loading: loading.value,
    "data-deco": "add-to-cart",
    disabled,
  };
};

export default function AddToCartButton(
  { children, class: _class, ...props }: Props,
) {
  const btnProps = useAddToCart(props);

  return (
    <Button
      {...btnProps}
      class={twMerge(
        "w-full flex-1 gap-3",
        props.variant === "pdp"
          ? "btn-primary hover:!bg-primary-400 hover:!border-primary-400"
          : "btn-outline",
        _class,
      )}
      ariaLabel="Adicionar ao carrinho"
    >
      {children ? children : (
        <>
          {props.variant === "pdp" && !props.hideIcon && (
            <Icon id="ShoppingCart" size={14} />
          )}
          Comprar
        </>
      )}
    </Button>
  );
}
