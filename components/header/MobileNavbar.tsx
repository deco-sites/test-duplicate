import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { MenuButton } from "../../islands/header/Buttons.tsx";
import CartButtonLinx from "../../islands/header/Cart/linx.tsx";
import CartButtonShopify from "../../islands/header/Cart/shopify.tsx";
import CartButtonVDNA from "../../islands/header/Cart/vnda.tsx";
import CartButtonVTEX from "../../islands/header/Cart/vtex.tsx";
import CartButtonWake from "../../islands/header/Cart/wake.tsx";
import CartButtonNuvemshop from "../../islands/header/Cart/nuvemshop.tsx";
import Searchbar from "../../islands/header/Searchbar.tsx";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import Image from "apps/website/components/Image.tsx";
import { Logo } from "$store/components/header/Header.tsx";
import { NavElement } from "$store/components/header/NavItem.tsx";
import { twMerge } from "deco-sites/fast-fashion/sdk/twMerge.ts";

function MobileNavbar({
  searchbar,
  logo,
  isMac = false,
}: {
  items: NavElement[];
  searchbar: SearchbarProps;
  logo?: Logo;
  isMac?: boolean;
}) {
  const platform = usePlatform();

  return (
    <div
      class={twMerge(
        "bg-base-100",
        isMac ? "xl:hidden" : "lg:hidden",
      )}
    >
      <div class="flex justify-between items-center w-full py-2 px-3 gap-2 bg-base-100 relative z-10">
        <MenuButton />
        {logo && (
          <a
            href="/"
            class="flex-grow inline-flex items-center justify-center group-data-[micro-header='true']/header:mr-11 transition-all"
            aria-label="Store logo"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 180}
              height={logo.height || 40}
            />
          </a>
        )}

        <div class="opacity-0 invisible group-data-[micro-header='true']/header:visible group-data-[micro-header='true']/header:opacity-100 absolute right-16 md:right-20 transition">
          <label
            htmlFor="searchBar"
            class="btn btn-square text-primary btn-ghost swap"
          >
            <input id="searchBar" type="checkbox" class="hidden" checked />
            <Icon id="MagnifyingGlass" size={24} class="swap-on" />
            <Icon id="XMark" size={24} class="swap-off" />
          </label>
        </div>

        <div class="flex justify-end gap-1">
          {platform === "vtex" && <CartButtonVTEX />}
          {platform === "vnda" && <CartButtonVDNA />}
          {platform === "wake" && <CartButtonWake />}
          {platform === "linx" && <CartButtonLinx />}
          {platform === "shopify" && <CartButtonShopify />}
          {platform === "nuvemshop" && <CartButtonNuvemshop />}
        </div>
      </div>
      <div class="flex px-5 pt-1.5 pb-2 group-has-[#search-input:not(:focus)]/header:group-data-[micro-header='true']/header:group-has-[#searchBar:checked]/header:-translate-y-full transition-transform absolute w-full z-0 group-data-[micro-header='true']/header:shadow-md bg-base-100">
        <Searchbar {...searchbar} />
      </div>
    </div>
  );
}

export default MobileNavbar;
