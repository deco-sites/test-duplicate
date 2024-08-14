import { LoaderContext } from "deco/types.ts";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";

export interface Props {
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _request: Request, ctx: LoaderContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

export default function Line(
  { sectionProps, isMobile }: ReturnType<typeof loader>,
) {
  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="divider" />
    </Section>
  );
}
