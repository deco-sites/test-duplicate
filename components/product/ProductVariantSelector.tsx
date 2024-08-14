import { useProductVariants } from "../../sdk/useProductVariants.ts";
import type { Product } from "apps/commerce/types.ts";
import { relative } from "$store/sdk/url.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "$store/sdk/clx.ts";
import SizeTables from "$store/components/product/SizeTables.tsx";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";

interface Props {
  product: Product;
  aspectRatio: number;
  imageFit: ProductImageFit;
  variantsToRenderAsImage?: string[];
  sizePropertyName?: string;
  class?: string;
}

function VariantSelector(
  {
    product,
    sizePropertyName,
    variantsToRenderAsImage,
    imageFit,
    aspectRatio,
    class: _class,
  }: Props,
) {
  const possibilities = useProductVariants({
    product,
  });

  return (
    <ul class={clx("flex flex-col gap-6", _class)}>
      {possibilities.map(({ name, label, values }) => (
        <li class="flex flex-col gap-4">
          <span class="text-sm font-bold flex items-enter justify-between">
            <span class="capitalize">{label}:</span>
            {sizePropertyName === name && <SizeTables.Trigger />}
          </span>
          <ul class="flex flex-wrap gap-2">
            {values.map(({ inStock, selected, value, url }) => {
              const link = new URL(
                relative(url) ?? "",
                "https://www.example.com",
              );
              link.searchParams.append("__decoFBT", "0");
              const renderAsImage = variantsToRenderAsImage?.includes(name);

              const relativeLink = link.pathname + link.search;

              return (
                <li>
                  <button
                    data-variant-selector
                    f-partial={relativeLink}
                    f-client-nav
                  >
                    {renderAsImage
                      ? (
                        <>
                          <div class="flex flex-col items-center px-1.5">
                            <Image
                              src={relativeLink ?? ""}
                              width={42}
                              height={42 / aspectRatio}
                              fit={imageFit}
                              class={clx(
                                "mb-3 border-2 border-transparent product-aspect product-fit",
                                selected && "!border-primary",
                              )}
                            />
                            <span class="text-neutral-600 text-xs leading-normal h-[18px]">
                              {value}
                            </span>
                          </div>
                        </>
                      )
                      : (
                        <div
                          class={clx(
                            "btn relative btn-primary min-w-12 px-3.5 ",
                            !selected && "btn-outline text-neutral ",
                            !inStock &&
                              "diagonal-cross hover:diagonal-cross-inverted opacity-70",
                            selected && !inStock &&
                              "diagonal-cross-inverted opacity-100",
                          )}
                        >
                          <span>{value}</span>
                        </div>
                      )}
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
