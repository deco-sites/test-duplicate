import { useCart } from "apps/vtex/hooks/useCart.ts";
import BaseCart, { MinicartConfig } from "../common/Cart.tsx";
import { MarketingData } from "apps/vtex/utils/types.ts";
import type { CartCommonItem } from "../common/CartItem.tsx";
import { toAnalytics } from "$store/sdk/ga4/transform/toAnalytics.ts";
import { sendEvent } from "$store/sdk/analytics/index.tsx";

const parseVtexToAnalytics = (
  item: CartCommonItem,
  index: number,
  quantityDiff: number,
) => {
  if (!item.vtex) return null;

  return {
    items: [{
      sku: item.vtex.id,
      inProductGroupWithID: item.vtex.productId,
      name: item.vtex.name,
      seller: item.vtex.seller,
      listPrice: parseFloat((item.vtex.listPrice / 100).toFixed(2)),
      price: parseFloat((item.vtex.price / 100).toFixed(2)),
      url: `${self?.location.host}${item.vtex.detailUrl}`,
      brand: item.vtex.additionalInfo.brandName ?? "",
      category: Object.values(item.vtex.productCategories).join(">") ?? "",
      extended: { index, quantity: Math.abs(quantityDiff) },
    }],
    view: { id: "minicart", name: "Carrinho" },
  };
};

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const { cart, loading, updateItems, addCouponsToCart, sendAttachment } =
    useCart();
  const { items, totalizers } = cart.value ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = cart.value?.clientPreferencesData.locale ?? "pt-BR";
  const currency = cart.value?.storePreferencesData.currencyCode ?? "BRL";
  const coupon = cart.value?.marketingData?.coupon ?? undefined;

  const marketingData = cart.value?.marketingData;

  const sellerCode = marketingData?.utmSource === "Sem vendedor"
    ? undefined
    : marketingData?.utmSource;

  const handleAddSellerCode = async (sellerCode: string) => {
    const text = sellerCode;

    const newMarketingData = {
      ...marketingData,
      utmSource: text ? text : "Sem vendedor",
    } as MarketingData;

    await sendAttachment({
      attachment: "marketingData",
      body: newMarketingData,
    });
  };

  const onRemoveSellerCode = async () => {
    const newMarketingData = {
      ...marketingData,
      utmSource: "Sem vendedor",
    } as MarketingData;

    await sendAttachment({
      attachment: "marketingData",
      body: newMarketingData,
    });
  };

  const handleQuantityUpdate = async (
    quantity: number,
    index: number,
    item?: CartCommonItem,
  ) => {
    await updateItems({ orderItems: [{ index, quantity }] });
    if (!item) return;

    const quantityDiff = quantity - item.quantity;

    const analytics = parseVtexToAnalytics(
      item,
      index,
      quantityDiff,
    );

    if (!analytics) return;

    const removeFromCartEvent = toAnalytics({
      type: "remove_from_cart",
      data: analytics,
    });

    const addToCartEvent = toAnalytics({
      type: "add_to_cart",
      data: analytics,
    });

    const currentEvent = quantityDiff < 0
      ? removeFromCartEvent
      : addToCartEvent;

    sendEvent(currentEvent);
  };

  const commonItems = items.map((item) => ({
    id: Number(item.id),
    seller: Number(item.seller),
    image: { src: item.imageUrl, alt: item.skuName },
    quantity: item.quantity,
    name: item.name,
    url: item.detailUrl,
    price: {
      sale: item.sellingPrice / 100,
      list: item.listPrice / 100,
    },
    vtex: { ...item },
  }));

  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={commonItems}
      sellerCode={sellerCode}
      onAddSellerCode={handleAddSellerCode}
      onRemoveSellerCode={onRemoveSellerCode}
      total={(total - discounts) / 100}
      subtotal={total / 100}
      discounts={discounts / 100}
      locale={locale}
      currency={currency}
      loading={loading.value}
      coupon={coupon}
      onAddCoupon={(text) => addCouponsToCart({ text })}
      onUpdateQuantity={handleQuantityUpdate}
      checkoutHref="/checkout"
      platform="vtex"
    />
  );
}

export default Cart;
