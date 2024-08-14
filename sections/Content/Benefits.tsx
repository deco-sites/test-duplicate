import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { AppContext } from "$store/apps/site.ts";
import { clx } from "$store/sdk/clx.ts";

/**
 * @titleBy label
 */
export interface Benefit {
  /**
   *  @title Ícone
   *  @description Ícone que será exibido ao lado do texto, sera exibido em tamanho 35x35
   */
  icon?: ImageWidget;
  /**  @title Título */
  label: string;
}

export interface Props {
  /** @title Benefícios */
  benefits?: Benefit[];
  /** @title Intervalo (em segundos) */
  interval?: number;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      tablet?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    /**
     * @title Mostrar setas
     * @default true
     */
    showArrows?: boolean;
  };
}

const slideSizesDesktop = {
  1: "lg:w-full",
  2: "lg:w-1/2",
  3: "lg:w-1/3",
  4: "lg:w-1/4",
  5: "lg:w-1/5",
};

const slideSizesMobile = {
  1: "w-full",
  2: "w-1/2",
  3: "w-1/3",
  4: "w-1/4",
  5: "w-1/5",
};

const slideSizesTablet = {
  1: "sm:w-full",
  2: "sm:w-1/2",
  3: "sm:w-1/3",
  4: "sm:w-1/4",
  5: "sm:w-1/5",
};

function Buttons() {
  return (
    <>
      <div class="w-10 h-10 absolute translate-y-[-50%] left-0 top-1/2 xl:hidden">
        <Slider.PrevButton class="w-10 h-10 flex justify-center items-center text-neutral-1">
          <Icon class="text-neutral-1" size={24} id="TriangleLeft" />
        </Slider.PrevButton>
      </div>
      <div class="w-10 h-10 absolute translate-y-[-50%] right-0 top-1/2 xl:hidden">
        <Slider.NextButton class="w-10 h-10 flex justify-center items-center text-neutral-1">
          <Icon class="text-neutral-1" size={24} id="TriangleRight" />
        </Slider.NextButton>
      </div>
    </>
  );
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

/**
 * @title Benefícios
 */
function Benefits(
  { interval = 5, benefits, sectionProps, isMobile, layout }: ReturnType<
    typeof loader
  >,
) {
  const id = useId();

  const { numberOfSliders, showArrows = true } = layout || {};

  return (
    <Section isMobile={isMobile} {...sectionProps} class="">
      <div id={id} class="lg:px-0 bg-primary text-primary-content py-2">
        <div class="container relative">
          <Slider class="carousel carousel-center flex justify-between items-center overflow-x-auto">
            {benefits?.map(({ label, icon }, index) => (
              <>
                <Slider.Item
                  index={index}
                  class={clx(
                    "carousel-item w-full justify-center lg:w-1/2 xl:w-fit lg:flex lg:items-center xl:px-11",
                    slideSizesDesktop[numberOfSliders?.desktop ?? 4],
                    slideSizesMobile[numberOfSliders?.mobile ?? 1],
                    slideSizesTablet[numberOfSliders?.tablet ?? 2],
                  )}
                >
                  <div class="flex gap-x-2 justify-center items-center max-w-full h-16">
                    {icon && <Image src={icon} width={35} height={35} />}
                    <div class="">{label}</div>
                  </div>
                </Slider.Item>
                <div class="divider w-px h-16 bg-primary-content m-0 hidden lg:block last:hidden" />
              </>
            ))}
          </Slider>
          {showArrows && <Buttons />}
          <SliderJS
            rootId={id}
            interval={interval && interval * 1e3}
            infinite
          />
        </div>
      </div>
    </Section>
  );
}

export default Benefits;
