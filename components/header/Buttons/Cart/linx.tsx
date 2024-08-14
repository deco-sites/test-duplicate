import { useCart } from "apps/linx/hooks/useCart.ts";
import Button from "./common.tsx";

function CartButton() {
  const { loading, cart } = useCart();
  const cartSize = cart.value?.Basket?.Items?.length || 0;

  const _handleAnalytics = () => {
    // TODO: Implement view_cart GA4 event for linx
  };

  return (
    <Button
      loading={loading.value}
      totalItems={cartSize}
    />
  );
}

export default CartButton;
