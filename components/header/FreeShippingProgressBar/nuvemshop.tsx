import { useCart } from "apps/nuvemshop/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const currency = cart.value?.currency ?? "BRL";
  const total = cart.value?.total ?? 0;

  return (
    <ProgressBar currency={currency} target={target} total={Number(total)} />
  );
}

export default FreeShippingProgressBar;
