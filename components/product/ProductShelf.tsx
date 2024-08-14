import Icon from "$store/components/ui/Icon.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import type { Product, ViewItemListParams } from "apps/commerce/types.ts";
import { AppContext } from "$store/apps/site.ts";
import ProductCard, {
  ProductNameRender,
} from "$store/components/product/ProductCard.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import { clx } from "$store/sdk/clx.ts";
import { toProductItem } from "$store/sdk/ga4/transform/toProductItem.ts";
import { SendEventOnView } from "$store/components/Analytics.tsx";
import { toAnalytics } from "$store/sdk/ga4/transform/toAnalytics.ts";
import { useScriptAsDataURI } from "deco/hooks/useScript.ts";
import { usePartialSection } from "deco/hooks/usePartialSection.ts";

export interface Props {
  /** @title Titulo */
  title?: string;
  /** @title Produtos */
  products: Product[] | null;
  /**
   * @title Nome do produto
   * @description Como o título do produto será exibido. Concat para concatenar o nome do produto e do sku.
   * @default concat
   */
  name?: ProductNameRender;
  /** @title Selos  */
  sealsConfig?: SealConfig[];
  /**
   *  @title Defer Mode
   *  @description Defer atrasa o carregamento da seção até que o usuário role a página ou a seção entre na tela.
   *  @default none
   */
  defer?: "scroll" | "intersection" | "none";
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
  /**
   * @title Google Analytics 4
   * @description Parâmetros para o Google Analytics 4
   */
  ga4?: Omit<ViewItemListParams, "items">;
  /**
   * @title Configurações da prateleira
   */
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      tablet?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    /**
     * @title Mostrar setas
     * @default true
     */
    showArrows?: boolean;
    /**
     * @title Mostrar dots
     * @default true
     */
    showDots?: boolean;
  };
}

const script = (id: string, type: "scroll" | "intersection") => {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  if (type === "scroll") {
    addEventListener("scroll", () => setTimeout(() => element.click(), 200), {
      once: true,
    });
  }

  if (type === "intersection") {
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (document.readyState !== "complete") {
              document.addEventListener("DOMContentLoaded", () => {
                // @ts-expect-error trustme, I'm an engineer
                entry.target.click();
              });

              return;
            }

            // @ts-expect-error trustme, I'm an engineer
            entry.target.click();
          }
        }
      },
      { rootMargin: "200px" },
    ).observe(element);
  }
};

export const onBeforeResolveProps = (props: Props) => {
  if (props.defer !== "none" && props.defer) {
    return {
      ...props,
      products: null,
    };
  }

  return props;
};

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return {
    ...props,
    isMobile: ctx.device !== "desktop",
    productImageAspectRatio: ctx.theme?.props.productImages?.aspectRatio,
    productImageFit: ctx.theme?.props.productImages?.fit,
  };
}

