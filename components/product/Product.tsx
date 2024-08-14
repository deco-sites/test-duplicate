import { AppContext } from "$store/apps/site.ts";
import GallerySlider from "$store/components/product/Gallery/ImageSlider.tsx";
import type { CustomMethod } from "$store/components/product/PaymentMethods.tsx";
import ProductInfo, {
  identifierCode,
  SizeTableInterface,
} from "$store/components/product/ProductInfo.tsx";
import { ShareOptions } from "$store/components/product/Share.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import {
  Product as ProductType,
  ProductDetailsPage,
} from "apps/commerce/types.ts";
import { ProductNameRender } from "deco-sites/fast-fashion/components/product/ProductCard.tsx";

export interface Props {
  page: ProductDetailsPage | null;
  /**
   * @title Nome do produto
   * @description Como o título do produto será exibido. Concat para concatenar o nome do produto e do sku.
   * @default concat
   */
  name?: ProductNameRender;
  /**
   * @title Código de referencia
   * @description Código a ser exibido abaixo do nome do produto
   */
  identifierCode?: identifierCode;
  /** @title Métodos de Pagamento */
  customMethods?: CustomMethod[];
  /** @title Cross selling */
  crossSelling?: {
    /** @title Titulo */
    title: string;
    /**
     *  @title Propriedade titulo
     *  @description Propriedade do produto que será usada como título
     */
    titleProperty?: string;
    /**
     *  @title Produtos
     */
    products: ProductType[] | null;
  };
  /**
   *  @title Variantes com imagem
   *  @description Lista de variantes que serão renderizadas como imagem
   */
  variantsToRenderAsImage?: string[];
  /** @title Tabelas de Medidas */
  sizeTable?: SizeTableInterface;
  /** @title Compartilhamento */
  shareOptions?: ShareOptions;
  /** @title Selos */
  sealsConfig?: SealConfig[];
  /**
   * @title Configurações da seção
   */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return {
    ...props,
    isMobile: ctx.device !== "desktop",
    productImageAspectRatio: ctx.theme?.props.productImages?.aspectRatio,
    productImageFit: ctx.theme?.props.productImages?.fit,
  };
}

export default function Product({
  page,
  sectionProps,
  sealsConfig,
  crossSelling,
  customMethods,
  sizeTable,
  name,
  variantsToRenderAsImage,
  isMobile,
  shareOptions,
  identifierCode,
  productImageAspectRatio = "1/1",
  productImageFit = "cover",
}: ReturnType<typeof loader>) {
  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList } = page;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const aspectRatio = Number(productImageAspectRatio.split("/")[0]) /
    Number(productImageAspectRatio.split("/")[1]);

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="container mb-8 max-md:mb-10">
        <Breadcrumb itemListElement={breadcrumb.itemListElement} />
      </div>
      <div class="container flex max-lg:flex-col max-lg:gap-8 gap-5">
        <GallerySlider
          page={page}
          layout={{ height: 700 / aspectRatio, width: 700 }}
          sealsConfig={sealsConfig}
          isMobile={isMobile}
          imageAspectRatio={productImageAspectRatio}
          imageFit={productImageFit}
        />
        <ProductInfo
          page={page}
          layout={{ name }}
          shareOptions={shareOptions}
          sizeTable={sizeTable}
          variantsToRenderAsImage={variantsToRenderAsImage}
          crossSelling={crossSelling}
          sealsConfig={sealsConfig}
          identifierCode={identifierCode}
          customMethods={customMethods}
          aspectRatio={aspectRatio}
          imageFit={productImageFit}
        />
      </div>
    </Section>
  );
}
