import { Logo } from "$store/components/header/Header.tsx";
import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import CartButtonLinx from "../../islands/header/Cart/linx.tsx";
import CartButtonNuvemshop from "../../islands/header/Cart/nuvemshop.tsx";
import CartButtonShopify from "../../islands/header/Cart/shopify.tsx";
import CartButtonVDNA from "../../islands/header/Cart/vnda.tsx";
import CartButtonVTEX from "../../islands/header/Cart/vtex.tsx";
import CartButtonWake from "../../islands/header/Cart/wake.tsx";
import Searchbar from "../../islands/header/Searchbar.tsx";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import Image from "apps/website/components/Image.tsx";
import Login from "$store/components/header/Login/Login.tsx";
import NavItem, { NavElement } from "$store/components/header/NavItem.tsx";
import DepartmentMenu from "$store/components/header/DepartmentMenu.tsx";
import { twMerge } from "deco-sites/fast-fashion/sdk/twMerge.ts";

function DesktopNavbar({
  items,
  searchbar,
  departments,
  logo,
  isMac = false,
}: {
  items: NavElement[];
  departments: NavElement[];
  searchbar: SearchbarProps;
  logo?: Logo;
  isMac?: boolean;
}) {
  const platform = usePlatform();

  return (
    <div
      class={twMerge(
        "w-full text-sm leading-4 group/desktop-navbar hidden",
        isMac ? "xl:block" : "lg:block",
      )}
    >
      <div class="border-b border-solid border-neutral-200 relative z-10 bg-base-100">
        <div class="container flex items-center gap-6 py-4">
          {logo && (
            <a href="/" aria-label="Store logo" class="block">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 180}
                height={logo.height || 40}
              />
            </a>
          )}

          <Searchbar {...searchbar} />

          <Login />

          <a
            class="flex items-center gap-2 h-10"
            href="/wishlist"
            aria-label="Favoritos"
          >
            <Icon id="Heart" size={24} class="text-primary" title="Favoritos" />
            Favoritos
          </a>

          <div class="flex items-center">
            {platform === "vtex" && <CartButtonVTEX />}
            {platform === "vnda" && <CartButtonVDNA />}
            {platform === "wake" && <CartButtonWake />}
            {platform === "linx" && <CartButtonLinx />}
            {platform === "shopify" && <CartButtonShopify />}
            {platform === "nuvemshop" && <CartButtonNuvemshop />}
          </div>
        </div>
      </div>
      <div class="absolute z-0 w-full bg-base-100 group-data-[micro-header='true']/header:group-data-[micro-header-up='false']/header:-translate-y-full visible transition-all group-data-[micro-header='true']/header:shadow-md">
        <div class="container flex justify-center">
          <div class="dropdown"></div>
          <ul class="flex justify-center col-span-1">
            {departments.length > 0 && (
              <li>
                <DepartmentMenu departments={departments} />
              </li>
            )}
            {items.map((item, index) => (
              <NavItem
                item={item}
                openTo={index > (items.length - 2) / 2 ? "left" : "right"}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DesktopNavbar;
