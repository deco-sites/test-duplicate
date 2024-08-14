import { useCart } from "apps/wake/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";
import QuantitySelector from "deco-sites/fast-fashion/components/ui/QuantitySelector.tsx";
import { useSignal } from "@preact/signals";
import { ToAddToCart } from "deco-sites/fast-fashion/sdk/ga4/events/add_to_cart.ts";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  productID: string;
  quantity?: number;
  quantitySelector?: boolean;
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
  productID,
  quantitySelector,
  variant,
  analytics,
}: Props) {
  const quantity = useSignal(1);
  const { addItem } = useCart();

  const handleQuantityChange = (value: number) => {
    quantity.value = value;
  };

  const updatedAnalytics = analytics &&
    getUpdatedQuantityAnalytics(quantity.value, analytics);

  const handleAddItem = () => {
    // TODO: Implement analytics mapping

    return addItem({
      productVariantId: Number(productID),
      quantity: quantity.value,
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
      />
    </div>
  );
}

export default AddToCartButton;
