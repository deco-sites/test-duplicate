import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { AppContext } from "$store/apps/site.ts";
import { SelectPromotionParams } from "apps/commerce/types.ts";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import {
  SendEventOnClick,
  SendEventOnView,
} from "deco-sites/fast-fashion/components/Analytics.tsx";

export interface CTA {
  href: string;
  text: string;
  invertTextColor?: boolean;
}

export interface Props {
  /**
   * @format html
   */
  title: string;
  description: HTMLWidget;
  image?: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt: string;
    /**
     * @title Google Analytics 4
     * @description Parâmetros para o Google Analytics 4
     */
    ga4?: SelectPromotionParams;
  };
  placement: "left" | "right";
  cta: CTA;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

const PLACEMENT = {
  left: "flex-col text-left lg:flex-row-reverse",
  right: "flex-col text-left lg:flex-row",
};

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

/**
 * @title Hero
 */
export default function HeroFlats({
  title = "Hero",
  description = "Your description here",
  image,
  placement,
  cta,
  sectionProps,
  isMobile,
}: ReturnType<typeof loader>) {
  const analyticsParams = {
    promotion_id: image?.ga4?.promotion_id ?? "banner_hero_section",
    promotion_name: image?.ga4?.promotion_name ?? image?.alt ??
      "Carrousel de banners da página inicial",
    creative_name: image?.ga4?.creative_name,
    creative_slot: image?.ga4?.creative_slot,
    view: {
      id: image?.ga4?.promotion_id ?? "banner_hero_section",
      name: image?.ga4?.promotion_name ?? image?.alt ??
        "Seção Hero",
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

  const renderEvents = (id: string) => (
    <>
      <SendEventOnView id={id} event={viewPromotionEvent} />
      <SendEventOnClick id={id} event={selectPromotionEvent} />
    </>
  );

  return (
    <Section id="hero_section" isMobile={isMobile} {...sectionProps}>
      <div class="">
        <div
          class={`flex w-full xl:container mx-auto z-10 ${
            PLACEMENT[placement]
          } flex-col-reverse justify-center text-center`}
        >
          {image && (
            <div class="flex-1">
              <Picture preload={false}>
                <Source
                  media="(max-width: 767px)"
                  src={image.mobile}
                  width={414}
                  height={230}
                  fetchPriority="auto"
                />

                <Source
                  media="(min-width: 768px)"
                  src={image.desktop}
                  width={733}
                  height={472}
                  fetchPriority="auto"
                />

                <img
                  class="object-cover w-full flex-1 h-full"
                  width={733}
                  height={472}
                  src={image.desktop}
                  alt={image.alt}
                  loading="lazy"
                />
              </Picture>
            </div>
          )}
          <div class="bg-neutral-200 px-4 py-12  max-lg:sm:gap-4 flex flex-col gap-10 w-full lg:w-full lg:max-w-[490px] md:justify-center md:px-16">
            <div
              class="font-secondary inline-block text-2xl"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            >
            </div>
            <div
              class="text-sm text-justify md:text-center"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
            <div class="flex flex-col items-center lg:items-start lg:flex-row gap-4 max-md:mt-auto">
              {cta && (
                <a
                  href={cta?.href}
                  target={cta?.href.includes("http") ? "_blank" : "_self"}
                  class="btn btn-secondary gap-2.5 h-12 max-w-56 w-full mx-auto"
                >
                  <span class="ml-4">{cta?.text}</span>
                  <Icon id="ChevronRight" size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {renderEvents("hero_section")}
    </Section>
  );
}
