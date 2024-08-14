export { loader } from "$store/components/product/ProductDescription.tsx";
import {
  default as Component,
  loader,
} from "$store/components/product/ProductDescription.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Descrição do Produto
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
