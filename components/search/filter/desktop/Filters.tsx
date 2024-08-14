import { FilterToggle } from "apps/commerce/types.ts";
import Filter from "$store/components/search/filter/desktop/Filter.tsx";

interface Props {
  filters: FilterToggle[];
  url: string;
}

export default function Filters({ filters }: Props) {
  return (
    <div class="flex flex-col gap-4 w-[300px] mt-4">
      {filters.map((filter, index) => (
        <Filter filter={filter} open={index === 0} />
      ))}
    </div>
  );
}
