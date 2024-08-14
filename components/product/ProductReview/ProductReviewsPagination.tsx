import Icon from "$store/components/ui/Icon.tsx";
import { ReadonlySignal, Signal, useComputed } from "@preact/signals";

export interface PaginationProps {
  currentPage: Signal<number>;
  totalPages: ReadonlySignal<number>;
  onCurrentPageChange: (page: number) => void;
}

export interface PageButtonProps {
  isCurrentPage: boolean;
  page: number;
  onCurrentPageChange: (page: number) => void;
}

const PAGES_TO_SHOW = 4;

const PaginationSpacer = () => (
  <span class="size-[15px] flex items-center justify-center">
    ...
  </span>
);

const PageButton = ({ page, isCurrentPage, onCurrentPageChange }) => (
  <button
    type="button"
    onClick={() => onCurrentPageChange(page)}
    class="flex items-center justify-center size-[30px] rounded-full text-neutral-700 text-sm aria-disabled:bg-secondary-400 aria-disabled:text-neutral-100 aria-disabled:font-semibold transition-all hover:bg-secondary-100"
    aria-disabled={isCurrentPage}
  >
    {String(page).padStart(2, "0")}
  </button>
);

const ProductReviewsPagination = (
  { currentPage, totalPages, onCurrentPageChange }: PaginationProps,
) => {
  const pages = useComputed(() => {
    const arr: number[] = [];
    const middlePage = Math.ceil(PAGES_TO_SHOW / 2);

    let startPage = Math.max(currentPage.value - middlePage + 1, 1);
    const endPage = Math.min(startPage + PAGES_TO_SHOW - 1, totalPages.value);

    if (endPage - startPage + 1 < PAGES_TO_SHOW) {
      startPage = Math.max(endPage - PAGES_TO_SHOW + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      arr.push(i);
    }

    return arr;
  });

  return (
    <div class="flex items-center gap-2">
      <button
        type="button"
        onClick={() =>
          currentPage.value > 1 && onCurrentPageChange(currentPage.value - 1)}
        class="flex items-center justify-center size-[30px] text-neutral-700 aria-disabled:pointer-events-none aria-disabled:text-neutral-400"
        aria-disabled={currentPage.value === 1}
      >
        <Icon id="ChevronLeft" size={12} />
      </button>
      <div class="flex items-center gap-4">
        {pages.value[0] > 1 && (
          <PageButton
            isCurrentPage={currentPage.value === 1}
            onCurrentPageChange={onCurrentPageChange}
            page={1}
          />
        )}
        {pages.value[0] > 2 &&
          <PaginationSpacer />}
        {pages.value.map((page) => (
          <PageButton
            isCurrentPage={currentPage.value === page}
            onCurrentPageChange={onCurrentPageChange}
            page={page}
          />
        ))}
        {totalPages.value - 1 > pages.value.at(-1) &&
          <PaginationSpacer />}
        {totalPages.value != pages.value.at(-1) && (
          <PageButton
            isCurrentPage={currentPage.value === totalPages.value}
            onCurrentPageChange={onCurrentPageChange}
            page={totalPages.value}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() =>
          currentPage.value < totalPages.value &&
          onCurrentPageChange(currentPage.value + 1)}
        class="flex items-center justify-center size-[30px] text-neutral-700 aria-disabled:pointer-events-none aria-disabled:text-neutral-400"
        aria-disabled={currentPage.value === totalPages.value}
      >
        <Icon id="ChevronRight" size={12} />
      </button>
    </div>
  );
};

export default ProductReviewsPagination;
