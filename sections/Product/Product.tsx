export { loader } from "$store/components/product/Product.tsx";
import {
  default as Component,
  loader,
} from "$store/components/product/Product.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Produto
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}

export function LoadingFallback() {
  return (
    <div style={{ height: "716px" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
