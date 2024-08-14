import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { AppContext } from "$store/apps/site.ts";
import { SelectPromotionParams } from "apps/commerce/types.ts";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import {
  SendEventOnClick,
  SendEventOnView,
} from "deco-sites/fast-fashion/components/Analytics.tsx";
import { useId } from "deco-sites/fast-fashion/sdk/useId.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description Imagem */
  src: ImageWidget;
  /** @description Texto alternativo */
  alt: string;
  /** @description Link de redirecionamento */
  href?: string;
  /**
   * @title Google Analytics 4
   * @description Parâmetros para o Google Analytics 4
   */
  ga4?: SelectPromotionParams;
}

export interface Props {
  banners: Banner[];

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

function BannerItem({ alt, src, ga4, href }: Banner) {
  const id = `banner_item_${useId()}`;

  const analyticsParams = {
    promotion_id: ga4?.promotion_id ?? "banner",
    promotion_name: ga4?.promotion_name ?? alt ?? "Banner",
    creative_name: ga4?.creative_name,
    creative_slot: ga4?.creative_slot,
    view: {
      id: ga4?.promotion_id ?? "banner",
      name: ga4?.promotion_name ?? alt ?? "Banner",
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
    <a id={id} href={href} class="relative flex-1">
      <Image
        class="w-full"
        src={src}
        alt={alt}
        width={390}
        height={260}
      />

      {renderEvents(id)}
    </a>
  );
}

/**
 * @title Lista de Banners
 */
export default function BannerArray(
  { banners, sectionProps, isMobile }: ReturnType<typeof loader>,
) {
  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div>
        <div class="max-md:px-3 md:container flex max-sm:flex-col justify-between gap-x-6 gap-y-2">
          {banners.map((banner) => <BannerItem {...banner} />)}
        </div>
      </div>
    </Section>
  );
}
