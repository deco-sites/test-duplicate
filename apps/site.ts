import commerce from "apps/commerce/mod.ts";
import { color as shopify } from "apps/shopify/mod.ts";
import { color as vnda } from "apps/vnda/mod.ts";
import { color as vtex } from "apps/vtex/mod.ts";
import { color as wake } from "apps/wake/mod.ts";
import { color as linx } from "apps/linx/mod.ts";
import { color as nuvemshop } from "apps/nuvemshop/mod.ts";
import { Section } from "deco/blocks/section.ts";
import type { App as A, AppContext as AC } from "deco/mod.ts";
import { rgb24 } from "std/fmt/colors.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
import { Props as WebsiteProps } from "apps/website/mod.ts";
import { ThemeColors } from "$store/components/theme/theme.d.ts";
import { Config } from "apps/vtex/loaders/config.ts";
import { ProductImages } from "deco-sites/fast-fashion/sections/Theme/Theme.tsx";

export type Props = {
  /**
   * @title Active Commerce Platform
   * @description Choose the active ecommerce platform
   * @default custom
   */
  platform: Platform;
  theme?: Section;
  vtex?: Config;
} & WebsiteProps;

export type Platform =
  | "vtex"
  | "vnda"
  | "shopify"
  | "wake"
  | "linx"
  | "nuvemshop"
  | "custom";

export let _platform: Platform = "custom";
export let _theme: { colors: ThemeColors; productImages: ProductImages };

export type App = ReturnType<typeof Site>;
export type AppContext = AC<App>;

const color = (platform: string) => {
  switch (platform) {
    case "vtex":
      return vtex;
    case "vnda":
      return vnda;
    case "wake":
      return wake;
    case "shopify":
      return shopify;
    case "linx":
      return linx;
    case "nuvemshop":
      return nuvemshop;
    case "deco":
      return 0x02f77d;
    default:
      return 0x212121;
  }
};

let firstRun = true;

export default function Site(
  state: Props,
): A<Manifest, Props, [ReturnType<typeof commerce>]> {
  _platform = state.platform || "custom";
  _theme = {
    colors: state.theme?.props.mainColors || {} as ThemeColors,
    productImages: state.theme?.props.productImages || {} as ProductImages,
  };

  // Prevent console.logging twice
  if (firstRun) {
    firstRun = false;
    console.info(
      ` 🐁 ${rgb24("Storefront", color("deco"))} | ${
        rgb24(
          _platform,
          color(_platform),
        )
      } \n`,
    );
  }

  return {
    state,
    manifest,
    dependencies: [
      commerce({
        ...state,
        global: state.theme
          ? [...(state.global ?? []), state.theme]
          : state.global,
      }),
    ],
  };
}

export { onBeforeResolveProps } from "apps/website/mod.ts";
