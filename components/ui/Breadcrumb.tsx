import type { BreadcrumbList } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  if (items.length === 1) {
    items.push({ name: "Resultados da busca", item: "#" });
  }

  return (
    <ul class="flex items-center gap-2 text-neutral-600 text-sm overflow-x-auto">
      <Icon
        id="Home"
        height={24}
        width={24}
        class="flex-shrink-0"
        title="Home"
      />
      {items
        .filter(({ name, item }) => name && item)
        .map(({ name, item }, index) => (
          <li class="flex items-center gap-2 leading-none last:font-bold">
            {index !== 0 && (
              <Icon
                id="ChevronRight"
                height={24}
                width={24}
                title="Seta direita"
              />
            )}
            <a href={item} class="whitespace-nowrap !font-secondary">{name}</a>
          </li>
        ))}
    </ul>
  );
}

export default Breadcrumb;
