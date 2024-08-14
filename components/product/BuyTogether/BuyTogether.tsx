import SliderJS from "$store/islands/SliderJS.tsx";
import type {
  Product,
  ProductDetailsPage,
  PropertyValue,
} from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useId } from "preact/hooks";
import AddToCartButtonVtex from "$store/components/product/AddToCartButton/vtex.tsx";
import AddToCartButtonWake from "$store/components/product/AddToCartButton/wake.tsx";
import { getElementsInsideContainer } from "$store/components/ui/SliderJS.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import { AppContext, Platform } from "$store/apps/site.ts";
import { LoaderReturnType, SectionProps } from "deco/types.ts";
import {
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { CurrentItem } from "$store/components/product/BuyTogether/CurrentItem.tsx";
import { ExtraProductItem } from "$store/components/product/BuyTogether/ExtraProductItem.tsx";
import { JSX } from "preact/jsx-runtime";
import { useVariantPossibilities } from "../../../sdk/useVariantPossibilities.ts";

/**
 * @title {{value}}
 */
export interface VariantSetting {
  key: string;
  value: string;
  selectMessage?: string;
}

export interface Props {
  page: ProductDetailsPage | null;
  products: LoaderReturnType<Product[] | null>;
  title: string;
  itemsPerPage?: number;
}

type Data = {
  productGroupID: string;
  productID: string;
  quantity: number;
  name: string;
  seller: string;
  discount: number;
  listPrice: number;
  sku: string;
  price: number;
  additionalProperty: PropertyValue[];
  image: string | undefined;
};

const addToCartButtonModifiers: Record<
  Platform,
  (props: { data: Signal<Data[]>; allSelected: boolean }) => JSX.Element
> = {
  "vtex": ({ data, allSelected }) => (
    <AddToCartButtonVtex
      items={data.value.map((item) => ({
        id: item.sku,
        quantity: item.quantity,
        seller: item.seller,
      }))}
      quantitySelector={false}
      disabled={!allSelected}
      class="btn disabled:cursor-not-allowed disabled:bg-success-500 disabled:text-neutral-100 max-w-[195px] mx-auto block"
      variant="pdp"
    >
      <span class="font-bold">Compre junto</span>
    </AddToCartButtonVtex>
  ),
  "wake": ({ data, allSelected }) => (
    <AddToCartButtonWake
      productID={data.value[0].productID}
      disabled={!allSelected}
      variant="pdp"
      class="btn disabled:cursor-not-allowed disabled:bg-success-500 disabled:text-neutral-100 max-w-[195px] mx-auto block"
    >
      <span class="text-sm">Compre junto</span>
    </AddToCartButtonWake>
  ),
  "linx": () => <div></div>,
  "vnda": () => <div></div>,
  "shopify": () => <div></div>,
  "custom": () => <div></div>,
  "nuvemshop": () => <div></div>,
};

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return {
    ...props,
    device: ctx.device,
    platform: ctx.platform,
    productImageAspectRatio: ctx.theme?.props.productImages?.aspectRatio,
    productImageFit: ctx.theme?.props.productImages?.fit,
  };
};

