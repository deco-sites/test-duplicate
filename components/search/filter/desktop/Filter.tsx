import { FilterToggle } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";
import PriceRange from "$store/components/search/filter/PriceRange.tsx";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";
import { useId } from "deco-sites/fast-fashion/sdk/useId.ts";

interface FilterValuesProps {
  filter: FilterToggle;
  open?: boolean;
}

export function RegularFilter({ filter, open }: FilterValuesProps) {
  const { key, label, values } = filter;
  const id = useId();

  const hasSelected = values.some((value) => value.selected);

  return (
    <div class="group/filter border-b" data-filter-key={key}>
      <input
        class="filter-checkbox hidden peer"
        type="checkbox"
        id={id}
        checked={open || hasSelected}
      />
      <label
        htmlFor={id}
        class="flex items-center justify-between px-4 py-2 text-neutral-700 cursor-pointer"
      >
        <h5 class="font-bold">{label}</h5>
        <Icon
          class="rotate-90 group-has-[.filter-checkbox:checked]/filter:-rotate-90"
          id="ChevronRight"
          height={24}
          width={24}
        />
      </label>

      {/* Values */}
      <div class="grid grid-rows-[0fr] peer-checked:grid-rows-[1fr] peer-checked:pb-3 transition-all duration-300">
        <ul
          class={clx(
            "overflow-hidden flex-col flex  max-h-60",
            values.length > 6 && "overflow-y-auto",
          )}
        >
          {values.map(
            ({ label, quantity, selected, url }) => {
              return (
                <a
                  href={url}
                  class="group/filter-opt flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 cursor-pointer"
                >
                  <div
                    data-selected={selected ? "" : undefined}
                    class="flex-shrink-0 group/checkbox flex items-center group-hover/filter-opt:border-neutral-500 justify-center w-6 h-6 border border-neutral-300 data-[selected]:bg-primary-500 data-[selected]:!border-primary-500 relative"
                  >
                    <Icon
                      id="Check"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      class="w-4 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute pointer-events-none group-data-[selected]/checkbox:block stroke-white"
                    />
                  </div>
                  <span>{label}</span>
                  <span>({quantity})</span>
                </a>
              );
            },
          )}
        </ul>
      </div>
    </div>
  );
}

export function PriceFilter({ filter }: FilterValuesProps) {
  const { key, label } = filter;

  return (
    <div class="border-b lg:pb-4" data-filter-key={key}>
      {/* Label */}
      {!!label && (
        <div class="flex items-center justify-between px-4 py-2 text-neutral-700 cursor-pointer">
          <h5 class="font-bold">{label}</h5>
        </div>
      )}

      {/* Values */}
      <div class="p-4 lg:py-2">
        <PriceRange filter={filter} />
      </div>
    </div>
  );
}

export default function Filter({ filter, open }: FilterValuesProps) {
  //
  if (filter.key === "price") return <PriceFilter {...{ filter, open }} />;

  return <RegularFilter {...{ filter, open }} />;
}
