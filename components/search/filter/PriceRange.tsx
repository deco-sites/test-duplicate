import { formatPrice } from "$store/sdk/format.ts";
import { useSignal } from "@preact/signals";
import { FilterToggle } from "apps/commerce/types.ts";

export interface Props {
  filter: FilterToggle;
}

// const MIN_DIFF = 5;

function extractFilterRange(filter: FilterToggle) {
  const { values } = filter;

  let from = Infinity;
  let to = 0;

  values.forEach((value) => {
    const [a, b] = value.value.split(":");
    if (from > Number(a)) from = Number(a);
    if (to < Number(b)) to = Number(b);
  });

  return { from, to };
}

function getInitialValues() {
  const priceFromUrl = new URLSearchParams(window.location.search).get(
    "filter.price",
  );

  if (!priceFromUrl) return {};

  const [start, end] = priceFromUrl.split(":").map(Number);

  return {
    start,
    end,
  };
}

export default function RangePicker({ filter }: Props) {
  const { from, to } = extractFilterRange(filter);
  const { start, end } = getInitialValues();

  const MIN = Math.floor(from);
  const MAX = Math.ceil(to);
  const DIFF = MAX - MIN;

  // Não necessariamente B > A
  const rangeA = useSignal(start ?? MIN);
  const rangeB = useSignal(end ?? MAX);

  // Necessariamente maxValue > minValue
  const minValue = Math.min(rangeA.value, rangeB.value);
  const maxValue = Math.max(rangeA.value, rangeB.value);

  const leftPercent = (minValue - MIN) * 100 / DIFF;
  const rightPercent = (maxValue - MIN) * 100 / DIFF;

  const inputHandlerA = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    rangeA.value = value;
  };

  const inputHandlerB = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    rangeB.value = value;
  };

  const apply = () => {
    const searchParams = new URLSearchParams(filter.values[0].url);

    searchParams.set("filter.price", `${minValue}:${maxValue}`);

    location.href = `?${searchParams.toString()}`;
  };

  return (
    <div class="flex flex-col gap-2">
      <div class="relative flex items-center justify-center h-3">
        <div class="absolute h-[5px] w-full bg-neutral-300" />

        <div
          class="h-[5px] absolute w-full"
          style={{
            background: rightPercent > leftPercent
              ? `linear-gradient(90deg, transparent ${leftPercent}%, oklch(var(--primary-500)) ${leftPercent}%, oklch(var(--primary-500)) ${rightPercent}%, transparent ${rightPercent}%, transparent 100%)`
              : undefined,
          }}
        />
        <input
          type="range"
          name="range"
          id="fromSlider"
          min={MIN}
          max={MAX}
          value={rangeA}
          class=""
          onChange={inputHandlerA}
          onMouseUp={apply}
        />

        <input
          type="range"
          name="range"
          id="toSlider"
          min={MIN}
          max={MAX}
          value={rangeB}
          class=""
          onChange={inputHandlerB}
          onMouseUp={apply}
        />
        <input
          class="hidden"
          type="checkbox"
          checked
          data-filter-value={`${minValue}:${maxValue}`}
        />
      </div>

      <div class="text-sm text-neutral-400">
        De{" "}
        <span class="font-bold">
          {formatPrice(
            rangeB.value > rangeA.value ? rangeA.value : rangeB.value,
          )}
        </span>{" "}
        até{" "}
        <span class="font-bold">
          {formatPrice(
            rangeB.value > rangeA.value ? rangeB.value : rangeA.value,
          )}
        </span>
      </div>
    </div>
  );
}
