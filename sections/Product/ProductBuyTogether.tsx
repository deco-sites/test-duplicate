export { loader } from "$store/components/product/BuyTogether/BuyTogether.tsx";
import {
  default as Component,
  loader,
} from "$store/components/product/BuyTogether/BuyTogether.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Compre Junto
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
