export { loader } from "$store/components/ui/BannerCarousel.tsx";
import {
  default as Component,
  loader,
} from "$store/components/ui/BannerCarousel.tsx";
import type { SectionProps } from "deco/mod.ts";

/**
 * @title Carrousel de Banners
 */
export default function Section(props: SectionProps<typeof loader>) {
  return <Component {...props} />;
}
