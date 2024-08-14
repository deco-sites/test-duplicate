import type { Platform } from "$store/apps/site.ts";
import AddToCartButton from "$store/components/product/AddToCartButton/AddToCartButton.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { relative } from "$store/sdk/url.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossibilities.ts";

import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import SealsList from "$store/components/product/SealsList.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import {
  default as WishlistButtonVtex,
} from "$store/islands/WishlistButton/vtex.tsx";
import {
  default as WishlistButtonWake,
} from "$store/islands/WishlistButton/wake.tsx";
import Rating from "$store/components/product/Rating.tsx";
import type {
  ProductImageAspectRatio,
  ProductImageFit,
} from "$store/sections/Theme/Theme.tsx";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import { toProductItem } from "deco-sites/fast-fashion/sdk/ga4/transform/toProductItem.ts";
import { SendEventOnClick } from "deco-sites/fast-fashion/components/Analytics.tsx";

export type ProductNameRender = "concat" | "productGroup" | "product";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /**
   * @title Nome do produto
   * @description Como o título do produto será exibido. Concat para concatenar o nome do produto e do sku.
   * @default concat
   */
  nameRender?: ProductNameRender;

  /** @description index of the product card in the list */
  index?: number;
  sealsConfig?: SealConfig[];
  platform: Platform;
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
  itemListId?: string;
  itemListName?: string;
  isMobile?: boolean;
}

const WIDTH = 200;
// const HEIGHT = 200;

