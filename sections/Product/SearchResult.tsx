export { loader } from "$store/components/search/SearchResult.tsx";
import {
  default as Component,
  loader,
} from "$store/components/search/SearchResult.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Resultado de Busca
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}

export function LoadingFallback() {
  return (
    <div style={{ height: "100vh" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
