import type { Props as MenuProps } from "$store/components/header/Menu.tsx";
import Cart from "$store/components/minicart/Cart.tsx";
import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Drawer from "$store/components/ui/Drawer.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import type { ComponentChildren } from "preact";
import { lazy, Suspense } from "preact/compat";
import { MinicartConfig } from "deco-sites/fast-fashion/components/minicart/common/Cart.tsx";

const Menu = lazy(() => import("$store/components/header/Menu.tsx"));

export interface Props {
  menu: MenuProps;
  searchbar?: SearchbarProps;
  minicartConfig?: MinicartConfig;
  /**
   * @ignore_gen true
   */
  children?: ComponentChildren;
  platform: ReturnType<typeof usePlatform>;
}

const Aside = ({
  children,
}: {
  title: string;
  onClose?: () => void;
  children: ComponentChildren;
}) => (
  <div class="bg-base-100 h-full max-w-[100vw]">
    <Suspense
      fallback={
        <div class="w-screen flex items-center justify-center">
          <span class="loading loading-ring" />
        </div>
      }
    >
      {children}
    </Suspense>
  </div>
);

function Drawers({ menu, children, platform, minicartConfig }: Props) {
  const { displayCart, displayMenu } = useUI();

  return (
    <>
      <Drawer // left drawer
        open={displayMenu.value}
        onClose={() => {
          displayMenu.value = false;
        }}
        aside={
          <Aside
            onClose={() => {
              displayMenu.value = false;
            }}
            title={displayMenu.value ? "Menu" : "Buscar"}
          >
            {displayMenu.value && <Menu {...menu} />}
          </Aside>
        }
      >
        <Drawer // right drawer
          class="drawer-end"
          open={displayCart.value !== false}
          onClose={() => (displayCart.value = false)}
          aside={
            <Aside
              title="Minha sacola"
              onClose={() => (displayCart.value = false)}
            >
              <Cart platform={platform} minicartConfig={minicartConfig} />
            </Aside>
          }
        >
          {children}
        </Drawer>
      </Drawer>
    </>
  );
}

export default Drawers;