function ProductCard({
  product,
  preload,
  itemListId,
  itemListName,
  platform,
  nameRender = "productGroup",
  index = 1,
  sealsConfig,
  imageAspectRatio,
  imageFit,
  isMobile = true,
}: Props) {
  const {
    productID,
    name,
    image,
    offers,
    isVariantOf,
    additionalProperty = [],
  } = product;
  const id = `product-card-${productID}`;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const productGroupID = isVariantOf?.productGroupID;
  const possibilities = useVariantPossibilities(hasVariant, product);
  const variants = Object.entries(Object.values(possibilities)[0] ?? {});

  const productOffers = useOffer(offers);

  const firstAvailableVariantIndex = product.isVariantOf?.hasVariant?.findIndex(
    (
      variant,
    ) =>
      variant?.offers?.offers?.[0]?.availability ===
        "https://schema.org/InStock",
  );

  const firstAvailableVariant = firstAvailableVariantIndex
    ? product.isVariantOf?.hasVariant?.[firstAvailableVariantIndex]
    : undefined;

  const isAvailable =
    productOffers.availability === "https://schema.org/InStock" ||
    !!firstAvailableVariant;

  const {
    listPrice,
    price,
    installments,
    seller = "1",
  } = firstAvailableVariant
    ? useOffer(firstAvailableVariant?.offers)
    : productOffers;

  const [front, back] = firstAvailableVariant?.image ?? image ?? [];

  const url = firstAvailableVariant?.url ?? product.url;
  const relativeUrl = url ? relative(url) : "";

  const discountPercentage = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const aspectRatio = Number(imageAspectRatio.split("/")[0]) /
    Number(imageAspectRatio.split("/")[1]);

  const analytics = {
    items: [toProductItem(product, { index, quantity: 1 })],
    view: { id: itemListId ?? "product_card", name: itemListName ?? "Produto" },
  };

  const selectItemEvent = toAnalytics({
    type: "select_item",
    data: analytics,
  });

  return (
    <div
      id={id}
      class="group/product-cart flex flex-col gap-2 w-full group-has-[#layout-type-list:checked]:flex-row group-has-[#layout-type-list:checked]:justify-between group-has-[#layout-type-list:checked]:gap-6 md:group-has-[#layout-type-list:checked]:gap-10"
      data-deco="view-product"
    >
      {/* Top/Left */}
      <div class="flex flex-col justify-between relative w-full group-has-[#layout-type-list:checked]:w-[160px] group-has-[#layout-type-list:checked]:shrink-0 lg:group-has-[#layout-type-list:checked]:w-[200px]">
        {/* Floating */}
        <div>
          <div class="absolute top-2 left-2 gap-1.5 flex flex-col">
            {discountPercentage > 0 && (
              <div class="flex items-center justify-center text-[10px] size-9 bg-neutral-400 text-neutral-content rounded-full bold">
                {`-${discountPercentage}%`}
              </div>
            )}

            <SealsList
              sealsConfig={sealsConfig}
              product={product}
              limit={2}
              position="image"
            />
          </div>

          {/* Wishlist button */}
          <div class="absolute top-0 right-0 z-10 flex items-center">
            {platform === "vtex" && (
              <WishlistButtonVtex
                productGroupID={productGroupID}
                productID={productID}
              />
            )}
            {platform === "wake" && (
              <WishlistButtonWake
                productGroupID={productGroupID}
                productID={productID}
              />
            )}
          </div>
        </div>

        {/* Product Images */}
        <figure class="product-aspect overflow-hidden">
          <a
            href={relativeUrl}
            aria-label="Ver produto"
            class="grid grid-cols-1 grid-rows-1 w-full h-full border-solid border border-neutral-300"
          >
            <Image
              src={front.url!}
              alt={front.alternateName}
              width={WIDTH}
              height={WIDTH / aspectRatio}
              class="bg-base-100 col-span-full row-span-full product-fit h-full w-full "
              sizes="(max-width: 640px) 50vw, 20vw"
              preload={preload}
              loading={preload ? "eager" : "lazy"}
              decoding="async"
              fit={imageFit}
            />
            <Image
              src={back?.url ?? front.url!}
              alt={back?.alternateName ?? front.alternateName}
              width={WIDTH}
              height={WIDTH / aspectRatio}
              class="bg-base-100 col-span-full row-span-full h-full w-full opacity-0 lg:group-hover/product-cart:opacity-100 product-fit"
              sizes="(max-width: 640px) 50vw, 20vw"
              loading="lazy"
              decoding="async"
            />
          </a>
        </figure>

        {/* Text seals */}
        {/* TODO Remover bordar e after */}
        <div class="">
          <div class="-translate-y-px flex justify-center items-center h-5 [&>div]:min-w-0 group-has-[#layout-type-list:checked]:h-auto">
            <SealsList
              sealsConfig={sealsConfig}
              product={product}
              limit={2}
              position="info"
            />
          </div>
        </div>
      </div>

      {/* Bottom/Right */}
      <div class="flex flex-col md:group-has-[#layout-type-list:checked]:flex-row md:group-has-[#layout-type-list:checked]:justify-between group-has-[#layout-type-list:checked]:flex-1 sm:group-has-[#layout-type-list:checked]:gap-5">
        {/* Left (desktop list mode) */}
        <div>
          {/* Name */}
          <h2 class="h-10 font-bold text-sm text-neutral-500 line-clamp-2">
            {nameRender === "concat"
              ? `${isVariantOf?.name} ${name}`
              : nameRender === "productGroup"
              ? isVariantOf?.name
              : name}
          </h2>
          {/* Reviews */}
          <div class="mt-5 h-3 group-has-[#layout-type-list:checked]:mt-3">
            {product.aggregateRating && (
              <Rating
                size={12}
                rating={product.aggregateRating?.ratingValue ?? 0}
              />
            )}
          </div>
        </div>

        {/* Right (desktop list mode) */}
        <div class="flex flex-col max-lg:group-has-[#layout-type-list:checked]:h-full max-lg:group-has-[#layout-type-list:checked]:mt-2">
          {/* Pricing */}
          {isAvailable
            ? (
              <div class="flex flex-col h-[58px] lg:h-[38px] mt-2 group-has-[#layout-type-list:checked]:mt-0 w-full sm:group-has-[#layout-type-list:checked]:min-w-52">
                {/* Price */}
                <div class="flex flex-col lg:flex-row lg:items-end gap-y-1 gap-x-2">
                  <div class="text-neutral-400 text-xs leading-[14px] line-through font-bold">
                    {discountPercentage > 0 && (
                      <>De {formatPrice(listPrice, offers?.priceCurrency)}</>
                    )}
                  </div>

                  <div class="text-primary-500 text-sm font-bold leading-4">
                    {listPrice ? "Por " : "A partir de "}
                    {formatPrice(price, offers?.priceCurrency)}
                  </div>
                </div>

                {/* Installments */}
                {installments && installments.billingDuration > 1 && (
                  <span class="text-xs text-neutral-500 leading-[20px]">
                    {isMobile ? "" : "ou "}
                    <strong class="font-bold">
                      {installments.billingDuration}x
                    </strong>{" "}
                    de{" "}
                    <strong class="font-bold">
                      {formatPrice(
                        installments.billingIncrement,
                        offers?.priceCurrency,
                      )}
                    </strong>
                    {isMobile
                      ? installments.withTaxes ? " c/ juros" : " s/ juros"
                      : installments.withTaxes
                      ? " com juros"
                      : " sem juros"}
                  </span>
                )}
              </div>
            )
            : (
              <div class="text-sm leading-4 mt-2 group-has-[#layout-type-list:checked]:mt-0 group-has-[#layout-type-list:checked]:h-auto h-[58px] lg:h-[38px] w-full sm:group-has-[#layout-type-list:checked]:min-w-52 text-neutral-400 font-bold">
                Produto indisponível
              </div>
            )}

          {/* Add to cart */}
          <div class="invisible opacity-0 group-hover/product-cart:opacity-100 group-hover/product-cart:visible max-xl:opacity-100 max-xl:visible mt-4 w-full group-has-[#layout-type-list:checked]:mt-6 max-lg:group-has-[#layout-type-list:checked]:mt-auto group-has-[#layout-type-list:checked]:opacity-100 group-has-[#layout-type-list:checked]:visible">
            {isAvailable
              ? (
                variants.length === 0
                  ? (
                    <AddToCartButton
                      productGroupID={productGroupID ?? ""}
                      additionalProperty={additionalProperty}
                      items={[{ id: productID, quantity: 1, seller }]}
                      platform={platform}
                      analytics={analytics}
                    />
                  )
                  : (
                    <a
                      href={relativeUrl}
                      class="btn btn-outline w-full"
                      aria-label="Ver produto"
                    >
                      Ver mais detalhes
                    </a>
                  )
              )
              : (
                <a
                  href={relativeUrl}
                  class="btn btn-outline w-full"
                  aria-label="Ver produto"
                >
                  Avise-me quando chegar
                </a>
              )}
          </div>
        </div>
      </div>

      <SendEventOnClick id={id} event={selectItemEvent} />
    </div>
  );
}

export default ProductCard;