function ProductShelf({
  products,
  title,
  sectionProps,
  isMobile,
  name,
  sealsConfig,
  layout,
  ga4,
  defer,
  productImageAspectRatio = "1/1",
  productImageFit = "cover",
}: ReturnType<typeof loader>) {
  const id = useId();
  const buttonId = `deffered-${id}`;

  const platform = usePlatform();
  const partial = usePartialSection<typeof ProductShelf>({
    props: { defer: "none" },
  });

  if (defer !== "none" && defer) {
    return (
      <div class="relative">
        <Section isMobile={isMobile} {...sectionProps}>
          <Header title={title || ""} />
          <div
            style={{ height: "716px" }}
            class="flex justify-center items-center"
          >
            <span class="loading loading-spinner" />
          </div>
          <script defer src={useScriptAsDataURI(script, buttonId, defer)} />
          <button
            {...partial}
            id={buttonId}
            class="absolute inset-0"
            data-deferred
            aria-label={`Deferred Section - ${id}`}
          />
        </Section>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const { showArrows = true, showDots = true } = layout ?? {};

  const listId = ga4?.item_list_id ?? "product_shelf";
  const listName = ga4?.item_list_name ?? title ?? "Product Shelf";

  const VTEX_VIEW_ITEM_LIST = toAnalytics({
    type: "view_item_list",
    data: {
      items: products.map((product, index) =>
        toProductItem(product, { quantity: 1, index })
      ),
      view: { id: listId, name: listName },
    },
  });

  const slideDesktop = {
    1: "xl:w-full",
    2: "xl:w-[calc((100%-(16px))/2)]",
    3: "xl:w-[calc((100%-(16px*2))/3)]",
    4: "xl:w-[calc((100%-(16px*3))/4)]",
    5: "xl:w-[calc((100%-(16px*4))/5)]",
  };

  const slideMobile = {
    1: "w-full",
    2: "w-[calc((100%-(16px))/2)]",
    3: "w-[calc((100%-(16px*2))/3)]",
    4: "w-[calc((100%-(16px*3))/4)]",
    5: "w-[calc((100%-(16px*4))/5)]",
  };

  const slideTablet = {
    1: "sm:w-full",
    2: "sm:w-[calc((100%-(16px))/2)]",
    3: "sm:w-[calc((100%-(16px*2))/3)]",
    4: "sm:w-[calc((100%-(16px*3))/4)]",
    5: "sm:w-[calc((100%-(16px*4))/5)]",
  };

  const dotDesktop = {
    1: "lg:[&_li:nth-child(1n-1)]:flex",
    2: "lg:[&_li:nth-child(2n-1)]:flex",
    3: "lg:[&_li:nth-child(3n-2)]:flex",
    4: "lg:[&_li:nth-child(4n-3)]:flex",
    5: "lg:[&_li:nth-child(5n-4)]:flex",
  };

  const dotMobile = {
    1: "max-sm:[&_li:nth-child(1n-1)]:flex",
    2: "max-sm:[&_li:nth-child(2n-1)]:flex",
    3: "max-sm:[&_li:nth-child(3n-2)]:flex",
    4: "max-sm:[&_li:nth-child(4n-3)]:flex",
    5: "max-sm:[&_li:nth-child(5n-4)]:flex",
  };

  const dotTablet = {
    1: "sm:max-lg:[&_li:nth-child(1n-1)]:flex",
    2: "sm:max-lg:[&_li:nth-child(2n-1)]:flex",
    3: "sm:max-lg:[&_li:nth-child(3n-2)]:flex",
    4: "sm:max-lg:[&_li:nth-child(4n-3)]:flex",
    5: "sm:max-lg:[&_li:nth-child(5n-4)]:flex",
  };

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div id={id} class="w-full container flex flex-col gap-4">
        <Header title={title || ""} />

        <div class="flex flex-row items-center md:gap-2.5 relative">
          {showArrows && (
            <Slider.PrevButton class="absolute left-0 max-md:top-1/2 max-md:-translate-y-full max-md:bg-base-100 !bg-opacity-50 md:static flex justify-center items-center btn-square size-12 flex-shrink-0 hover:text-neutral-400 transition z-10 ">
              <Icon size={48} id="ChevronLeft" />
            </Slider.PrevButton>
          )}

          <Slider class="carousel py-0.5 sm:carousel-end flex-1 gap-4">
            {products?.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                  slideDesktop[layout?.numberOfSliders?.desktop ?? 5],
                  slideTablet[layout?.numberOfSliders?.tablet ?? 3],
                  slideMobile[layout?.numberOfSliders?.mobile ?? 2],
                )}
              >
                <ProductCard
                  itemListId={listId}
                  itemListName={listName}
                  product={product}
                  sealsConfig={sealsConfig}
                  platform={platform}
                  nameRender={name}
                  index={index}
                  imageAspectRatio={productImageAspectRatio}
                  imageFit={productImageFit}
                  isMobile={isMobile}
                />
              </Slider.Item>
            ))}
          </Slider>

          {showArrows && (
            <Slider.NextButton class="absolute right-0 md:static max-md:top-1/2 max-md:-translate-y-full max-md:bg-base-100 !bg-opacity-50 flex justify-center items-center btn-square size-12 flex-shrink-0 hover:text-neutral-400 transition z-10">
              <Icon size={48} id="ChevronRight" />
            </Slider.NextButton>
          )}
        </div>
        <SliderJS rootId={id} infinite />

        {products.length > 1 && showDots && (
          <ul
            class={clx(
              "carousel justify-center mx-auto row-start-5 col-span-full [&_li]:hidden",
              dotDesktop[layout?.numberOfSliders?.desktop ?? 5],
              dotTablet[layout?.numberOfSliders?.tablet ?? 3],
              dotMobile[layout?.numberOfSliders?.mobile ?? 2],
            )}
          >
            {products?.map((_, index) => (
              <li class="">
                <Slider.Dot index={index}>
                  <div class="size-2 m-1 bg bg-neutral-400 rounded-full group-disabled:bg-primary" />
                </Slider.Dot>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SendEventOnView id={id} event={VTEX_VIEW_ITEM_LIST} />
    </Section>
  );
}

export default ProductShelf;
