import ReviewsPercentage from "$store/components/product/ProductReview/ReviewsPercentage.tsx";
import Rating from "$store/components/product/Rating.tsx";
import {
  batch,
  ReadonlySignal,
  Signal,
  useComputed,
  useSignal,
} from "@preact/signals";
import type { JSX } from "preact";
import { useId } from "preact/hooks";
import ProductReviewsPagination from "$store/components/product/ProductReview/ProductReviewsPagination.tsx";
import { AverageRating } from "$store/loaders/reviews/productAverageRating.ts";
import Button from "$store/components/ui/Button.tsx";
import { Review } from "apps/commerce/types.ts";
import { Select } from "$store/components/ui/Select.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";
import { REVIEWS_PER_PAGE } from "$store/loaders/reviews/productReviews.ts";

export interface Input {
  label: string;
  name: string;
  placeholder?: string;
  layout: "text" | "textArea" | "stars";
  error?: string;
}

function Input({
  label,
  placeholder,
  layout,
  name,
  loading,
  error,
}: Input & {
  loading: boolean;
}) {
  const id = useId();
  return (
    <div
      class="flex flex-col gap-2 w-full group"
      data-error={error ? "true" : undefined}
    >
      <label htmlFor={id} class="font-bold text-sm">
        {label}
      </label>
      <div class="relative flex h-fit">
        {layout === "textArea" &&
          (
            <textarea
              id={id}
              data-loading={loading ? "true" : undefined}
              class={"font-normal w-full py-3 bg-base h-36 px-4 outline-none text-sm placeholder:text-neutral-400 text-neutral border data-[loading='true']:border-success-500 data-[loading='true']:text-success-500 group-data-[error='true']:border-danger-500"}
              placeholder={placeholder}
              name={name}
              disabled={loading}
            />
          )}
        {layout === "stars" && (
          <div class="rating">
            <input
              type="radio"
              name={name}
              value={1}
              class="mask mask-star"
            />
            <input
              type="radio"
              name={name}
              value={2}
              class="mask mask-star"
            />
            <input
              type="radio"
              name={name}
              value={3}
              class="mask mask-star"
            />
            <input
              type="radio"
              name={name}
              value={4}
              class="mask mask-star"
            />
            <input
              type="radio"
              name={name}
              value={5}
              class="mask mask-star"
            />
          </div>
        )}
        {layout === "text" && (
          <input
            id={id}
            data-loading={loading ? "true" : undefined}
            class={"font-normal w-full bg-base h-12 px-4 outline-none text-sm placeholder:text-neutral-400 text-neutral border data-[loading='true']:border-success-500 data-[loading='true']:text-success-500 group-data-[error='true']:border-danger-500"}
            type="text"
            placeholder={placeholder}
            name={name}
            disabled={loading}
          />
        )}
      </div>
      {error && <span class="text-xs text-danger-500">{error}</span>}
    </div>
  );
}

export interface CreateReviewDTO {
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
}

const NewRatingForm = ({ onCreateReview }: {
  onCreateReview: (review: CreateReviewDTO) => Promise<void>;
}) => {
  const loading = useSignal(false);
  const success = useSignal(false);
  const errors = useSignal<Record<string, string>>({});

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    errors.value = {};

    try {
      const title =
        (e.currentTarget.elements.namedItem("title") as RadioNodeList)
          ?.value;
      const name = (
        e.currentTarget.elements.namedItem("name") as RadioNodeList
      )?.value;
      const text = (
        e.currentTarget.elements.namedItem("text") as RadioNodeList
      )?.value;
      const rating = (
        e.currentTarget.elements.namedItem("rating") as RadioNodeList
      )?.value;

      const newErrors: Record<string, string> = {};

      if (!title) {
        newErrors.title = "Por favor, insira um título";
      }

      if (!name) {
        newErrors.name = "Por favor, insira um nome";
      }

      if (!text) {
        newErrors.text = "Por favor, insira um texto";
      }

      if (!rating) {
        newErrors.rating = "Por favor, insira uma avaliação";
      }

      if (Object.keys(newErrors).length > 0) {
        errors.value = newErrors;

        return;
      }

      loading.value = true;

      await onCreateReview({
        reviewerName: name,
        rating: Number(rating),
        title: title,
        body: text,
      });

      success.value = true;
    } finally {
      loading.value = false;
    }
  };

  if (success.value) {
    return (
      <div class="mt-8 text-center">
        <span class="text-2xl font-secondary">
          Avaliação enviada com sucesso
        </span>
      </div>
    );
  }

  return (
    <form
      className="form-control w-full mt-8 gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        layout="text"
        label="Title"
        name="title"
        loading={loading.value}
        placeholder="Digite o título"
        error={errors.value["title"]}
      />
      <Input
        layout="stars"
        label="Avalie"
        name="rating"
        loading={loading.value}
        error={errors.value["rating"]}
      />
      <Input
        layout="text"
        label="Nome"
        name="name"
        loading={loading.value}
        placeholder="Digite seu nome"
        error={errors.value["name"]}
      />
      <Input
        layout="textArea"
        label="Texto"
        name="text"
        loading={loading.value}
        placeholder="Digite o texto"
        error={errors.value["text"]}
      />
      <Button
        type="submit"
        loading={loading.value}
        class="btn btn-primary text-primary-content"
        ariaLabel="Enviar Avaliação"
      >
        Enviar Avaliação
      </Button>
    </form>
  );
};

