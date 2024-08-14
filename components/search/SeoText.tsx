import { Matcher } from "deco/blocks/matcher.ts";
import { LoaderContext } from "deco/types.ts";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { filterByMatcher } from "$store/sdk/matcher.ts";
import { HTMLWidget } from "apps/admin/widgets.ts";

export interface Content {
  /** @title Identificação do conteúdo */
  label?: string;

  /** @title Regra de aplicação do conteúdo */
  rule?: Matcher;

  /** @title Título */
  title: string;

  /** @title Sub título */
  subtitle?: string;

  /** @title Texto */
  text: HTMLWidget;
}

export interface Props {
  /** @title Lista de conteúdos */
  contents?: Content[];

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export async function loader(
  props: Props,
  request: Request,
  ctx: LoaderContext,
) {
  const contents = await filterByMatcher({
    items: props.contents ?? [],
    ctx,
    request,
  });

  return { ...props, contents, isMobile: ctx.device !== "desktop" };
}

export default function SeoText(
  { sectionProps, contents: [content], isMobile }: Awaited<
    ReturnType<typeof loader>
  >,
) {
  if (!content) return null;

  const { title, subtitle, text } = content;

  return (
    <Section
      class="py-16 border-t border-neutral-200"
      isMobile={isMobile}
      {...sectionProps}
    >
      <div class="container text-neutral-600">
        {title && <h1 class="text-2xl font-bold font-secondary">{title}</h1>}
        {subtitle && <h2 class="text-base font-secondary mt-2">{subtitle}</h2>}
        <div class="text-sm mt-6" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </Section>
  );
}
