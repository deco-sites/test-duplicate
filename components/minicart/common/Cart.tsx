import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useUI } from "$store/sdk/useUI.ts";
import { SKU } from "apps/vtex/utils/types.ts";
import SellerCode from "$store/components/minicart/common/SellerCode.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import ShippingSimulator from "$store/components/ui/ShippingSimulator/ShippingSimulator.tsx";
import CartItem, { CartCommonItem, Props as ItemProps } from "./CartItem.tsx";
import Coupon, { Props as CouponProps } from "./Coupon.tsx";
import { Platform } from "deco-sites/fast-fashion/apps/site.ts";

export interface MinicartConfig {
  /**
   *  @title Cupom
   *  @description Mostrar input de cupom
   */
  showCoupon?: boolean;
  /**
   *  @title codigo do vendedor
   *  @description Mostrar input de código do vendedor
   */
  showSellerCode?: boolean;
  /**
   * @title Calculadora de frete
   * @description Mostrar calculadora de frete
   */
  showShippingSimulator?: boolean;
}

interface Props {
  minicartConfig?: MinicartConfig;
  items: CartCommonItem[];
  loading: boolean;
  total: number;
  subtotal: number;
  discounts: number;
  locale: string;
  currency: string;
  coupon?: string;
  checkoutHref: string;
  sellerCode?: string;
  platform?: Platform;
  onAddSellerCode?: (sellerCode: string) => void;
  onAddCoupon?: CouponProps["onAddCoupon"];
  onRemoveSellerCode?: () => void;
  onUpdateQuantity: ItemProps["onUpdateQuantity"];
}

function Cart({
  items,
  total,
  locale,
  coupon,
  loading,
  currency,
  discounts,
  checkoutHref,
  sellerCode,
  platform,
  minicartConfig,
  onAddSellerCode,
  onRemoveSellerCode,
  onUpdateQuantity,
  onAddCoupon,
}: Props) {
  const { displayCart } = useUI();
  const isEmpty = items.length === 0;
  const totalItems = items.length;

  const onClose = () => {
    displayCart.value = false;
  };

  return (
    <div
      class="flex flex-col justify-center items-center overflow-hidden text-neutral-500 h-full text-sm max-h-svh"
      style={{
        minWidth: "calc(min(100vw, 425px))",
        maxWidth: "calc(min(100vw, 425px))",
      }}
    >
      {/* Header */}
      <header class="flex pl-4 pt-3 pr-0 justify-between items-center w-full">
        <div class="flex gap-2 items-center">
          <p class="text-lg font-bold">Meu Carrinho</p>
          {totalItems
            ? (
              <p class="flex gap-1 items-center text-neutral-400 leading-none">
                <span class="">({String(totalItems).padStart(2, "0")})</span>
                <span class="">{totalItems === 1 ? "item" : "itens"}</span>
              </p>
            )
            : (
              <p class="flex gap-1 items-center normal-case text-neutral-400 leading-none">
                <span class="">(0) itens</span>
              </p>
            )}
        </div>
        <Button
          class="btn btn-square btn-ghost !bg-transparent p-2 border-none  min-h-full text-gray-600"
          onClick={onClose}
        >
          <Icon id="Close" width={24} height={24} />
        </Button>
      </header>
      {/* Body */}
      {isEmpty
        ? (
          <div class="flex flex-col items-center flex-1 gap-6 w-full">
            <div class="flex justify-center items-center flex-col max-w-[210px] w-full mt-36">
              <Icon
                id="ShoppingCart"
                width={33}
                height={33}
                class="mb-6 text-primary"
              />

              <p class="font-semibold text-center text-base">
                Seu carrinho está vazio
              </p>

              <p class="mb-6 text-center">
                Adicione produtos ao carrinho para finalizar sua compra.
              </p>

              <Button
                ariaLabel="Voltar às compras"
                title="Voltar às compras"
                class="w-full h-12 btn-primary"
                onClick={() => {
                  displayCart.value = false;
                }}
              >
                Voltar às compras
              </Button>
            </div>
          </div>
        )
        : (
          <>
            {/* Cart Items */}
            <ul
              role="list"
              class="h-full overflow-y-auto flex flex-col gap-6 w-full scrollbar px-4 my-5"
            >
              {items.map((item, index) => (
                <li key={index}>
                  <CartItem
                    item={item}
                    index={index}
                    locale={locale}
                    currency={currency}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                </li>
              ))}
            </ul>
            {/* Cart Footer */}
            <footer class="w-full p-4 flex flex-col gap-2 shadow-3xl">
              {/* !!! Seler code component works only in vtex, todo: make it agnostic */}
              {minicartConfig?.showSellerCode && onAddSellerCode && (
                <SellerCode
                  onAddSellerCode={onAddSellerCode}
                  onRemoveSellerCode={onRemoveSellerCode}
                  sellerCode={sellerCode}
                  loading={loading}
                />
              )}
              {minicartConfig?.showCoupon && onAddCoupon && (
                <Coupon onAddCoupon={onAddCoupon} coupon={coupon} />
              )}

              {minicartConfig?.showShippingSimulator && platform && (
                <ShippingSimulator
                  // @ts-expect-error: THIS CODE ONLY WORKS USING VTEX AS PLATFORM. The id and seller from items can be undefined but are required in the shipping simulator, in the VTEX implementation of the `items` array both keys are not undefined
                  items={items as Array<SKU>}
                  variant="cart"
                  platform={platform}
                />
              )}

              <div class="flex flex-col gap-4 py-2">
                {/* Total */}
                {discounts > 0 && (
                  <div class="flex justify-between items-center ">
                    <span>Descontos</span>
                    <span>{formatPrice(discounts, currency, locale)}</span>
                  </div>
                )}

                <div class="flex justify-between items-center w-full font-bold">
                  <span>Subtotal</span>
                  <span class="font-medium">
                    {formatPrice(total, currency, locale)}
                  </span>
                </div>

                <span class="block text-xs leading-[14px]">
                  O valor total, incluindo frete e desconto de acordo com o
                  método de pagamento, poderá ser selecionado durante a
                  finalização da compra.
                </span>

                <div class="flex gap-2">
                  <Button
                    class="h-12 btn-primary btn-outline flex-1 p-0 group"
                    onClick={() => {
                      displayCart.value = false;
                    }}
                    ariaLabel="Voltar às compras"
                    title="Voltar às compras"
                  >
                    <span class="text-neutral group-hover:text-primary-content">
                      Voltar às compras
                    </span>
                  </Button>
                  <a class="inline-block flex-1" href={checkoutHref}>
                    <Button
                      data-deco="buy-button"
                      class="w-full btn-success p-0"
                      disabled={loading || isEmpty}
                      onClick={() => {
                        // TODO: Add analytics (GA4) (begin_checkout)
                      }}
                    >
                      Finalizar compra
                    </Button>
                  </a>
                </div>
              </div>
            </footer>
          </>
        )}
    </div>
  );
}

export default Cart;
