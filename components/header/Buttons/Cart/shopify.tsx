import { useCart } from "apps/shopify/hooks/useCart.ts";
import Button from "./common.tsx";

function CartButton() {
  const { cart, loading } = useCart();
  const items = cart.value?.lines?.nodes ?? [];

  const _handleAnalytics = () => {
    // TODO: Implement view_item GA4 event for shopify
  };

  return (
    <Button
      loading={loading.value}
      totalItems={items.length}
    />
  );
}

export default CartButton;
