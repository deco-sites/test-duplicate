import { useCart } from "apps/wake/hooks/useCart.ts";
import Button from "./common.tsx";

function CartButton() {
  const { loading, cart } = useCart();
  const { products } = cart.value;

  const _handleAnalytics = () => {
    // TODO: Implement view_cart GA4 event for wake
  };

  return (
    <Button
      loading={loading.value}
      totalItems={(products ?? []).length}
    />
  );
}

export default CartButton;
