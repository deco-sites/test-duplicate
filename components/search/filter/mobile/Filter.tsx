import { FilterToggle } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { PriceFilter } from "deco-sites/fast-fashion/components/search/filter/desktop/Filter.tsx";
import { useId } from "deco-sites/fast-fashion/sdk/useId.ts";

interface FilterValuesProps {
  filter: FilterToggle;
  open?: boolean;
}

export default function Filter({ filter, open }: FilterValuesProps) {
  const { key, label, values } = filter;
  const id = useId();

  return (
    <div class="group/filter" data-filter-key={key}>
      <input
        class="filter-checkbox hidden"
        type="checkbox"
        id={id}
        checked={open}
      />
      <label
        for={id}
        class="flex items-center justify-between bg-primary-500 px-6 py-3"
      >
        <h5 class="text-primary-content font-bold">{label}</h5>
        <Icon
          class="rotate-90 duration-200 text-primary-content group-has-[.filter-checkbox:checked]/filter:-rotate-90"
          id="ChevronRight"
          height={24}
          width={24}
        />
      </label>

      {/* Values */}
      {key === "price"
        ? (
          <div class="hidden flex-col group-has-[.filter-checkbox:checked]/filter:flex">
            <PriceFilter
              filter={{ ...filter, label: "" }}
              open={open}
            />
          </div>
        )
        : (
          <ul class="hidden flex-col group-has-[.filter-checkbox:checked]/filter:flex">
            {values.map(({ label, quantity, selected, value }) => {
              return (
                <label class="flex items-center gap-2 px-6 py-3 text-sm text-neutral-600">
                  <div class="relative w-6 h-6 shrink-0">
                    <input
                      class="peer appearance-none shrink-0 w-full h-full bg-white outline-none checked:bg-primary-500 border border-gray-300 checked:!border-primary-500 hover:border-neutral-500"
                      data-filter-value={value}
                      type="checkbox"
                      checked={selected}
                    />
                    <Icon
                      id="Check"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      class="w-4 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute pointer-events-none hidden peer-checked:block stroke-white"
                    />
                  </div>
                  <span>{label}</span>
                  <span>({quantity})</span>
                </label>
              );
            })}
          </ul>
        )}
    </div>
  );
}
