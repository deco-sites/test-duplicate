import type { FilterToggle, ProductListingPage } from "apps/commerce/types.ts";
import Gallery from "$store/components/search/Gallery.tsx";
import Section from "$store/components/ui/Section.tsx";
import { SectionProps } from "$store/components/ui/Section.tsx";
import OrderBy from "$store/components/search/OrderBy.tsx";
import LayoutSwitcher from "$store/components/search/LayoutSwitcher.tsx";
import Filters from "./filter/desktop/Filters.tsx";
import FiltersMobile from "./filter/mobile/Filters.tsx";
import Pagination from "$store/components/search/Pagination.tsx";
import { AppContext } from "$store/apps/site.ts";
import { toProductItem } from "deco-sites/fast-fashion/sdk/ga4/transform/toProductItem.ts";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import { SendEventOnView } from "deco-sites/fast-fashion/components/Analytics.tsx";
import { useContext } from "preact/hooks";
import { SectionContext } from "deco/components/section.tsx";
import { Section as SectionType } from "deco/blocks/section.ts";
import { ProductNameRender } from "deco-sites/fast-fashion/components/product/ProductCard.tsx";

export interface Layout {
  /**
   * @title Filters style
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   * @default aside
   */
  variant?: "aside" | "drawer";
}

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;

  /**
   * @title Nome do produto
   * @description Como o título do produto será exibido. Concat para concatenar o nome do produto e do sku.
   * @default concat
   */
  productName?: ProductNameRender;

  /** @title Busca vazia */
  notFound: SectionType;

  /** @title Configurações de seção */
  sectionProps?: SectionProps;

  /**
   * @ignore
   */
  title?: string;
  /**
   * @ignore
   */
  hideSort?: boolean;
}

const ALWAYS_HIDE = ["categoria", "category-1"];

export function loader(props: Props, req: Request, ctx: AppContext) {
  // Filters cleanup
  if (props.page) {
    const { filters = [] } = props.page;

    props.page.filters = filters.filter((filter) => {
      return (
        !ALWAYS_HIDE.includes(filter.key) && filter["@type"] === "FilterToggle"
      );
    });
  }

  return {
    ...props,
    url: req.url,
    productImageAspectRatio: ctx.theme?.props.productImages?.aspectRatio,
    productImageFit: ctx.theme?.props.productImages?.fit,
  };
}

function SearchResult({
  page,
  sectionProps,
  notFound,
  url,
  productName,
  productImageAspectRatio,
  productImageFit,
  title,
  hideSort,
}: ReturnType<typeof loader>) {
  const { searchParams } = new URL(url ?? "http://example.com"); // Bug
  const term = searchParams.get("q") ?? undefined;
  const NotFound = notFound?.Component;
  const notFoundProps = notFound?.props;

  const sectionContext = useContext(SectionContext);
  const isMobile = sectionContext?.device !== "desktop";
  const isMac = !!sectionContext?.request?.headers
    .get("user-agent")
    ?.includes("Macintosh");

  return (
    <Section {...sectionProps} isMobile={isMobile}>
      {page && page.products.length > 0
        ? (
          <Result
            title={title}
            isMac={isMac}
            page={page}
            url={url}
            productName={productName}
            isMobile={isMobile}
            productImageAspectRatio={productImageAspectRatio}
            productImageFit={productImageFit}
            term={term}
            hideSort={hideSort}
          />
        )
        : (
          NotFound && <NotFound {...notFoundProps} />
        )}
    </Section>
  );
}

function Result({
  page,
  url,
  isMobile,
  productImageAspectRatio,
  productImageFit,
  isMac,
  productName,
  title,
  hideSort,
}: Omit<ReturnType<typeof loader>, "sectionProps" | "notFound"> & {
  term?: string;
  isMac: boolean;
  isMobile: boolean;
}) {
  if (!page) return null;

  const { filters, breadcrumb, pageInfo } = page;
  const { recordPerPage = 0, records = 0, currentPage } = pageInfo ?? {};
  const pageQuantity = Math.ceil(records / recordPerPage);

  const urlWithoutFilters = new URL(url);
  const filterParams = [...urlWithoutFilters.searchParams.keys()].filter(
    (key) => key.startsWith("filter."),
  );
  filterParams.forEach((key) => urlWithoutFilters.searchParams.delete(key));

  const itemListName = breadcrumb.itemListElement?.at(-1)?.name ??
    "search_result";
  const itemListId = breadcrumb.itemListElement?.at(-1)?.item ??
    "Departamento/Resultado de busca";

  const VTEX_VIEW_ITEM_LIST = toAnalytics({
    type: "view_item_list",
    data: {
      items: page.products.map((product, index) =>
        toProductItem(product, { quantity: 1, index })
      ),
      view: { id: itemListName, name: itemListName },
    },
  });

  return (
    <div class="group container">
      {/* Page title */}
      <h1 class="text-2xl text-neutral-600 font-bold font-secondary">
        {title ??
          breadcrumb.itemListElement.at(-1)?.name ??
          "Resultados da busca"}
      </h1>

      {/* Mobile */}
      {(isMobile || isMac) && (
        <div class="block xl:hidden">
          <div class="flex justify-between mt-10 lg:mt-8">
            {!hideSort && <OrderBy url={url} />}
            <FiltersMobile filters={filters} url={url} />
          </div>

          <hr class="mt-10 lg:mt-8" />
        </div>
      )}

      {/* Filters and products */}
      <div class="flex gap-5 mt-10 lg:mt-8">
        {/* Filters */}
        {(!isMobile || isMac) && filters.length > 0 && (
          <div class="hidden xl:block min-w-[300px]">
            <div class="w-full px-4 font-bold border-b border-neutral h-20 flex justify-between items-center">
              <h3 class="text-lg">Filtrar por</h3>
              {url !== urlWithoutFilters.toString() && (
                <a
                  href={urlWithoutFilters.toString()}
                  class="btn btn-outline text-sm text-neutral-600"
                >
                  Limpar filtros
                </a>
              )}
            </div>
            <Filters filters={filters as FilterToggle[]} url={url} />
          </div>
        )}

        {/* Gallery */}
        <div class="flex-1">
          <div class="flex gap-6 mb-10">
            <div class="flex-1 flex justify-between border-b border-neutral-200 md:pl-2.5 items-center">
              {/* Quantity found */}
              <span class="text-sm text-neutral-600 whitespace-nowrap">
                {pageInfo.records} produtos encontrados
              </span>

              {/* Order by */}
              {(!isMobile || isMac) && !hideSort && (
                <div class="hidden xl:block">
                  <OrderBy url={url} />
                </div>
              )}
            </div>

            {/* Layout switcher */}
            <LayoutSwitcher />
          </div>

          <div id="search_result_gallery" class="lg:px-5">
            <Gallery
              listId={itemListId}
              listName={itemListName}
              page={page}
              productName={productName}
              imageAspectRatio={productImageAspectRatio}
              imageFit={productImageFit}
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pageQuantity > 1 && (
        <div class="flex flex-col items-center justify-between gap-4 mt-10 lg:flex-row lg:pl-[300px]">
          <span class="text-sm">
            Mostrando <strong>{currentPage}</strong> de{" "}
            <strong>{pageQuantity}</strong> páginas
          </span>
          <Pagination pageInfo={pageInfo} url={url} />
        </div>
      )}

      <SendEventOnView id="search_result_gallery" event={VTEX_VIEW_ITEM_LIST} />
    </div>
  );
}

export default SearchResult;
