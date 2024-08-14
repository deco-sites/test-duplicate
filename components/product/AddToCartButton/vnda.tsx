import { PropertyValue } from "apps/commerce/types.ts";
import { useCart } from "apps/vnda/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  productID: string;
  additionalProperty: PropertyValue[];
  quantity?: number;
}

function AddToCartButton({
  productID,
  additionalProperty,
  quantity = 1,
  variant,
}: Props) {
  const { addItem } = useCart();
  const onAddItem = () => {
    // TODO: Implement analytics mapping

    return addItem({
      quantity,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    });
  };

  return <Button onAddItem={onAddItem} variant={variant} />;
}

export default AddToCartButton;
