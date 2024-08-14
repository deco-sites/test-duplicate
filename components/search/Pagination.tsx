import Icon from "$store/components/ui/Icon.tsx";
import type { PageInfo } from "apps/commerce/types.ts";

interface Props {
  pageInfo: PageInfo;
  url: string;
}

interface PrevNextProps {
  value: number;
  currentURL: string;
}

interface PageNumberProps {
  value: number;
  current: boolean;
  currentURL: string;
}

export default function Pagination({ pageInfo, url }: Props) {
  const { currentPage, recordPerPage, records } = pageInfo;

  if (!recordPerPage || !records) return null;

  const lastPage = Math.ceil(records / recordPerPage); // also 'page quantity'

  const pageInterval = createPageInterval(currentPage, lastPage);

  if (lastPage === 1) return null;

  return (
    <div class="flex justify-center items-center text-black max-lg:gap-x-1">
      {/* Previous */}
      {pageInfo.previousPage && (
        <PreviousPage value={currentPage - 1} currentURL={url} />
      )}

      {/* Numbers */}
      {pageInterval.map((pageNumber) => {
        return (
          <PageNumber
            value={pageNumber}
            current={currentPage === pageNumber}
            currentURL={url}
          />
        );
      })}

      {/* Next */}
      {pageInfo.nextPage && (
        <NextPage value={currentPage + 1} currentURL={url} />
      )}
    </div>
  );
}

function PreviousPage({ value, currentURL }: PrevNextProps) {
  const urlObj = new URL(currentURL);
  urlObj.searchParams.set("page", String(value));
  const url = urlObj.toString();

  return (
    <a
      aria-label="Go to previus page"
      rel="prev"
      href={url}
      class="flex justify-center items-center px-3"
    >
      <Icon
        class=""
        id="ChevronLeft"
        width={24}
        height={24}
      />
      <span class="hidden md:inline">Anterior</span>
    </a>
  );
}

function NextPage({ value, currentURL }: PrevNextProps) {
  const urlObj = new URL(currentURL);
  urlObj.searchParams.set("page", String(value));
  const url = urlObj.toString();

  return (
    <a
      aria-label="next page link"
      rel="next"
      href={url}
      class="flex justify-center items-center px-3"
    >
      <span class="hidden md:inline">Próximo</span>{" "}
      <Icon id="ChevronRight" class="" width={24} height={24} />
    </a>
  );
}

function PageNumber({ value, current, currentURL }: PageNumberProps) {
  const urlObj = new URL(currentURL);
  urlObj.searchParams.set("page", String(value));
  const url = urlObj.toString();

  return (
    <a
      aria-label={`Go to page ${value}`}
      href={url}
      data-current={current ? "" : undefined}
      class="flex justify-center items-center w-12 h-12 text-sm text-neutral-400 font-bold hover:border-t hover:border-neutral-400 data-[current]:text-primary-500 data-[current]:border-t data-[current]:!border-primary-500 border-primary-500"
    >
      {value}
    </a>
  );
}

// Math bitch!!!
function createPageInterval(currentPage: number, lastPage: number) {
  const PG_QTD = 5;
  const OFFSET = Math.ceil((PG_QTD - 1) / 2);

  const possibleInitPage = Math.min(
    currentPage - OFFSET,
    lastPage - PG_QTD + 1,
  );
  const initPage = Math.max(1, possibleInitPage);

  const possibleEndPage = initPage + PG_QTD - 1;
  const endPage = Math.min(lastPage, possibleEndPage);

  const pageInterval = [];
  for (let i = initPage; i <= endPage; i++) pageInterval.push(i);

  return pageInterval;
}
