import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { filterByMatcher } from "$store/sdk/matcher.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { Matcher } from "deco/blocks/matcher.ts";

import { LoaderContext } from "deco/types.ts";
import { SelectPromotionParams } from "apps/commerce/types.ts";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import {
  SendEventOnClick,
  SendEventOnView,
} from "deco-sites/fast-fashion/components/Analytics.tsx";
import { useId } from "deco-sites/fast-fashion/sdk/useId.ts";

export interface Banner {
  /** @title Imagem */
  src: ImageWidget;
  /** @title Altura */
  height?: number;
}

export interface BannerProps {
  /** @title Identificador do conteúdo */
  label?: string;

  /** @title Regra de aplicação do conteúdo */
  rule?: Matcher;

  /** @description Imagem de Desktop */
  desktop: Banner;

  /** @description Imagem Mobile */
  mobile: Banner;

  /** @description Imagem Tablet, se não preenchido a imagem mobile será mostrada */
  tablet?: Banner;

  /** @description Texto alternativo */
  alt: string;

  /** @description Link */
  href: string;

  /** @title Abrir em nova aba? */
  newTab?: boolean;

  /** @title É o primeiro elemento da pagina? */
  lcp?: boolean;

  /**
   * @title Google Analytics 4
   * @description Parâmetros para o Google Analytics 4
   */
  ga4?: SelectPromotionParams;
}

export interface Props {
  /** @title Lista de conteúdos */
  contents?: BannerProps[];

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export async function loader(
  { contents, sectionProps }: Props,
  request: Request,
  ctx: LoaderContext,
) {
  const filteredContents = await filterByMatcher({
    ctx,
    request,
    items: contents ?? [],
  });

  return {
    contents: filteredContents,
    sectionProps,
    isMobile: ctx.device !== "desktop",
    device: ctx.device,
  };
}
/**
 * @title Banner lado a lado
 */
function FullBanner(
  { contents: [content], sectionProps, isMobile }: Awaited<
    ReturnType<typeof loader>
  >,
) {
  if (!content) return null;
  const id = `full_banner_${useId()}`;
  const { alt, desktop, mobile, tablet, href, lcp, newTab, ga4 } = content;

  const analyticsParams = {
    promotion_id: ga4?.promotion_id ?? "full_banner",
    promotion_name: ga4?.promotion_name ?? alt ??
      "Banner de preenchimento completo da tela",
    creative_name: ga4?.creative_name,
    creative_slot: ga4?.creative_slot,
    view: {
      id: ga4?.promotion_id ?? "full_banner",
      name: ga4?.promotion_name ?? alt ??
        "Banner de preenchimento completo da tela",
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
    <Section id={id} isMobile={isMobile} {...sectionProps}>
      <div>
        <a
          href={href ?? "#"}
          target={newTab ? "_blank" : undefined}
          aria-label={alt}
          class="relative overflow-y-hidden w-full"
        >
          <Picture preload={lcp}>
            <Source
              media="(max-width: 767px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={mobile.src}
              width={414}
              height={mobile.height ?? 460}
            />
            {tablet && (
              <Source
                media="(max-width: 1024px)"
                fetchPriority={lcp ? "high" : "auto"}
                src={tablet.src}
                width={1024}
                height={tablet.height ?? 460}
              />
            )}
            <Source
              media="(min-width: 768px)"
              fetchPriority={lcp ? "high" : "auto"}
              src={desktop.src}
              width={1920}
              height={desktop.height ?? 470}
            />
            <img
              class="object-cover w-full"
              loading={lcp ? "eager" : "lazy"}
              width={1920}
              height={desktop.height}
              src={desktop.src}
              alt={alt}
            />
          </Picture>
        </a>
      </div>

      {renderEvents(id)}
    </Section>
  );
}

export default FullBanner;
