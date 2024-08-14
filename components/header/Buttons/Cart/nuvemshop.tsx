import { useCart } from "apps/nuvemshop/hooks/useCart.ts";
import Button from "./common.tsx";

function CartButton() {
  const { cart, loading } = useCart();
  const items = cart.value?.products ?? [];

  const _handleAnalytics = () => {
    // TODO: Implement view_cart GA4 event for nuvemshop
  };

  return (
    <Button
      loading={loading.value}
      totalItems={items.length}
    />
  );
}

export default CartButton;
