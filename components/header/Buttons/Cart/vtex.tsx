import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useComputed } from "@preact/signals";
import Button from "./common.tsx";
import { toAnalytics } from "$store/sdk/ga4/transform/toAnalytics.ts";
import { sendEvent } from "deco-sites/fast-fashion/sdk/analytics/index.tsx";

function CartButton() {
  const { loading, cart } = useCart();
  const { items = [] } = cart.value ?? {};

  const viewCartEvent = useComputed(() => {
    return toAnalytics({
      type: "view_cart",
      data: {
        items: cart.value?.items.map((item, index) => ({
          sku: item.id,
          inProductGroupWithID: item.productId,
          name: item.name,
          seller: item.seller,
          listPrice: parseFloat((item.listPrice / 100).toFixed(2)),
          price: parseFloat((item.price / 100).toFixed(2)),
          url: `${self?.location.host}${item.detailUrl}`,
          brand: item.additionalInfo.brandName ?? "",
          category: Object.values(item.productCategories).join(">") ?? "",
          extended: { index, quantity: item.quantity },
        })) ?? [],
        view: { id: "minicart", name: "Carrinho" },
      },
    });
  });

  const handleAnalytics = () => {
    sendEvent(viewCartEvent.value);
  };

  return (
    <Button
      loading={loading.value}
      totalItems={items.length}
      handleViewCart={handleAnalytics}
    />
  );
}

export default CartButton;