interface SelectOption {
  name: string;
  value: string;
}

export interface Props {
  reviews?: Review[];
  ratings?: AverageRating;
  totalReviews?: number;
  totalFilteredReviews?: ReadonlySignal<number | undefined>;
  isMobile: boolean;
  isUserLoggedIn: boolean;
  hasUserReviewed: boolean;
  loading: boolean;
  page: Signal<number>;
  orderBy?: string;
  filter?: string;
  onPageChange: (page: number) => void;
  onOrderByChange?: (orderBy: string) => void;
  onFilterChange?: (filter?: string) => void;
  onCreateReview: (review: CreateReviewDTO) => Promise<void>;
  orderByOptions?: SelectOption[];
  filterOptions?: SelectOption[];
}

function ProductReviews(
  {
    isMobile,
    reviews,
    hasUserReviewed,
    isUserLoggedIn,
    loading,
    page,
    ratings,
    totalReviews,
    totalFilteredReviews,
    onPageChange,
    orderBy,
    orderByOptions,
    onOrderByChange,
    onCreateReview,
    onFilterChange,
    filter,
    filterOptions,
  }: Props,
) {
  const inputReviewSignal = useSignal(false);
  const totalPages = useComputed(() =>
    Math.ceil(
      (totalFilteredReviews?.value ?? 0) / REVIEWS_PER_PAGE,
    )
  );

  if (!reviews || !ratings || loading) {
    return (
      <div class="flex items-center justify-center w-full h-96 mt-2">
        <div class="loading"></div>
      </div>
    );
  }

  return (
    <div
      // isMobile={isMobile}
      class="w-full px-auto flex flex-col justify-center mb-5 container mx-auto gap-5"
      id="reviewsInfo"
    >
      <Header title={"Avaliações do Produto"} />

      <div class="w-full">
        <div class="gap-2 lg:gap-6 flex justify-between items-center lg:items-start flex-col lg:flex-row">
          <div class="mb-6 w-full lg:max-w-lg">
            <div className="rating">
              <Rating
                rating={ratings.average ?? 0}
              />
            </div>
            <div class="mb-6">
              <span class="text-xs">
                <strong class="font-bold">
                  Avaliação Média: {ratings.average.toFixed(2)}{" "}
                  ({totalReviews ?? 0}
                  {" "}
                </strong>
                {(totalReviews ?? 0) === 1 ? "avaliação" : "avaliações"}
                )
              </span>
            </div>
            <div class="mb-4">
              <ReviewsPercentage
                starsFive={ratings.starsFive ?? 0}
                starsFour={ratings.starsFour ?? 0}
                starsThree={ratings.starsThree ?? 0}
                starsTwo={ratings.starsTwo ?? 0}
                starsOne={ratings.starsOne ?? 0}
                total={totalReviews ?? 0}
              />
            </div>
            {!isUserLoggedIn
              ? (
                <a
                  href={`/conta`}
                  class="text-xs font-bold underline text-primary-400"
                >
                  Por favor, inscreva-se para escrever uma avaliação.
                </a>
              )
              : (
                <div class="text-left mt-4">
                  <div className="collapse bg-base-100 rounded-none shadow-none font-semibold text-base p-0">
                    <input
                      type="checkbox"
                      className="peer min-h-[0]"
                      onInput={() => (inputReviewSignal.value =
                        !inputReviewSignal.value)}
                    />
                    <div className="collapse-title !h-14 font-bold w-80 text-primary flex items-center justify-between cursor-pointer">
                      Escrever uma avaliação
                      <em class="not-italic">
                        {inputReviewSignal.value ? "-" : "+"}
                      </em>
                    </div>
                    <div className="collapse-content !px-0 transition">
                      {hasUserReviewed
                        ? (
                          <div>
                            <span>
                              Você já enviou uma avaliação para este produto
                            </span>
                          </div>
                        )
                        : <NewRatingForm onCreateReview={onCreateReview} />}
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div class="w-full lg:w-3/5 ">
            <div class="mb-6 flex gap-4 bg-neutral-200 p-2">
              {onOrderByChange && orderByOptions?.length && (
                <Select
                  class="relative flex-[1.125] max-w-[12rem] border border-neutral-600 bg-neutral-100"
                  defaultValue={orderByOptions?.find((option) =>
                    option.value == orderBy
                  )?.name ?? ""}
                  onChange={(e) => {
                    batch(() => {
                      page.value = 1;
                      onOrderByChange(
                        e.currentTarget.value,
                      );
                    });
                  }}
                  options={orderByOptions}
                />
              )}
              {onFilterChange && filterOptions?.length && (
                <Select
                  class="relative flex-[1.125] max-w-[12rem] border border-neutral-600 bg-neutral-100"
                  defaultValue={filterOptions?.find((option) =>
                    option.value == filter
                  )?.name ?? ""}
                  onChange={(e) => {
                    batch(() => {
                      page.value = 1;
                      onFilterChange(
                        e.currentTarget.value,
                      );
                    });
                  }}
                  options={filterOptions}
                />
              )}
            </div>
            {reviews.length
              ? (
                <div class="flex flex-col ">
                  <div class="flex flex-col max-h-[300px] lg:max-h-[500px] overflow-y-auto">
                    {reviews.map((review) => {
                      return (
                        <div class="border-b border-neutral-200 py-4 last:border-none">
                          <div class="flex items-center mb-2">
                            <div className="rating rating-md">
                              <Rating
                                rating={review.reviewRating?.ratingValue ?? 0}
                              />
                            </div>
                            {review.reviewHeadline && (
                              <span class="text-neutral-700 font-bold ml-2">
                                {review.reviewHeadline}
                              </span>
                            )}
                          </div>
                          <div>
                            <span class="text-xs text-neutral-700">
                              Enviado em{"   "}
                              <span class="font-bold">
                                {new Date(review.datePublished ?? 0)
                                  .toLocaleString(
                                    "pt-BR",
                                    {
                                      day: "numeric",
                                      year: "numeric",
                                      month: "numeric",
                                    },
                                  )}
                              </span>{"  "}
                              por{" "}
                              <span class="font-bold">
                                {review.author?.[0]?.name ?? "Anônimo"}
                              </span>
                            </span>
                          </div>
                          <div class="mt-2">
                            <span class="text-sm text-neutral-700">
                              {review.reviewBody}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div class="ml-auto mt-4">
                    <ProductReviewsPagination
                      currentPage={page}
                      onCurrentPageChange={(newPage) => {
                        onPageChange(newPage);
                        globalThis.window.scrollTo({
                          top:
                            ((globalThis.document.getElementById("reviewsInfo")
                              ?.getBoundingClientRect().top ?? 0) +
                              globalThis.window.scrollY) -
                            (isMobile ? 100 : 200),
                          behavior: "smooth",
                        });
                      }}
                      totalPages={totalPages}
                    />
                  </div>
                </div>
              )
              : (
                <div class="text-center">
                  <h2 class="text-2xl font-bold">Nenhuma Avaliação</h2>
                  <span>Seja o primeiro a avaliar este produto</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductReviews;
