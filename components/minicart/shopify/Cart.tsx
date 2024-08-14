import { useCart } from "apps/shopify/hooks/useCart.ts";
import BaseCart from "../common/Cart.tsx";
import { MinicartConfig } from "deco-sites/fast-fashion/components/minicart/common/Cart.tsx";

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const { cart, loading, updateItems, addCouponsToCart } = useCart();
  const items = cart.value?.lines?.nodes ?? [];
  const coupons = cart.value?.discountCodes;
  const coupon = coupons && coupons[0]?.applicable
    ? coupons[0].code
    : undefined;
  const locale = "pt-BR";
  const currency = cart.value?.cost?.totalAmount.currencyCode ?? "BRL";
  const total = cart.value?.cost?.totalAmount.amount ?? 0;
  const subTotal = cart.value?.cost?.subtotalAmount.amount ?? 0;
  const checkoutHref = cart.value?.checkoutUrl
    ? new URL(cart.value?.checkoutUrl).pathname
    : "";

  // TODO: Add analytics from Shopify
  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={items?.map((item) => ({
        image: {
          src: item.merchandise.image?.url ?? "",
          alt: item.merchandise.image?.altText ?? "",
        },
        url: item.merchandise.product.url,
        quantity: item.quantity,
        name: item.merchandise.product.title,
        price: {
          sale: item.cost.compareAtAmountPerQuantity?.amount,
          list: item.cost.amountPerQuantity.amount,
        },
      }))}
      total={total}
      subtotal={subTotal}
      discounts={0}
      locale={locale}
      currency={currency}
      loading={loading.value}
      checkoutHref={checkoutHref}
      coupon={coupon}
      onAddCoupon={(text) => addCouponsToCart({ discountCodes: [text] })}
      onUpdateQuantity={(quantity, index) =>
        updateItems({
          lines: [
            {
              id: items[index].id,
              quantity: quantity,
            },
          ],
        })}
    />
  );
}

export default Cart;
