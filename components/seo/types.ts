import type { ImageWidget } from "apps/admin/widgets.ts";
import type {
  ProductDetailsPage,
  ProductListingPage,
} from "apps/commerce/types.ts";

export type OGType = "website" | "article" | "product";

export interface OGConfig {
  /**
   * @title Tipo da página
   */
  type?: OGType;

  /**
   * @title Prefixo da tag <head>
   */
  prefix?: string;
}

/**
 * @title Listagem de produtos
 */
export type ListingPage = ProductListingPage | null;

/**
 * @title Detalhes de um produto
 */
export type ProductDetails = ProductDetailsPage | null;

/**
 * @title Não incluir dados dos produtos
 */
export type NoJsonLD = null;

export type StructuredData = NoJsonLD | ListingPage | ProductDetails;

export interface Props {
  /**
   * @title Título da página
   * @description Se "Listagem de produtos" for selecionado em "Dados estruturados dos produtos", o nome do departamento será usado por padrão. Se "Detalhes de um produto" for selecionado, o nome do produto será usado por padrão.
   */
  title?: string;

  /**
   * @title Template do título
   * @description Um modelo para o título da página. Utilize o placeholder %s para incluir o título. Por exemplo: "%s - Miess" resultará em "Seu Título - Miess".
   */
  titleTemplate?: string;

  /**
   * @title Descrição da página
   * @description Se "Listagem de produtos" for selecionado em "Dados estruturados dos produtos", a descrição do departamento será usada por padrão. Se "Detalhes de um produto" for selecionado, a descrição do produto será usada por padrão.
   */
  description?: string;

  /**
   * @title Template da descrição
   * @description Um modelo para a descrição da página. Utilize o placeholder %s para incluir a descrição. Por exemplo: "%s - Miess" resultará em "Sua Descrição - Miess".
   */
  descriptionTemplate?: string;

  /**
   * @title URL canônica
   * @description Se não for definida, a URL da página atual será usada.
   */
  canonical?: string;

  /**
   * @title Palavras-chave
   */
  keywords?: string;

  /**
   * @title Imagem de capa
   * @description A imagem de capa exibida ao compartilhar o link da página. Se não for definida, a imagem padrão do site será usada. Tamanho recomendado: 1200 x 630 px (até 8MB).
   */
  image?: ImageWidget;

  /**
   * @title Favicon
   * @description Um favicon customizado para essa página. Se não for definido, o favicon padrão do site será usado. Tamanho recomendado: 16 x 16 px.
   */
  favicon?: ImageWidget;

  /**
   * @title Habilitar "noindex"
   */
  noIndex?: boolean;

  /**
   * @title Habilitar "nofollow"
   */
  noFollow?: boolean;

  /**
   * @title Configurações do Open Graph
   */
  og?: OGConfig;

  /**
   * @title Dados estruturados dos produtos
   * @description Escolha um loader de produto para carregar os dados estruturados. Se não for definido, os dados estruturados de produtos não serão incluídos, mas outros dados estruturados ainda serão incluídos.
   * @default null
   */
  structuredData: StructuredData;

  /**
   * @title Omitir os dados dos produtos nos dados estruturados
   * @description Se ativado, os produtos não serão incluídos nos dados estruturados. Não incluí-los pode melhorar a performance da página. Outros dados estruturados ainda serão incluídos.
   */
  omitProductsFromStructuredData?: boolean;
}
