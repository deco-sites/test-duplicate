import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import QuantitySelector from "$store/components/ui/QuantitySelector.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import Image from "apps/website/components/Image.tsx";
import { OrderFormItem } from "apps/vtex/utils/types.ts";
import { useCallback, useState } from "preact/hooks";

export type CartCommonItem = {
  id?: number;
  seller?: number;
  image: {
    src: string;
    alt: string;
  };
  name: string;
  quantity: number;
  price: {
    sale: number;
    list: number;
  };
  url: string;
  vtex?: OrderFormItem;
};

export interface Props {
  item: CartCommonItem;
  index: number;

  locale: string;
  currency: string;

  onUpdateQuantity: (
    quantity: number,
    index: number,
    item?: CartCommonItem,
  ) => Promise<void>;
}

function CartItem({
  item,
  index,
  locale,
  currency,
  onUpdateQuantity,
}: Props) {
  const {
    image,
    name,
    price: { sale, list },
    quantity,
    url = "",
  } = item;
  const isGift = sale < 0.01;
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(
    <A,>(cb: (args: A) => Promise<void>) => async (e: A) => {
      try {
        setLoading(true);
        await cb(e);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleUpdateQuantity = withLoading(async (quantity: number) => {
    await onUpdateQuantity(quantity, index, item);
  });

  const handleRemoveItem = withLoading(async () => {
    await onUpdateQuantity(0, index, item);
  });

  // const imageUrl = image?.src?.replace(/(ids\/\d+)-\d+-\d+/, "$1");
  const imageUrl = image?.src.replace(/(ids\/\d+)-\d+-\d+/, "$1-150-150");

  return (
    <div class="flex flex-row justify-between gap-4">
      <a href={url}>
        <Image
          src={imageUrl}
          alt={image.alt}
          width={88}
          height={88}
          class="h-full object-cover object-center border border-neutral-300 product-aspect product-fit min-h-[88px] min-w-[88px]"
        />
      </a>

      <div class="flex flex-col">
        <a class="text-xs text-neutral-500 font-bold" href={url}>{name}</a>

        <div class="flex lg:items-end flex-col lg:flex-row lg:gap-4 font-bold mt-2 mb-2 lg:mt-auto">
          {list > sale && (
            <span class="text-neutral-400 text-xs">
              De {formatPrice(list, currency, locale)}
            </span>
          )}

          <span class="text-sm text-primary-500">
            Por {isGift ? "Grátis" : formatPrice(sale, currency, locale)}
          </span>
        </div>

        <div class="max-w-min h-[initial]">
          <QuantitySelector
            disabled={loading || isGift}
            quantity={quantity}
            onChange={handleUpdateQuantity}
          />
        </div>
      </div>

      <div class="flex items-center lg:pl-2 lg:px-3">
        <Button
          disabled={loading || isGift}
          loading={loading}
          class="btn btn-ghost btn-square !bg-transparent text-neutral-400 -mr-4"
          onClick={handleRemoveItem}
          ariaLabel="Remover item"
          title="Remover item"
        >
          <Icon id="Trash" width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}

export default CartItem;
