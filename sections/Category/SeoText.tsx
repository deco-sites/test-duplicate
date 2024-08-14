export { loader } from "$store/components/search/SeoText.tsx";
import {
  default as Component,
  loader,
} from "$store/components/search/SeoText.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Texto SEO
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
