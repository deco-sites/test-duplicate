import { useCart } from "apps/vtex/hooks/useCart.ts";
import ProgressBar from "./common.tsx";

export interface Props {
  target: number;
}

function FreeShippingProgressBar({ target }: Props) {
  const { cart } = useCart();
  const {
    totalizers = [],
    storePreferencesData,
  } = cart.value ?? {};
  const currency = storePreferencesData?.currencyCode ?? "BRL";
  const total = totalizers.find((item) => item.id === "Items")?.value ?? 0;
  const discounts =
    (totalizers.find((item) => item.id === "Discounts")?.value ?? 0) * -1;

  return (
    <ProgressBar
      currency={currency}
      target={target}
      total={(total - discounts) / 100}
    />
  );
}

export default FreeShippingProgressBar;
