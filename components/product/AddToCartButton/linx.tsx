import { useCart } from "apps/linx/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";

export type Props = Omit<BtnProps, "onAddItem"> & {
  productID: string;
  productGroupID: string;
  quantity?: number;
};

function AddToCartButton({
  productGroupID,
  productID,
  quantity = 1,
  variant,
}: Props) {
  const { addItem } = useCart();

  const onAddItem = () => {
    // TODO: Implement analytics mapping

    return addItem({
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: quantity,
    });
  };

  return (
    <Button
      variant={variant}
      onAddItem={onAddItem}
    />
  );
}

export default AddToCartButton;
