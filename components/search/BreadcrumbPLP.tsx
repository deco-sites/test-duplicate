import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import type { LoaderContext } from "deco/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import Section from "$store/components/ui/Section.tsx";
import { SectionProps } from "$store/components/ui/Section.tsx";

export interface Props {
  page: ProductListingPage | null;

  /** @title Configurações de seção */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: LoaderContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

function BreadcrumbPLP(
  { page, sectionProps, isMobile }: ReturnType<typeof loader>,
) {
  const { breadcrumb } = page ?? {
    breadcrumb: {
      "@type": "BreadcrumbList",
      "numberOfItems": 1,
      "itemListElement": [
        {
          "@type": "ListItem",
          "name": "Busca não encontrada",
          "position": 1,
          "item": "#",
        },
      ],
    },
  };

  return (
    <Section {...sectionProps} isMobile={isMobile}>
      <div class="container">
        <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
      </div>
    </Section>
  );
}

export default BreadcrumbPLP;
