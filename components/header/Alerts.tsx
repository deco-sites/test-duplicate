import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "$store/components/ui/Icon.tsx";

/**
 * @title {{text}}
 */
export interface AlertItem {
  /**
   *  @title Ícone
   *  @description Ícone que será exibido ao lado do texto, sera exibido em tamanho 24x24
   */
  icon?: ImageWidget;
  /**
   * @title Texto
   * @description Texto que será exibido no alerta
   */
  text: string;
}

export interface Props {
  desktopWidth?: number;
  /**
   * @title Alertas
   * @description Mensagens que serão exibidas no topo da página
   */
  alerts?: AlertItem[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;

  /**
   * @hide
   * @ignore
   */
  isMobile?: boolean;
}

function Alerts({ desktopWidth, alerts = [], interval = 5, isMobile }: Props) {
  const id = useId();

  return (
    <div class="max-h-14 flex justify-center contain bg-primary transition-[max-height] group-data-[micro-header='true']/header:max-h-0">
      <div
        id={id}
        class="flex gap-4 w-full justify-center"
        style={{
          maxWidth: desktopWidth + "px",
        }}
      >
        {!isMobile && alerts.length > 1 && (
          <Slider.PrevButton class="disabled:hidden">
            <Icon id="TriangleLeft" size={24} class="text-primary-content" />
          </Slider.PrevButton>
        )}

        <Slider class="carousel carousel-center gap-6">
          {alerts.map((alert, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-full flex items-center justify-center gap-1"
            >
              {alert.icon && <Image src={alert.icon} width={24} height={24} />}
              <span class="py-3 text-primary-content text-xs leading-3.5 text-center lg:py-2">
                {alert.text}
              </span>
            </Slider.Item>
          ))}
        </Slider>

        {!isMobile && alerts.length > 1 && (
          <Slider.NextButton class="disabled:hidden">
            <Icon id="TriangleRight" class="text-primary-content" size={24} />
          </Slider.NextButton>
        )}
      </div>

      <SliderJS rootId={id} infinite interval={interval * 1e3} />
    </div>
  );
}

export default Alerts;
