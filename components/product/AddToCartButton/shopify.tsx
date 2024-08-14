import { useCart } from "apps/shopify/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";

export type Props = Omit<BtnProps, "onAddItem"> & {
  productID: string;
  quantity?: number;
};

function AddToCartButton({
  productID,
  quantity = 1,
  variant,
}: Props) {
  const { addItems } = useCart();
  const onAddItem = () => {
    // TODO: Implement analytics mapping

    return addItems({
      lines: {
        merchandiseId: productID,
        quantity,
      },
    });
  };

  return <Button onAddItem={onAddItem} variant={variant} />;
}

export default AddToCartButton;
