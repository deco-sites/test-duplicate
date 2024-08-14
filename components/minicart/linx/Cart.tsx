import { useCart } from "apps/linx/hooks/useCart.ts";
import BaseCart, { MinicartConfig } from "../common/Cart.tsx";

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const { cart, loading, updateItem } = useCart();
  const items = cart.value?.Basket?.Items ?? [];

  const total = cart.value?.Basket?.Total ?? 0;
  const subtotal = cart.value?.Basket?.SubTotal ?? 0;
  const locale = "pt-BR";
  const currency = "BRL";
  const coupon = cart.value?.Basket?.Coupons?.[0]?.Code ?? undefined;

  // TODO: Add analytics from LINX
  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={items.map((item) => ({
        image: { src: item!.ImagePath!, alt: "product image" },
        quantity: item!.Quantity!,
        name: item!.Name!,
        url: item!.UrlFriendly,
        price: { sale: item!.RetailPrice!, list: item!.ListPrice! },
      }))}
      total={total}
      subtotal={subtotal}
      discounts={0}
      locale={locale}
      currency={currency}
      loading={loading.value}
      coupon={coupon?.toString()}
      checkoutHref="/carrinho"
      onUpdateQuantity={(quantity: number, index: number) =>
        updateItem({
          Quantity: quantity,
          BasketItemID: items[index]?.BasketItemID,
        })}
    />
  );
}

export default Cart;
