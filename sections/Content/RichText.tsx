import type { HTMLWidget } from "apps/admin/widgets.ts";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { AppContext } from "$store/apps/site.ts";

export interface Props {
  text: HTMLWidget;
  containerWidth?: number;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

const DEFAULT_TEXT =
  '<p><span style="font-size: 36pt;" data-mce-style="font-size: 36pt;"><strong>Rich Text</strong></span></p><p><span style="font-size: 24pt;" data-mce-style="font-size: 24pt;"><strong>Rich Text</strong></span></p><p><span style="font-size: 18pt;" data-mce-style="font-size: 18pt;"><strong>Rich Text</strong></span></p><p><span style="font-size: 14pt;" data-mce-style="font-size: 14pt;"><strong>Rich Text</strong></span></p>';

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

/**
 * @title Texto Rico
 */
export default function RichText({
  text = DEFAULT_TEXT,
  containerWidth,
  sectionProps,
  isMobile,
}: ReturnType<typeof loader>) {
  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div
        class="container [&_h1]:font-secondary [&_h1]:text-2xl [&_h1]:mb-2 [&_h1]:font-bold [&_h2]:mb-6 [&_p]:text-sm [&_p]:mb-2"
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          maxWidth: containerWidth ? containerWidth : 1440,
          margin: "0 auto",
        }}
      />
    </Section>
  );
}
