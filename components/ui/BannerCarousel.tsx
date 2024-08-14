import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { AppContext } from "$store/apps/site.ts";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { SelectPromotionParams } from "apps/commerce/types.ts";
import {
  SendEventOnClick,
  SendEventOnView,
} from "$store/components/Analytics.tsx";
import { toAnalytics } from "$store/sdk/ga4/transform/toAnalytics.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: ImageWidget;
  /** @description mobile otimized image */
  mobile: ImageWidget;
  /** @description tablet otimized imag, se não preenchido a imagem mobile será mostrada */
  tablet?: ImageWidget;
  /** @description Image's alt text */
  alt: string;
  /** @description when user clicks on the image, go to this link */
  href: string;
  /**
   * @title Google Analytics 4
   * @description Parâmetros para o Google Analytics 4
   */
  ga4?: SelectPromotionParams;
}

export interface Props {
  images?: Banner[];
  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;
  /**
   * @title Show arrows
   * @description show arrows to navigate through the images
   */
  arrows?: boolean;
  /**
   * @title Show dots
   * @description show dots to navigate through the images
   */
  dots?: boolean;
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

const DEFAULT_PROPS = {
  images: [
    {
      alt: "/feminino",
      href: "/",
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/c007e481-b1c6-4122-9761-5c3e554512c1",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/d057fc10-5616-4f12-8d4c-201bb47a81f5",
    },
    {
      alt: "/feminino",
      href: "/",
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/c007e481-b1c6-4122-9761-5c3e554512c1",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/d057fc10-5616-4f12-8d4c-201bb47a81f5",
    },
    {
      alt: "/feminino",
      href: "/",
      mobile:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/c007e481-b1c6-4122-9761-5c3e554512c1",
      desktop:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/d057fc10-5616-4f12-8d4c-201bb47a81f5",
    },
  ],
  preload: true,
};

interface BannerItemProps {
  banner: Banner;
  lcp?: boolean;
  id: string;
}

function BannerItem({
  banner,
  lcp,
  id,
}: BannerItemProps) {
  const { alt, mobile, desktop, href, tablet, ga4 } = banner;

  const analyticsParams = {
    promotion_id: ga4?.promotion_id ?? "banner_carousel",
    promotion_name: ga4?.promotion_name ?? alt ??
      "Carrousel de banners da página inicial",
    creative_name: ga4?.creative_name,
    creative_slot: ga4?.creative_slot,
    view: {
      id: ga4?.promotion_id ?? "banner_carousel",
      name: ga4?.promotion_name ?? alt ??
        "Carrousel de banners da página inicial",
    },
  };

  const viewPromotionEvent = toAnalytics({
    type: "view_promotion",
    data: analyticsParams,
  });

  const selectPromotionEvent = toAnalytics({
    type: "select_promotion",
    data: analyticsParams,
  });

  const renderAnalyticsEvents = (id: string) => (
    <>
      <SendEventOnView id={id} event={viewPromotionEvent} />
      <SendEventOnClick id={id} event={selectPromotionEvent} />
    </>
  );

  return (
    <a
      id={id}
      href={href ?? "#"}
      aria-label={alt}
      class="relative overflow-y-hidden w-full"
    >
      <Picture preload={lcp}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={414}
          height={460}
        />
        {tablet && (
          <Source
            media="(max-width: 1024px) and (min-width: 768px)"
            fetchPriority={lcp ? "high" : "auto"}
            src={tablet}
            width={1024}
            height={460}
          />
        )}
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1920}
          height={470}
        />
        <img
          class="object-cover w-full"
          loading={lcp ? "eager" : "lazy"}
          width={1920}
          height={470}
          src={desktop}
          alt={alt}
        />
      </Picture>
      {renderAnalyticsEvents(id)}
    </a>
  );
}

function Dots({ images }: Props) {
  return (
    <>
      <ul class="carousel justify-center col-span-full z-10 row-start-3 h-min self-end mb-3 md:mb-6">
        {images?.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="size-2 m-1 bg bg-neutral-400 rounded-full group-disabled:bg-primary" />
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}

function Buttons() {
  return (
    <>
      <div class="flex items-center justify-center z-10 col-start-1 row-start-2">
        <Slider.PrevButton class="btn btn-square bg-base-100 hover:bg-base-100 border-none bg-opacity-50">
          <Icon
            class="text-neutral"
            size={48}
            id="ChevronLeft"
            strokeWidth={3}
          />
        </Slider.PrevButton>
      </div>
      <div class="flex items-center justify-center z-10 col-start-3 row-start-2">
        <Slider.NextButton class="btn btn-square bg-base-100 hover:bg-base-100 border-none bg-opacity-50">
          <Icon
            class="text-neutral"
            size={48}
            id="ChevronRight"
            strokeWidth={3}
          />
        </Slider.NextButton>
      </div>
    </>
  );
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop", device: ctx.device };
}

function BannerCarousel(props: ReturnType<typeof loader>) {
  const id = useId();
  const { images, preload, interval, sectionProps, isMobile } = {
    ...DEFAULT_PROPS,
    ...props,
  };

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div
        id={id}
        class="grid grid-cols-[80px_1fr_80px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr] sm:min-h-min"
      >
        <Slider class="carousel carousel-center w-full col-span-full row-span-full gap-6">
          {images?.map((banner, index) => {
            return (
              <Slider.Item index={index} class="carousel-item w-full">
                <BannerItem
                  banner={banner}
                  lcp={index === 0 && preload}
                  id={`${id}::${index}`}
                />
              </Slider.Item>
            );
          })}
        </Slider>

        {props.arrows && <Buttons />}

        {props.dots && <Dots images={images} interval={interval} />}

        <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
      </div>
    </Section>
  );
}

export default BannerCarousel;
