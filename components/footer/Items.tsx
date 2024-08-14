import Icon from "$store/components/ui/Icon.tsx";
import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "$store/sdk/clx.ts";

/** @titleBy title */
interface TextItem {
  /**
   * @default text
   * @ignore
   */
  "@type": "text";
  title: string;
  href: string;
  external?: boolean;
}

/** @titleBy alt */
export interface ImageItem {
  /** @title Imagem */
  src: ImageWidget;
  /** @title Link */
  href: string;
  /**
   * @title É um link externo?
   * @description Se marcado, o link será aberto em uma nova aba
   */
  external?: boolean;
  /** @title Largura */
  width?: number;
  /** @title Altura */
  height?: number;
  /** @title Texto alternativo */
  alt: string;
}

/** @titleBy title */
export interface ImageSection {
  /**
   * @default image
   * @ignore
   */
  "@type": "image";
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Colapsar no mobile
   */
  colapseOnMobile?: boolean;
  imageItems: ImageItem[];
}

/** @titleBy title */
export interface TextSection {
  /**
   * @default image
   * @ignore
   */
  "@type": "text";
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Colapsar no mobile
   */
  colapseOnMobile?: boolean;
  textItems: TextItem[];
}

/** @titleBy title */
export interface HTMLSection {
  /**
   * @default image
   * @ignore
   */
  "@type": "html";
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Colapsar no mobile
   */
  colapseOnMobile?: boolean;
  text: HTMLWidget;
}

export default function Items(
  { sections = [], isMobile }: {
    sections?: (HTMLSection | TextSection | ImageSection)[];
    justify?: boolean;
    isMobile: boolean;
  },
) {
  return (
    <>
      {sections.length > 0 && (
        <>
          <ul class="flex flex-col md:flex-row w-full justify-between">
            {sections.map((section) => (
              <li>
                <div
                  class={clx(
                    "collapse md:collapse-open rounded-none",
                    !section.colapseOnMobile && isMobile && "collapse-open",
                  )}
                >
                  <input type="checkbox" class="peer" checked={false} />
                  <div
                    class={clx(
                      "collapse-title font-bold peer-checked:[&>svg]:rotate-180 flex items-center justify-between list-none p-4 px-5 md:pl-0",
                      section.colapseOnMobile && isMobile &&
                        "h-[50px] md:h-auto border-b border-neutral-700 md:border-none",
                    )}
                  >
                    <span class="select-none">
                      {section.title}
                    </span>
                    <Icon
                      id="ChevronDown"
                      size={24}
                      class={clx(
                        "text-neutral-600 transition-transform md:hidden",
                        !section.colapseOnMobile && isMobile && "hidden",
                      )}
                      strokeWidth={1}
                    />
                  </div>
                  <div
                    class={clx(
                      "collapse-content px-0 max-md:peer-checked:pb-3 md:pb-0",
                      !section.colapseOnMobile && isMobile && "pb-3",
                    )}
                  >
                    {section["@type"] === "image" &&
                      (
                        <ul class="flex gap-4 px-5 md:pl-0">
                          {section.imageItems.map((item) => (
                            <li>
                              <a
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external
                                  ? "noopener noreferrer"
                                  : undefined}
                              >
                                <Image
                                  src={item.src}
                                  alt={item.alt}
                                  width={item.width || 180}
                                  height={item.height || 40}
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    {section["@type"] === "text" &&
                      (
                        <ul class="flex flex-col divide-y divide-neutral-700 md:divide-y-0">
                          {section.textItems.map((item) => (
                            <li>
                              <a
                                class="py-4 px-5 block leading-[18px] hover:underline md:py-2 md:pl-0"
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external
                                  ? "noopener noreferrer"
                                  : undefined}
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    {section["@type"] === "html" && (
                      <div
                        class=" flex flex-col gap-2 leading-[18px] px-5 md:pl-0"
                        dangerouslySetInnerHTML={{ __html: section.text }}
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
