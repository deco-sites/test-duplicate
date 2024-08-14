export { loader } from "$store/components/institutional/Institutional.tsx";
import {
  default as Component,
  loader,
} from "$store/components/institutional/Institutional.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Institucional
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
