import type { SectionProps } from "$store/components/ui/Section.tsx";
import Section from "$store/components/ui/Section.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "$store/apps/site.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { RenderHTML } from "$store/components/ui/RenderHTML.tsx";

export interface Props {
  page: ProductDetailsPage | null;
  /**
   * @title Especificações a serem exibidas
   */
  specificationsToShow?: string[];
  /**
   * @title Configurações da seção
   */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

function ProductDescription({
  page,
  sectionProps,
  isMobile,
  specificationsToShow,
}: ReturnType<typeof loader>) {
  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product } = page;
  const { description } = product;
  const propertiesMap = new Map(
    [
      ...(product.additionalProperty ?? []),
      ...(product.isVariantOf?.additionalProperty ?? []),
    ].map((property) => [property.name, property.value]),
  );

  propertiesMap.forEach((_, key) => {
    if (specificationsToShow && !specificationsToShow.includes(key as string)) {
      propertiesMap.delete(key);
    }
  });

  if ((!description || description === "") && propertiesMap.size === 0) {
    return null;
  }

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      {isMobile
        ? (
          <div>
            <div class="bg-primary text-primary-content flex px-6 items-center font-bold h-12">
              <span>Navegue por:</span>
            </div>
            {description && (
              <div class="collapse rounded-none border-b border-base-300 group">
                <input
                  type="checkbox"
                  name="description_acordeon"
                  class="min-h-0"
                />
                <div class="collapse-title min-h-0 leading-5 px-5 py-[14px] h-auto relative">
                  <h2 class="font-bold">Descrição do produto</h2>
                  <Icon
                    id="ChevronDown"
                    size={24}
                    class="absolute right-5 top-3 group-has-[:checked]:rotate-180 transition-transform"
                  />
                </div>
                <div class="collapse-content px-5 leading-5">
                  <RenderHTML
                    html={description ?? ""}
                    class="leading-[17px] text-sm [&_h2]:text-lg [&_h2]:my-[15px] [&_h2]:font-bold [&_h3]:text-base [&_h3]:my-4 [&_h3]:font-bold"
                  />
                </div>
              </div>
            )}
            {propertiesMap.size > 0 && (
              <div class="collapse rounded-none border-b border-base-300 group">
                <input
                  type="checkbox"
                  name="description_acordeon"
                  class="min-h-0"
                />
                <div class="collapse-title min-h-0 leading-5 px-5 py-[14px] h-auto relative">
                  <h2 class="font-bold">Especificação do produto</h2>{" "}
                  <Icon
                    id="ChevronDown"
                    size={24}
                    class="absolute right-5 top-3 group-has-[:checked]:rotate-180 transition-transform"
                  />
                </div>
                <div class="collapse-content px-5">
                  <table class="w-full">
                    {Array.from(propertiesMap).map(([key, value]) => (
                      <tr class="odd:bg-neutral-200">
                        <td class="pl-10 pr-24 py-1.5 max-md:py-2">{key}:</td>
                        <td class="font-bold w-full py-1.5 max-md:py-2">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            )}
          </div>
        )
        : (
          <div class="container group relative">
            <div class="flex bg-neutral-200">
              <div class="flex-1 bg-primary text-primary-content flex pr-9 items-center justify-end font-bold font-secondary">
                <span>Navegue por:</span>
              </div>
              <div class="flex-1 flex justify-center">
                <input
                  type="radio"
                  name="description_tabs"
                  id="description"
                  class="hidden peer"
                  checked
                />
                <label
                  htmlFor="description"
                  class="h-[42px] border-b-2 border-solid border-transparent peer-checked:border-neutral-400 peer-checked:font-black hover:font-black flex items-center justify-center w-full max-w-64 cursor-pointer text-sm"
                >
                  <h2>Descrição do produto</h2>
                </label>
              </div>
              {
                // Only show specification tab if there are properties to show
                propertiesMap.size > 0 && (
                  <div class="flex-1 flex justify-center">
                    <input
                      type="radio"
                      name="description_tabs"
                      id="specification"
                      class="hidden peer"
                    />
                    <label
                      htmlFor="specification"
                      class="h-[42px] border-b-2 border-solid border-transparent peer-checked:border-neutral-400 peer-checked:font-black hover:font-black flex items-center justify-center w-full max-w-64 cursor-pointer"
                    >
                      <h2>Especificação do produto</h2>
                    </label>
                  </div>
                )
              }
            </div>
            <div class="pt-[46px] px-[42px]">
              <div class="group-has-[#description:checked]:block hidden">
                <RenderHTML
                  html={description ?? ""}
                  class="leading-[17px] text-sm [&_h2]:text-lg [&_h2]:my-[15px] [&_h2]:font-bold [&_h3]:text-base [&_h3]:my-4 [&_h3]:font-bold"
                />
              </div>
              {
                // Only show specification tab if there are properties to show
                propertiesMap.size > 0 && (
                  <div class="group-has-[#specification:checked]:block hidden">
                    <table class="w-full">
                      {Array.from(propertiesMap).map(([key, value]) => (
                        <tr class="odd:bg-neutral-200">
                          <td class="pl-10 pr-24 py-1.5">{key}:</td>
                          <td class="font-bold w-full py-1.5">{value}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                )
              }
            </div>
          </div>
        )}
    </Section>
  );
}

export default ProductDescription;
