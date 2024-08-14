import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import FreeShippingProgressBar from "$store/components/header/FreeShippingProgressBar/ProgressBar.tsx";
import Drawers from "$store/islands/header/Drawers.tsx";
import MicroHeaderSetup from "$store/islands/MicroHeaderSetup.tsx";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import { NavElement } from "$store/components/header/NavItem.tsx";
import Alerts, { AlertItem } from "./Alerts.tsx";
import DesktopNavbar from "./DesktopNavbar.tsx";
import MobileNavbar from "./MobileNavbar.tsx";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { MinicartConfig } from "deco-sites/fast-fashion/components/minicart/common/Cart.tsx";
import { useContext } from "preact/hooks";
import { SectionContext } from "deco/components/section.tsx";
import { asset } from "$fresh/runtime.ts";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface Buttons {
  hideSearchButton?: boolean;
  hideAccountButton?: boolean;
  hideWishlistButton?: boolean;
  hideCartButton?: boolean;
}
export interface Props {
  /**
   * @title Largura do carrossel de alertas no desktop
   * @description Largura do carrossel de alertas no desktop, em pixels
   * @default 672
   */
  alertsDesktopWidth?: number;

  /**
   * @title Alertas
   * @description Mensagens de alerta que serão exibidas no topo da página
   */
  alerts?: AlertItem[];

  /** @title Search Bar */
  searchbar: Omit<SearchbarProps, "platform">;

  /** @title Config Minicart */
  minicartConfig?: MinicartConfig;

  /**
   * @title Items do menu
   * @description Itens do menu de navegação, usados no menu desktop e mobile
   */
  navItems?: NavElement[];

  /**
   * @title Departamentos
   * @description Items que serão exibidos no no menu de departamentos
   */
  departments?: NavElement[];

  /** @title Logo */
  logo?: Logo;

  /** @title Link Whatsapp */
  whatsappLink?: string;

  /** @title Valor do frete gratis */
  freeShippingMinimumValue?: number;

  /** @title Mostrar barra de frete gratis */
  showFreeShippingBar?: boolean;

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

function Header({
  alertsDesktopWidth = 672,
  alerts,
  searchbar,
  navItems = [],
  minicartConfig,
  logo,
  departments = [],
  freeShippingMinimumValue = 500,
  showFreeShippingBar,
  sectionProps,
  whatsappLink,
}: Props) {
  const platform = usePlatform();
  const items = navItems ?? [];
  const sectionContext = useContext(SectionContext);

  const isPreview = sectionContext?.context?.state.debugEnabled;
  const isMobile = sectionContext?.device !== "desktop";
  const isMac = sectionContext?.request?.headers.get("user-agent")?.includes(
    "Macintosh",
  );

  const { height: logoHeight = 40 } = logo || {};
  let headerHeight = isMobile ? 106 + logoHeight : 113 + logoHeight;

  if (showFreeShippingBar) headerHeight += 40;

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <header
        id="header"
        class="group/header overflow-visible h-52 md:h-[199px]"
        style={{
          height: headerHeight,
        }}
      >
        <Drawers
          menu={{ items }}
          searchbar={searchbar}
          platform={platform}
          minicartConfig={minicartConfig}
        >
          <div class="fixed z-30 w-full">
            {alerts && alerts.length > 0 && (
              <Alerts
                alerts={alerts}
                desktopWidth={alertsDesktopWidth}
                isMobile={isMobile}
              />
            )}
            {showFreeShippingBar && freeShippingMinimumValue && (
              <FreeShippingProgressBar
                platform={platform}
                target={freeShippingMinimumValue}
              />
            )}
            {(isMobile || isMac || isPreview) && (
              <MobileNavbar
                items={items}
                searchbar={searchbar && { ...searchbar, platform }}
                logo={logo}
                isMac={isMac}
              />
            )}
            {(!isMobile || isMac || isPreview) && (
              <DesktopNavbar
                departments={departments || []}
                items={items}
                searchbar={searchbar && { ...searchbar, platform }}
                logo={logo}
                isMac={isMac}
              />
            )}
          </div>
        </Drawers>
        <div class="fixed bottom-[90px] xl:bottom-[20px] right-4 z-30 flex flex-col gap-4">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Whatsapp"
            >
              <img
                src={asset("/image/whatsapp-icon.svg")}
                width={48}
                height={48}
                loading="lazy"
              />
            </a>
          )}
          <a
            class="btn btn-sm btn-square btn-neutral w-12 h-10 opacity-0 invisible group-data-[micro-header='true']/header:opacity-100 group-data-[micro-header='true']/header:visible transition"
            href="#header"
            aria-label="Voltar ao topo"
          >
            <Icon id="ChevronUp" size={24} />
          </a>
        </div>
        <MicroHeaderSetup rootId="header" threshold={140} />
      </header>
    </Section>
  );
}

export default Header;
