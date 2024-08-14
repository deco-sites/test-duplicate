import useDevice from "deco-sites/fast-fashion/hooks/useDevice.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { usePartialSection } from "deco/hooks/usePartialSection.ts";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { useId } from "$store/sdk/useId.ts";
import { useScriptAsDataURI } from "deco/hooks/useScript.ts";
import { usePlatform } from "deco-sites/fast-fashion/sdk/usePlatform.tsx";
import VtexProductReviews from "deco-sites/fast-fashion/islands/ProductReviews/vtex.tsx";
import WakeProductReviews from "deco-sites/fast-fashion/islands/ProductReviews/wake.tsx";

export interface Props {
  page: ProductDetailsPage | null;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
  /**
   *  @title Defer Mode
   *  @description Defer atrasa o carregamento da seção até que o usuário role a página ou a seção entre na tela.
   *  @default none
   */
  defer?: "scroll" | "intersection" | "none";
}

const script = (
  id: string,
  type: "scroll" | "intersection",
) => {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  if (type === "scroll") {
    addEventListener(
      "scroll",
      () => setTimeout(() => element.click(), 200),
      { once: true },
    );
  }

  if (type === "intersection") {
    new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (document.readyState !== "complete") {
            document.addEventListener("DOMContentLoaded", () => {
              // @ts-expect-error trustme, I'm an engineer
              entry.target.click();
            });

            return;
          }

          // @ts-expect-error trustme, I'm an engineer
          entry.target.click();
        }
      }
    }, { rootMargin: "200px" }).observe(element);
  }
};

export const onBeforeResolveProps = (props: Props) => {
  if (props.defer !== "none" && props.defer) {
    return {
      ...props,
      page: null,
    };
  }

  return props;
};

/**
 * @title Avaliações
 */
export default function ProductReviews(props: Props) {
  const { isMobile } = useDevice();
  const { page, defer, sectionProps } = props;
  const id = useId();
  const buttonId = `deffered-${id}`;

  const partial = usePartialSection<typeof ProductReviews>({
    props: { defer: "none" },
  });

  if (defer !== "none" && defer) {
    return (
      <div class="relative">
        <Section isMobile={isMobile} {...sectionProps}>
          <div
            style={{ height: "716px" }}
            class="flex justify-center items-center"
          >
            <span class="loading loading-spinner" />
          </div>
          <script
            defer
            src={useScriptAsDataURI(
              script,
              buttonId,
              defer,
            )}
          />
          <button
            {...partial}
            id={buttonId}
            class="absolute inset-0"
            data-deferred
            aria-label={`Deferred Section - ${id}`}
          />
        </Section>
      </div>
    );
  }

  if (!page) return null;

  const { inProductGroupWithID, review, productID } = page.product;

  const platform = usePlatform();

  if (platform === "vtex") {
    return (
      <VtexProductReviews
        productGroupID={inProductGroupWithID!}
        isMobile={isMobile}
      />
    );
  }

  if (platform === "wake") {
    return (
      <WakeProductReviews
        productID={productID}
        isMobile={isMobile}
        reviews={review ?? []}
      />
    );
  }

  return null;

  // return <Island productID={inProductGroupWithID!} isMobile={isMobile} />;
}
