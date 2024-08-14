import { useCart } from "apps/wake/hooks/useCart.ts";
import BaseCart, { MinicartConfig } from "../common/Cart.tsx";
import { useEffect } from "preact/hooks";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";
import { useSignal } from "@preact/signals";

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const checkoutUrl = useSignal<string | undefined>(undefined);
  const { cart, loading, updateItem, addCoupon } = useCart();
  const items = cart.value.products ?? [];

  const total = cart.value.total ?? 0;
  const subtotal = cart.value.subtotal ?? 0;
  const locale = "pt-BR";
  const currency = "BRL";
  const coupon = cart.value.coupon ?? undefined;

  useEffect(() => {
    invoke.wake.loaders.shop().then((shop) => {
      checkoutUrl.value = shop?.checkoutUrl ?? undefined;
    });
  }, []);

  // TODO: Add analytics from WAKE
  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={items.map((item) => ({
        image: { src: item!.imageUrl!, alt: "product image" },
        quantity: item!.quantity!,
        name: item!.name!,
        url: item!.url!,
        price: { sale: item!.price!, list: item!.listPrice! },
      }))}
      total={total}
      subtotal={subtotal}
      discounts={0}
      locale={locale}
      currency={currency}
      loading={loading.value}
      coupon={coupon}
      checkoutHref={checkoutUrl}
      onAddCoupon={(code) => addCoupon({ coupon: code })}
      onUpdateQuantity={(quantity: number, index: number) =>
        updateItem({
          quantity,
          productVariantId: items[index]?.productVariantId,
        })}
      platform="wake"
    />
  );
}

export default Cart;
