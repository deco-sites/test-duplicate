import { Filter as FilterType, FilterToggle } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { LightModal, Trigger } from "$store/components/ui/LightModal.tsx";
import { useId } from "$store/sdk/useId.ts";
import Filter from "$store/components/search/filter/mobile/Filter.tsx";

interface Props {
  filters: FilterType[];
  url: string;
}

export default function FiltersMobile({ filters, url }: Props) {
  const ID = useId();

  const toggleFilters = filters.filter((filter) =>
    filter["@type"] === "FilterToggle"
  ) as FilterToggle[];

  return (
    <div id="filters-mobile-container" class="flex">
      <Trigger uniqueID={ID} class="flex flex-col justify-between">
        <span>Filtros:</span>
        <div class="flex items-center gap-2.5 p-3 pr-0">
          <Icon id="Filters" width={24} height={24} />
          <Icon
            class="text-primary -rotate-90"
            id="TriangleLeft"
            width={24}
            height={24}
          />
        </div>
      </Trigger>

      <LightModal uniqueID={ID} class="w-[300px] h-full border bg-white">
        <div class="flex flex-col h-full">
          {/* Header */}
          <div class="flex justify-between items-center text-neutral-600 p-6">
            <h5 class="font-secondary font-bold text-2xl">
              Filter
            </h5>
            <Trigger>
              <Icon id="Close" width={24} height={24} />
            </Trigger>
          </div>

          {/* Filters */}
          <div class="flex flex-col gap-px grow overflow-y-auto">
            {toggleFilters.map((filter, index) => {
              // Filter
              return <Filter filter={filter} open={index === 0} />;
            })}
          </div>

          {/* Buttons */}
          <Buttons url={url} />
        </div>
      </LightModal>
    </div>
  );
}

// Island
export function Buttons({ url: urlStr }: Pick<Props, "url">) {
  const handleClear = () => {
    const $inputs = document.querySelectorAll<HTMLInputElement>(
      "#filters-mobile-container [data-filter-key] [data-filter-value]",
    );

    $inputs.forEach(($input) => {
      $input.checked = false;
    });
  };

  const handleApply = () => {
    const url = new URL(urlStr);

    const match = url.pathname.match(/\/([^\/]+)(\/([^\/]+))?/);
    const [, department, , category] = match ?? [, undefined, , undefined];

    if (department) url.searchParams.set("filter.category-1", department);
    if (category) url.searchParams.set("filter.category-2", category);

    const $filters = document.querySelectorAll<HTMLElement>(
      "#filters-mobile-container [data-filter-key]",
    );

    if ($filters.length === 0) return;

    $filters.forEach(($filter) => {
      const key = `filter.${$filter.dataset.filterKey}`;

      // Reset filters for the key
      url.searchParams.delete(key);

      const $values = $filter.querySelectorAll<HTMLElement>(
        "[data-filter-value]:checked",
      );

      $values.forEach(($value) => {
        const value = $value.dataset.filterValue ?? "";

        // Adds one more value for the key
        url.searchParams.append(key, value);
      });
    });

    // Redirect
    globalThis.location.href = url.toString();
  };

  return (
    <div class="flex gap-2 px-4 py-2 text-sm font-bold text-neutral-600 mt-auto">
      <button class="h-12 grow border border-primary-500" onClick={handleClear}>
        Limpar
      </button>
      <button
        class="h-12 grow bg-primary-500 text-primary-content"
        onClick={handleApply}
      >
        Aplicar
      </button>
    </div>
  );
}
