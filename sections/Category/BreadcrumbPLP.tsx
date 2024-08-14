export { loader } from "$store/components/search/BreadcrumbPLP.tsx";
import {
  default as Component,
  loader,
} from "$store/components/search/BreadcrumbPLP.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Breadcrumb
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
