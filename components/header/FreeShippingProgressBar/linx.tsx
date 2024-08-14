import { useCart } from "apps/linx/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const cartSize = cart.value?.Basket?.Items?.length || 0;

  return <ProgressBar currency="BRL" total={cartSize} target={target} />;
}

export default FreeShippingProgressBar;
