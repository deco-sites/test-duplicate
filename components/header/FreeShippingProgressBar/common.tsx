import { formatPrice } from "$store/sdk/format.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { clx } from "$store/sdk/clx.ts";
import { useEffect, useRef } from "preact/hooks";

interface Props {
  total: number;
  locale?: string;
  currency?: string;
  target: number;
  layout?: "header" | "cart";
}

function FreeShippingProgressBar({
  target,
  total,
  layout = "header",
  locale = "pt-BR",
  currency = "BRL",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const missingValue = target - total;
  const reachedFreeShipping = missingValue <= 0;

  const valuePercentage = Math.floor((total / target) * 100);

  useEffect(() => {
    ref.current?.animate(
      [
        {
          opacity: 0,
          offset: 0,
        },
        {
          opacity: 1,
          offset: 0.25,
        },
        {
          opacity: 1,
          offset: 0.75,
        },
        {
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: 500,
        direction: "normal",
        fill: "forwards",
      },
    );
  }, [ref.current, valuePercentage]);

  return (
    <div
      class={clx(
        "relative w-full bg-neutral-300",
        layout === "header"
          ? "group-data-[micro-header='true']/header:max-h-0 transition-[max-height] h-full max-h-[40px] overflow-hidden"
          : "h-10",
      )}
    >
      <div
        class="h-10 bg-primary-300 transition-all"
        style={{
          width: `${valuePercentage}%`,
        }}
      >
        <div
          ref={ref}
          style={{
            background: "oklch(var(--primary-300))",
            backgroundImage:
              `repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25) 28px, oklch(var(--primary-300)) 20px, oklch(var(--primary-300)) 50px)`,
            backgroundPosition: "center",
            backgroundRepeat: "repeat-x",
          }}
          class="w-full h-full"
        />
      </div>
      {total >= 0 && (
        <span class="absolute inset-0 text-neutral-500 flex items-center justify-center gap-x-1 text-sm font-bold">
          {total === 0
            ? (
              <span class="text-neutral-500 flex items-center justify-center gap-x-1 text-sm font-bold">
                <Icon id="Truck" size={24} title="Frete grátis" />
                <span class="uppercase text-neutral-500">Frete Grátis</span>
                {" "}
                a partir de {formatPrice(target, currency, locale)}*
              </span>
            )
            : reachedFreeShipping
            ? (
              <span class="text-primary-300-content flex items-center justify-center gap-x-2 text-sm font-bold">
                <Icon id="Truck" size={24} />
                <div>
                  Parabéns, você ganhou{" "}
                  <span class="uppercase">Frete Grátis!</span>
                </div>
              </span>
            )
            : (
              <span class="text-neutral-500 flex items-center justify-center gap-x-1 text-sm font-bold">
                <Icon id="Truck" size={24} class="pt-1 pl-[2px]" />
                Não perca o <span class="uppercase">Frete Grátis!</span> Só mais
                {" "}
                {formatPrice(missingValue, currency, locale)}
              </span>
            )}
        </span>
      )}
    </div>
  );
}

export default FreeShippingProgressBar;
