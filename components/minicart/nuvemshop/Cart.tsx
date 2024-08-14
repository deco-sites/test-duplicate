import { useCart } from "apps/nuvemshop/hooks/useCart.ts";
import BaseCart, { MinicartConfig } from "../common/Cart.tsx";

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const { cart, loading, updateItems } = useCart();

  const items = cart.value?.products ?? [];
  const coupons = cart.value?.coupon;
  const coupon = coupons && coupons[0];
  const locale = "pt-BR";
  const currency = cart.value?.currency ?? "BRL";
  const total = cart.value?.total ?? 0;
  const subTotal = cart.value?.subtotal ?? 0;
  const checkoutHref =
    `/checkout/v3/start/${cart.value?.id}/${cart.value?.token}`;

  // TODO: Add analytics from Nuvemshop
  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={items?.map((item) => ({
        image: {
          src: item.image.src,
          alt: item.image.alt[0] as string,
        },
        url: item.url,
        quantity: item.quantity,
        name: item.name,
        price: {
          sale: Number(item.price),
          list: Number(item.compare_at_price),
        },
      }))}
      total={Number(total)}
      subtotal={Number(subTotal)}
      discounts={0}
      locale={locale}
      currency={currency}
      loading={loading.value}
      checkoutHref={checkoutHref}
      coupon={coupon as string}
      onUpdateQuantity={(quantity, index) =>
        updateItems({
          quantity: quantity,
          itemId: items[index].id,
        })}
    />
  );
}

export default Cart;
