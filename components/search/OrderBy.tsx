import Icon from "$store/components/ui/Icon.tsx";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";

const OPTIONS = [
  {
    label: "Relevância",
    value: "relevance:desc",
  },
  {
    label: "Mais recentes",
    value: "release:desc",
  },
  {
    label: "Mais vendidos",
    value: "orders:desc",
  },
  {
    label: "Maior Preço",
    value: "price:desc",
  },
  {
    label: "Menor Preço",
    value: "price:asc",
  },
  {
    label: "Maior desconto",
    value: "discount:desc",
  },
  {
    label: "A - Z",
    value: "name:asc",
  },
  {
    label: "Z - A",
    value: "name:desc",
  },
];

export interface Props {
  url: string;
}

export default function OrderBy({ url: urlStr }: Props) {
  const url = new URL(urlStr);

  const sortValue = url.searchParams.get("sort");
  const foundOption = OPTIONS.find((option) => option.value === sortValue) ??
    OPTIONS[0];

  return (
    <>
      <details id="order-by" class="group/order-by relative">
        <summary class="flex flex-col justify-between cursor-pointer max-lg:h-20 lg:flex-row lg:items-center lg:gap-4">
          Ordenar por:{" "}
          <span class="flex items-center gap-5 p-3 pl-0">
            <span class="text-neutral-600 text-sm font-bold">
              {foundOption.label}
            </span>

            <Icon
              class="group-open/order-by:rotate-180 transition"
              id="ArrowBreadcrumb"
              height={24}
              width={24}
            />
          </span>
        </summary>

        <ul class="w-max flex flex-col gap-4 absolute z-20 bg-neutral-200 p-4 max-md:left-0 md:right-0">
          {OPTIONS.map(({ value, label }) => {
            url.searchParams.set("sort", value);

            return (
              <li class="text-sm text-neutral-600 hover:underline">
                <a href={url.toString()}>{label}</a>
              </li>
            );
          })}
        </ul>
      </details>

      <script
        defer
        src={scriptAsDataURI(() => {
          const details = document.querySelector<HTMLDetailsElement>(
            "#order-by",
          );

          details?.addEventListener(
            "mouseleave",
            () => details!.open = false,
          );
        })}
      />
    </>
  );
}
