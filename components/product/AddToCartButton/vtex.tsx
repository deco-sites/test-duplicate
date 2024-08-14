import { useCart } from "apps/vtex/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";
import { useSignal } from "@preact/signals";
import { ToAddToCart } from "deco-sites/fast-fashion/sdk/ga4/events/add_to_cart.ts";
import { AddToCartItem } from "deco-sites/fast-fashion/components/product/AddToCartButton/AddToCartButton.tsx";
import QuantitySelector from "deco-sites/fast-fashion/components/ui/QuantitySelector.tsx";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  quantitySelector?: boolean;
  quantity?: number;
  items: AddToCartItem[];
  analytics?: ToAddToCart;
}

const getUpdatedQuantityAnalytics = (
  quantity: number,
  analytics: ToAddToCart,
) => {
  return {
    ...analytics,
    items: analytics.items.map((item) => ({
      ...item,
      extended: {
        ...item.extended,
        quantity,
      },
    })),
  };
};

function AddToCartButton({
  items,
  quantitySelector = true,
  variant = "plp",
  analytics,
  ...rest
}: Props) {
  const quantity = useSignal(1);

  const handleQuantityChange = (value: number) => {
    quantity.value = value;
  };

  const updatedAnalytics = analytics &&
    getUpdatedQuantityAnalytics(quantity.value, analytics);

  const { addItems } = useCart();

  const handleAddItem = () => {
    return addItems({
      orderItems: items.map((item) => ({
        ...item,
        quantity: quantity.value,
      })),
    });
  };

  return (
    <div
      class={clx(
        variant === "plp" ? "grid" : "flex items-center justify-between gap-10",
        quantitySelector && variant === "plp"
          ? "md:grid-cols-2"
          : "grid-cols-1",
      )}
    >
      {quantitySelector && (
        <div
          class={clx(
            "flex items-center",
            variant === "pdp"
              ? "flex-col"
              : "items-start justify-between max-md:hidden",
          )}
        >
          {variant === "pdp" && (
            <span class="text-sm font-bold">Quantidade:</span>
          )}
          <QuantitySelector
            quantity={quantity.value}
            onChange={handleQuantityChange}
          />
        </div>
      )}
      <Button
        onAddItem={handleAddItem}
        variant={variant}
        analytics={updatedAnalytics}
        {...rest}
      />
    </div>
  );
}

export default AddToCartButton;
