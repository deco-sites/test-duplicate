import Image from "apps/website/components/Image.tsx";
import { relative } from "$store/sdk/url.ts";

import { Product } from "apps/commerce/types.ts";
import { clx } from "$store/sdk/clx.ts";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";

interface Props {
  currentProduct: Product;
  products: Product[];
  aspectRatio: number;
  imageFit: ProductImageFit;
  title: string;
  titleProperty?: string;
}

function CrossSellingProduct(
  { product, imageFit, aspectRatio, current, titleProperty }: {
    product: Product;
    aspectRatio: number;
    imageFit: ProductImageFit;
    current?: boolean;
    titleProperty?: string;
  },
) {
  const imageUrl = product.image?.[0].url;
  const value = product.additionalProperty?.find(
    (p) => {
      return p.name === titleProperty;
    },
  )?.value;

  const link = new URL(relative(product.url) ?? "", "https://www.example.com");
  link.searchParams.append("__decoFBT", "0");
  const relativeLink = link.pathname + link.search;

  return (
    <button f-partial={relativeLink} f-client-nav>
      <div class="h-full flex flex-col items-center gap-3">
        <Image
          src={imageUrl ?? ""}
          width={42}
          height={42 / aspectRatio}
          fit={imageFit}
          class={clx(
            "border border-transparent product-aspect product-fit hover:border-primary transition",
            current && "!border-primary border-2",
          )}
        />

        {!!value && (
          <span class="text-xs leading-normal h-[18px]">
            {value}
          </span>
        )}
      </div>
    </button>
  );
}

function CrossSelling(
  { products, title, titleProperty, aspectRatio, imageFit, currentProduct }:
    Props,
) {
  return (
    <div class="flex flex-col items-start gap-4">
      <span class="text-sm font-bold">{title}</span>
      <div class="flex gap-4 flex-wrap">
        <CrossSellingProduct
          key={currentProduct.productID}
          current
          product={currentProduct}
          aspectRatio={aspectRatio}
          imageFit={imageFit}
          titleProperty={titleProperty}
        />
        {products.map((product) => (
          <CrossSellingProduct
            key={product.productID}
            product={product}
            aspectRatio={aspectRatio}
            imageFit={imageFit}
            titleProperty={titleProperty}
          />
        ))}
      </div>
    </div>
  );
}

export default CrossSelling;
