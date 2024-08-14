import { useCart } from "apps/vnda/hooks/useCart.ts";
import Button from "./common.tsx";

function CartButton() {
  const { loading, cart } = useCart();
  const items = cart.value?.orderForm?.items ?? [];

  const _handleAnalytics = () => {
    // TODO: Implement view_item GA4 event for VNDA
  };

  return (
    <Button
      totalItems={items.length}
      loading={loading.value}
    />
  );
}

export default CartButton;
