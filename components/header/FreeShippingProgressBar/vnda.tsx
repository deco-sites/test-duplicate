import { useCart } from "apps/vnda/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const total = cart.value?.orderForm?.total ?? 0;

  return <ProgressBar currency="BRL" total={total} target={target} />;
}

export default FreeShippingProgressBar;
