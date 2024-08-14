import { useCart } from "apps/shopify/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const currency = cart.value?.cost?.totalAmount.currencyCode ?? "BRL";
  const total = cart.value?.cost?.totalAmount.amount ?? 0;

  return <ProgressBar currency={currency} target={target} total={total} />;
}

export default FreeShippingProgressBar;
