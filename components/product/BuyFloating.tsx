import { Product } from "apps/commerce/types.ts";
import {
  ProductAddToCart,
  ProductPrices,
} from "$store/components/product/ProductInfo.tsx";
import { TriggerElement } from "$store/islands/TriggerElement.tsx";
import { clx } from "$store/sdk/clx.ts";

interface BuyFloatingProps {
  product: Product;
}

const TRIGGER_ATTRIBUTE = "data-show";
const ELEMENT_ID = "buy-floating";
const ELEMENT_OFFSET = -500;

export const BuyFloating = ({ product }: BuyFloatingProps) => {
  return (
    <div id={ELEMENT_ID} class="group w-full">
      <div
        class={clx(
          "w-full shadow-3xl p-2 md:py-3 md:pl-6 fixed bottom-0 z-40 bg-base-100 translate-y-full duration-300",
          "group-data-[show='true']:translate-y-0",
        )}
        data-show="false"
      >
        <div class="flex items-center justify-between gap-2">
          <ProductPrices product={product} variant="buyFloating" />
          <ProductAddToCart
            product={product}
            quantitySelector={false}
            hideIcon
          />
        </div>
        <TriggerElement
          id={ELEMENT_ID}
          offset={ELEMENT_OFFSET}
          trigger={TRIGGER_ATTRIBUTE}
        />
      </div>
    </div>
  );
};
