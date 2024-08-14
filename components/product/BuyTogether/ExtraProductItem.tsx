import { Signal } from "@preact/signals";
import type { ComponentProps } from "preact";
import { Platform } from "$store/apps/site.ts";
import { Product, ProductLeaf } from "apps/commerce/types.ts";
import { Possibility } from "$store/sdk/useVariantPossibilities.ts";
import WishlistButtonVtex from "$store/islands/WishlistButton/vtex.tsx";
import WishlistButtonWake from "$store/islands/WishlistButton/wake.tsx";
import Image from "apps/website/components/Image.tsx";
import { twMerge } from "$store/sdk/twMerge.ts";
import { Select } from "$store/components/ui/Select.tsx";
import {
  ProductImageAspectRatio,
  ProductImageFit,
} from "$store/sections/Theme/Theme.tsx";

type ExtraProduct = {
  product: Product;
  firstPossibility: {
    key: string;
    value: Record<string, Possibility>;
  };
  secondPossibility: {
    key: string;
    value: Record<string, Possibility>;
  };
};

type Props = {
  extraProduct: ExtraProduct;
  platform: Platform;
  selectedSkuUrl: Signal<string | undefined>;
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
  availableSkus: Signal<Set<string>>;
  actualVariant: ProductLeaf | undefined;
} & ComponentProps<"div">;

const WIDTH = 200;

export function ExtraProductItem(
  {
    extraProduct,
    platform,
    availableSkus,
    selectedSkuUrl,
    actualVariant,
    imageAspectRatio,
    imageFit,
    ...props
  }: Props,
) {
  const { firstPossibility, product, secondPossibility } = extraProduct;

  const firstPossibilityMap = firstPossibility.value
    ? Object.entries(firstPossibility.value)!
      .filter(([_, possibility]) =>
        possibility?.url &&
        availableSkus.value.has(possibility.url)
      )
      .map(([_, possibility]) => ({
        name: possibility?.value,
        value: possibility?.url,
      }))
    : [];

  const secondPossibilityMap = secondPossibility.value
    ? Object.entries(secondPossibility.value)!
      .filter(([_, possibility]) =>
        possibility?.url &&
        availableSkus.value.has(possibility.url)
      )
      .map(([_, possibility]) => ({
        name: possibility?.value,
        value: possibility?.url,
      }))
    : [];

  const { image } = actualVariant ||
    extraProduct.product;

  const selectedFirstPossibility = actualVariant?.additionalProperty?.find((
    i,
  ) => i.name === firstPossibility.key)
    ?.value;
  const selectedSecondPossibility = actualVariant?.additionalProperty?.find((
    i,
  ) => i.name === secondPossibility.key)?.value;

  const aspectRatio = Number(imageAspectRatio.split("/")[0]) /
    Number(imageAspectRatio.split("/")[1]);

  const nameToUse = product.isVariantOf?.name ?? product.name;

  return (
    <>
      <a
        href={extraProduct.product.url}
        class="flex w-full flex-col gap-2"
      >
        <div {...props} class="relative border border-neutral-300">
          <Image
            class="object-cover product-fit product-aspect"
            alt={nameToUse}
            src={image?.[0].url ?? ""}
            width={WIDTH}
            height={WIDTH / aspectRatio}
            fit={imageFit}
          />

          <div class="absolute top-0 right-0">
            {platform === "vtex" && (
              <WishlistButtonVtex
                productID={product.productID}
                productGroupID={product.isVariantOf?.productGroupID}
                class="min-h-0"
              />
            )}
            {platform === "wake" && (
              <WishlistButtonWake
                productID={product.productID}
                productGroupID={product.isVariantOf?.productGroupID}
                class="min-h-0"
              />
            )}
          </div>
        </div>

        <h3 class="text-sm font-bold text-neutral-500 line-clamp-2 text-ellipsis min-h-[40px]">
          {nameToUse}
        </h3>
      </a>

      <div class="flex flex-col md:flex-row items-center justify-between w-full gap-x-4 gap-y-3">
        {firstPossibilityMap.length >= 1
          ? (
            <>
              <label
                htmlFor={`select-colors-buytogether-${product.productID}`}
                class="sr-only"
              >
              </label>
              <Select
                id={`select-colors-buytogether-${product.productID}`}
                defaultValue={firstPossibility.key}
                value={selectedFirstPossibility}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  selectedSkuUrl.value = value;
                }}
                options={firstPossibilityMap}
                class={twMerge(
                  "w-full border border-neutral-600 bg-neutral-100",
                  firstPossibilityMap.length &&
                    secondPossibilityMap.length &&
                    "md:max-w-[calc(50%-0.5rem)]",
                )}
              />
            </>
          )
          : null}

        {secondPossibilityMap.length >= 1
          ? (
            <>
              <label
                htmlFor={`select-size-buytogether-${product.productID}`}
                class="sr-only"
              >
              </label>
              <Select
                id={`select-size-buytogether-${product.productID}`}
                defaultValue={secondPossibility.key}
                value={selectedSecondPossibility}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  selectedSkuUrl.value = value;
                }}
                options={secondPossibilityMap}
                class={twMerge(
                  "w-full border border-neutral-600 bg-neutral-100 flex-1 cursor-pointer",
                  firstPossibilityMap.length &&
                    secondPossibilityMap.length &&
                    "md:max-w-[calc(50%-0.5rem)]",
                )}
              />
            </>
          )
          : null}
      </div>
    </>
  );
}
