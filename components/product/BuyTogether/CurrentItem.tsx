import { Platform } from "$store/apps/site.ts";
import { Signal } from "@preact/signals";
import { Product, ProductLeaf } from "apps/commerce/types.ts";
import { ComponentProps } from "preact/compat";
import Image from "apps/website/components/Image.tsx";
import { Select } from "$store/components/ui/Select.tsx";
import { twMerge } from "npm:tailwind-merge@2.2.2";
import { useVariantPossibilities } from "../../../sdk/useVariantPossibilities.ts";
import {
  ProductImageAspectRatio,
  ProductImageFit,
} from "$store/sections/Theme/Theme.tsx";

type Props = {
  platform?: Platform;
  selectedSkuUrl: Signal<string | undefined>;
  product: Product;
  actualVariant: ProductLeaf | undefined;
  availableSkus: Signal<Set<string>>;
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
  class?: string;
} & ComponentProps<"div">;

const WIDTH = 200;

export function CurrentItem(
  {
    product,
    selectedSkuUrl,
    availableSkus,
    actualVariant,
    imageAspectRatio,
    imageFit,
    class: _class,
    ...props
  }: Props,
) {
  const hasVariant = product?.isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(
    hasVariant,
    actualVariant ?? product,
  );

  const firstNamePossibility = Object.keys(possibilities)[0] ?? "";
  const firstValuePossibility = Object.values(possibilities)[0];

  const secondNamePossibility = Object.keys(possibilities)[1] ?? "";
  const secondValuePossibility = Object.values(possibilities)[1];

  const firstPossibilites = {
    key: firstNamePossibility,
    value: firstValuePossibility,
  } || {};

  const secondPossibilities = {
    key: secondNamePossibility,
    value: secondValuePossibility,
  } || {};

  const firstPossibilitiesMap = Object.entries(firstPossibilites.value || [])!
    .filter(([_, possibility]) =>
      possibility?.url &&
      availableSkus.value.has(possibility.url)
    )
    .map(([_, possibility]) => ({
      name: possibility?.value,
      value: possibility?.url,
    }));

  const secondPossibilitiesMap = Object.entries(
    secondPossibilities.value || [],
  )!
    .filter(([_, possibility]) =>
      possibility?.url &&
      availableSkus.value.has(possibility.url)
    )
    .map(([_, possibility]) => ({
      name: possibility?.value,
      value: possibility?.url,
    }));

  const selectedFirstPossibility = actualVariant?.additionalProperty?.find((
    i,
  ) => i.name === firstPossibilites.key)
    ?.value;
  const selectedSecondPossibility = actualVariant?.additionalProperty?.find((
    i,
  ) => i.name === secondPossibilities.key)
    ?.value;

  const { image } = actualVariant || product;
  const nameToUse = product.isVariantOf?.name ?? product.name;

  const aspectRatio = Number(imageAspectRatio.split("/")[0]) /
    Number(imageAspectRatio.split("/")[1]);

  return (
    <div
      class={twMerge(
        "flex flex-col self-start h-full gap-2 w-full lg:max-w-[200px] max-w-[160px]",
        _class,
      )}
    >
      <div class="flex gap-2.5 items-center justify-center p-3 text-sm text-neutral-400 px-0 md:px-3">
        <span class="font-bold">Você está vendo</span>
      </div>
      <div {...props} class="relative border border-neutral-300">
        <Image
          class="object-cover product-fit product-aspect"
          alt={nameToUse}
          src={image?.[0]?.url ?? ""}
          width={WIDTH}
          height={WIDTH / aspectRatio}
          fit={imageFit}
        />
      </div>
      <h3 class="text-sm font-bold text-neutral-500 line-clamp-2 text-ellipsis min-h-[40px]">
        {nameToUse}
      </h3>
      <div class="flex md:flex-row flex-col items-center justify-between w-full gap-x-4 gap-y-3">
        {firstPossibilitiesMap.length
          ? (
            <>
              <label
                htmlFor={`select-1-buytogether-${product.productID}`}
                class="sr-only"
              >
              </label>
              <Select
                id={`select-1-buytogether-${product.productID}`}
                defaultValue={firstPossibilites.key}
                value={selectedFirstPossibility}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  selectedSkuUrl.value = value;
                }}
                options={firstPossibilitiesMap}
                class={twMerge(
                  "w-full border border-neutral-600 bg-neutral-100",
                  firstPossibilitiesMap.length &&
                    secondPossibilitiesMap.length &&
                    "md:w-1/2",
                )}
              />
            </>
          )
          : null}

        {secondPossibilitiesMap.length
          ? (
            <>
              <label
                htmlFor={`select-2-buytogether-${product.productID}`}
                class="sr-only"
              >
              </label>
              <Select
                id={`select-2-buytogether-${product.productID}`}
                defaultValue={secondPossibilities.key}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  selectedSkuUrl.value = value;
                }}
                options={secondPossibilitiesMap}
                value={selectedSecondPossibility}
                class={twMerge(
                  "w-full border border-neutral-600 bg-neutral-100",
                  firstPossibilitiesMap.length &&
                    secondPossibilitiesMap.length &&
                    "md:w-1/2",
                )}
              />
            </>
          )
          : null}
      </div>
    </div>
  );
}
