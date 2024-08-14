import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { Product, ProductListingPage } from "apps/commerce/types.ts";
import ProductCard, {
  ProductNameRender,
} from "deco-sites/fast-fashion/components/product/ProductCard.tsx";
import Header from "deco-sites/fast-fashion/components/ui/SectionHeader.tsx";
import useDevice from "deco-sites/fast-fashion/hooks/useDevice.ts";
import { usePlatform } from "deco-sites/fast-fashion/sdk/usePlatform.tsx";
import { useTheme } from "deco-sites/fast-fashion/sdk/useTheme.tsx";

export type ProductList = Product[] | null;
export type ProductListPage = ProductListingPage | null;

export interface Props {
  products: Product[] | null;
  /**
   * @title Nome do produto
   * @description Como o título do produto será exibido. Concat para concatenar o nome do produto e do sku.
   * @default concat
   */
  name?: ProductNameRender;

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

function WishlistGallery(
  { products, sectionProps, name }: Props,
) {
  const isEmpty = products?.length === 0;
  const platform = usePlatform();
  const { productImages } = useTheme();
  const { isMobile } = useDevice();

  if (isEmpty || !products) {
    return (
      <Section isMobile={isMobile} {...sectionProps}>
        <div class="container mx-4 sm:mx-auto">
          <div class="mx-10 my-20 flex flex-col gap-4 justify-center items-center">
            <span class="font-medium text-2xl">
              Sua lista de favoritos está vazia
            </span>
            <span>
              Faça login e adicione produtos na sua lista de favoritos para que
              eles apareçam aqui.
            </span>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="container mx-4 sm:mx-auto flex flex-col gap-4">
        <Header title={"Lista de Desejos"} />
        <div class="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 group-has-[#layout-type-list:checked]:grid-cols-1">
          {products.map((product, index) => (
            <ProductCard
              itemListId={"wishlist"}
              itemListName={"wishlist"}
              product={product}
              nameRender={name}
              // preload={index === 0}
              preload={false}
              index={index}
              platform={platform}
              imageAspectRatio={productImages.aspectRatio ?? "2/3"}
              imageFit={productImages.fit ?? "cover"}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WishlistGallery;
