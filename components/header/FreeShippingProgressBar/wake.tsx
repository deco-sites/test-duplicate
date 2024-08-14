import { useCart } from "apps/wake/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const { total } = cart.value;

  return <ProgressBar currency="BRL" target={target} total={total} />;
}

export default FreeShippingProgressBar;