function ProductBuyTogether(
  { title, page, platform, products, productImageAspectRatio, productImageFit }:
    SectionProps<
      typeof loader
    >,
) {
  if (
    !page || (!page.product.isRelatedTo?.length && !products?.length)
  ) return null;

  const rootId = useId();

  const hasTriedToBuy = useSignal(false);

  const relatedProducts = (products ||
    page.product.isRelatedTo?.filter((p) =>
      p.additionalType === "BuyTogether"
    ) ||
    []).filter((i) => {
      const { availability } = useOffer(i.offers);
      const isAvailable = availability === "https://schema.org/InStock";

      return isAvailable && i.productID !== page.product.productID;
    });

  const extraProducts = useComputed(() => {
    return relatedProducts.map((product) => {
      const hasVariant = product.isVariantOf?.hasVariant ?? [];
      const variantPossibilities = useVariantPossibilities(
        hasVariant,
        actualSecondaryVariant.value ?? product,
      );

      const firstNamePossibility = Object.keys(variantPossibilities)[0] ?? "";
      const firstValuePossibility = Object.values(variantPossibilities)[0];

      const secondNamePossibility = Object.keys(variantPossibilities)[1] ?? "";
      const secondValuePossibility = Object.values(variantPossibilities)[1];

      return {
        product,
        firstPossibility: {
          key: firstNamePossibility,
          value: firstValuePossibility,
        },
        secondPossibility: {
          key: secondNamePossibility,
          value: secondValuePossibility,
        },
      };
    });
  });

  const skuSecondarySelected = useSignal<string | undefined>(undefined);

  const index = useSignal<number>(0);

  const actualSecondaryProduct = useSignal<
    typeof extraProducts.value[number] | undefined
  >(undefined);

  const actualSecondaryVariant = useComputed(() => {
    if (
      actualSecondaryProduct.value?.product.isVariantOf?.hasVariant.length === 1
    ) {
      return actualSecondaryProduct.value.product.isVariantOf?.hasVariant[0];
    }

    return actualSecondaryProduct.value?.product.isVariantOf?.hasVariant.find(
      (variant) => {
        return variant.url === skuSecondarySelected.value;
      },
    );
  });

  const actualSecondaryOffer = useOffer(actualSecondaryVariant.value?.offers);

  const availableMainSkus = useSignal<Set<string>>(
    new Set(
      page.product.isVariantOf?.hasVariant
        .map((i) =>
          i.offers?.offers[0].availability === "https://schema.org/InStock" &&
          i.url
        )
        .filter(Boolean),
    ) as Set<string>,
  );

  const availableSecondarySkus = useSignal<Set<string>>(
    new Set() as Set<string>,
  );

  useSignalEffect(() => {
    actualSecondaryProduct.value = extraProducts.value[index.value];

    availableSecondarySkus.value = new Set(
      extraProducts.value[index.value].product.isVariantOf?.hasVariant
        .map((i) => i.offers?.offers[0].inventoryLevel.value && i.url)
        .filter(Boolean),
    ) as Set<string>;
  });

  const selectedMainSkuUrl = useSignal(page.product.url);

  const currentVariantMain = useComputed(() => {
    return page.product.isVariantOf?.hasVariant.find((variant) => {
      return variant.url === selectedMainSkuUrl.value;
    });
  });

  const actualProductMainOffer = useOffer(currentVariantMain.value?.offers);

  const buyTogetherData = useComputed<Data[]>(() => {
    return [{
      productGroupID: currentVariantMain?.value?.inProductGroupWithID ?? "",
      productID: currentVariantMain?.value?.productID ?? "",
      quantity: 1,
      sku: currentVariantMain?.value?.sku ?? "",
      name: currentVariantMain?.value?.name ?? "",
      seller: actualProductMainOffer.seller ??
        "1",
      discount: actualProductMainOffer.listPrice && actualProductMainOffer.price
        ? actualProductMainOffer.listPrice - actualProductMainOffer.price
        : 0,
      listPrice: actualProductMainOffer.listPrice ?? 0,
      price: actualProductMainOffer.price ?? 0,
      additionalProperty: currentVariantMain?.value?.additionalProperty ?? [],
      image: currentVariantMain?.value?.image?.[0].url,
    }, {
      additionalProperty: actualSecondaryVariant?.value?.additionalProperty ??
        [],
      discount: Math.max(
        (actualSecondaryOffer.listPrice ?? 0) -
          (actualSecondaryOffer.price ?? 0),
        0,
      ),
      sku: actualSecondaryVariant?.value?.sku ?? "",
      name: actualSecondaryVariant?.value?.name ?? "",
      price: actualSecondaryOffer.price ?? 0,
      listPrice: actualSecondaryOffer.listPrice ?? 0,
      productGroupID: actualSecondaryVariant?.value?.inProductGroupWithID ??
        "",
      productID: actualSecondaryVariant?.value?.productID ?? "",
      quantity: 1,
      seller: actualSecondaryOffer.seller ??
        "1",
      image: actualSecondaryVariant?.value?.image?.[0].url ?? "",
    }];
  });

  const allSelected = buyTogetherData.value.every((product) =>
    product.productID
  );

  const secondaryPrice = actualSecondaryOffer.price ?? 0;
  const mainPrice = actualProductMainOffer.price ?? 0;

  if (allSelected) {
    hasTriedToBuy.value = false;
  }

  return (
    <div class="w-full select-none">
      <div class="container flex flex-col items-center justify-center my-16 px-2">
        <h2 class="text-2xl font-bold text-neutral-600 font-secondary">
          {title}
        </h2>
        <div class="grid grid-cols-[1fr_auto_1fr] [grid-template-areas:'current-item_plus_slider''result_result_result'] md:flex md:flex-row md:px-4 mt-12 md:justify-between max-w-[988px] w-full items-center">
          <CurrentItem
            selectedSkuUrl={selectedMainSkuUrl}
            product={page.product}
            platform={platform}
            availableSkus={availableMainSkus}
            imageAspectRatio={productImageAspectRatio}
            imageFit={productImageFit}
            actualVariant={currentVariantMain.value}
            class="[grid-area:current-item] justify-self-center"
          />
          <Icon
            id="Plus"
            size={37}
            class="[grid-area:plus] justify-self-center"
          />
          <div class="relative [grid-area:slider] justify-self-center self-start">
            <div id={rootId} class="w-full lg:max-w-[200px] max-w-[160px]">
              <div class="h-[50px] w-full">
                {extraProducts.value.length > 1 && (
                  <>
                    <Slider.NextButton class="w-full p-3 px-0 md:px-3 flex items-center justify-center gap-2.5 text-neutral-400 xl:hover:bg-primary xl:hover:text-primary-content active:bg-primary active:text-primary-content text-sm font-medium border border-neutral-400 transition">
                      <Icon size={24} id="Reload" strokeWidth={3} />
                      <span class="font-bold">Ver outro produto</span>
                    </Slider.NextButton>
                  </>
                )}
              </div>
              <Slider
                class="w-full carousel pb-[300px] mb-[-300px]"
                onScroll={(e) =>
                  index.value = getElementsInsideContainer(
                    e.currentTarget,
                    e.currentTarget.children,
                    "x",
                  )[0] ?? 0}
              >
                {extraProducts?.value.map((extraProduct, i) => {
                  return (
                    <Slider.Item
                      index={i}
                      class="relative carousel-item flex w-full pointer-events-auto flex-col gap-2"
                    >
                      <ExtraProductItem
                        extraProduct={extraProduct}
                        platform={platform}
                        selectedSkuUrl={skuSecondarySelected}
                        availableSkus={availableSecondarySkus}
                        actualVariant={index.value === i
                          ? actualSecondaryVariant.value
                          : extraProduct.product}
                        imageAspectRatio={productImageAspectRatio}
                        imageFit={productImageFit}
                      />
                    </Slider.Item>
                  );
                })}
              </Slider>

              <SliderJS rootId={rootId} infinite />
            </div>
          </div>
          <div class="hidden md:block">
            <Icon id="Equals" size={38} />
          </div>

          <div class="relative flex flex-col mt-2 md:mt-0 [grid-area:result] justify-center gap-6 bg-neutral-200 w-full md:max-w-[246px] py-8 md:py-14 md:px-6">
            <div class="flex flex-col items-center justify-center gap-1.5">
              <p class="text-neutral-500">
                Leve os <strong>2 itens</strong> por apenas
              </p>
              <p class="text-neutral-500 text-2xl font-black">
                {formatPrice(
                  mainPrice + secondaryPrice,
                  page.product.offers?.priceCurrency,
                )}
              </p>
            </div>
            <>
              <div>
                <div
                  onClick={() => {
                    if (allSelected && !hasTriedToBuy.value) return;

                    hasTriedToBuy.value = true;
                  }}
                >
                  {addToCartButtonModifiers[platform] &&
                    addToCartButtonModifiers[platform](
                      { data: buyTogetherData, allSelected },
                    )}
                </div>
                {(!allSelected && hasTriedToBuy.value) && (
                  <p class="text-center text-danger-500 text-xs mt-4">
                    Selecione uma variação
                  </p>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductBuyTogether;
