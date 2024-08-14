export { loader } from "$store/components/seo/PageSEO.tsx";
import {
  default as Component,
  loader,
} from "$store/components/seo/PageSEO.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title SEO
 */
export default function PageSEO(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
