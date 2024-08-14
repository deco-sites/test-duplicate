import BaseProductReviews, { CreateReviewDTO } from "./common.tsx";
import { useComputed, useSignal } from "@preact/signals";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";
import { Review } from "apps/commerce/types.ts";
import { AverageRating } from "deco-sites/fast-fashion/loaders/reviews/productAverageRating.ts";
import { useUser } from "apps/wake/hooks/useUser.ts";
import { REVIEWS_PER_PAGE } from "deco-sites/fast-fashion/loaders/reviews/productReviews.ts";

export interface Props {
  productID: string;
  reviews: Review[];
  isMobile: boolean;
}

type SortOption =
  | "lastRecent"
  | "mostRecent"
  | "smaller"
  | "greater";

const createRating = invoke.wake.actions.review.create;

export default function WakeProductReviews(
  { productID, isMobile, reviews: rawReviews }: Props,
) {
  const page = useSignal(1);
  const rating = useSignal<number | undefined>(undefined);
  const order = useSignal<SortOption>("mostRecent");
  const hasUserReviewed = useSignal(false);
  const reviews = useComputed(
    () => {
      const sorts: Record<string, (a: Review, b: Review) => number> = {
        mostRecent: (a: Review, b: Review) =>
          b.datePublished && a.datePublished
            ? new Date(b.datePublished).valueOf() -
              new Date(a.datePublished).valueOf()
            : 0,
        lastRecent: (a: Review, b: Review) =>
          b.datePublished && a.datePublished
            ? new Date(a.datePublished).valueOf() -
              new Date(b.datePublished).valueOf()
            : 0,
        greater: (a: Review, b: Review) =>
          (b.reviewRating?.ratingValue ?? 0) -
          (a.reviewRating?.ratingValue ?? 0),
        smaller: (a: Review, b: Review) =>
          (a.reviewRating?.ratingValue ?? 0) -
          (b.reviewRating?.ratingValue ?? 0),
      };
      return rawReviews.sort(sorts[order.value]).filter((review) =>
        (rating.value && review.reviewRating)
          ? review.reviewRating.ratingValue === rating.value
          : true
      );
    },
  );
  const currentReviews = useComputed(
    () => {
      const start = (page.value - 1) * REVIEWS_PER_PAGE;
      return reviews.value?.slice(
        start,
        start + REVIEWS_PER_PAGE,
      );
    },
  );

  const totalReviews = rawReviews.length;

  const totalFilteredReviews = useComputed(() => reviews.value?.length ?? 0);

  const ratings = useComputed<AverageRating>(() => {
    return rawReviews.reduce(
      (acc, review) => {
        if (review.reviewRating) {
          acc.total += review.reviewRating.ratingValue ?? 1;
          acc.count += 1;
          acc.average = acc.total / acc.count;
          switch (review.reviewRating.ratingValue) {
            case 1:
              acc.starsOne += 1;
              break;
            case 2:
              acc.starsTwo += 1;
              break;
            case 3:
              acc.starsThree += 1;
              break;
            case 4:
              acc.starsFour += 1;
              break;
            case 5:
              acc.starsFive += 1;
              break;
          }
        }
        return acc;
      },
      {
        total: 0,
        count: 0,
        average: 0,
        starsOne: 0,
        starsTwo: 0,
        starsThree: 0,
        starsFour: 0,
        starsFive: 0,
      },
    );
  });

  const { user } = useUser();
  const isUserLoggedIn = Boolean(user.value?.email);

  const handleCreateReview = async (review: CreateReviewDTO) => {
    await createRating({
      productVariantId: Number(productID),
      rating: review.rating,
      email: user.value?.email,
      name: review.reviewerName,
      review: review.body,
    });
  };

  const handlePageChange = (newPage: number) => {
    page.value = newPage;
  };

  return (
    <BaseProductReviews
      isMobile={isMobile}
      loading={false}
      reviews={currentReviews.value}
      ratings={ratings.value}
      hasUserReviewed={hasUserReviewed.value}
      isUserLoggedIn={isUserLoggedIn}
      page={page}
      totalReviews={totalReviews}
      totalFilteredReviews={totalFilteredReviews}
      onCreateReview={handleCreateReview}
      onPageChange={handlePageChange}
      orderBy={order.value ?? "SearchDate:desc"}
      orderByOptions={[
        { value: "lastRecent", name: "Mais Antigas" },
        { value: "mostRecent", name: "Mais Recentes" },
        { value: "smaller", name: "Mais baixa" },
        { value: "greater", name: "Mais alta" },
      ]}
      onOrderByChange={(v) => order.value = v as SortOption}
      filter={String(rating.value ?? "")}
      onFilterChange={(v) => rating.value = v ? Number(v) : undefined}
      filterOptions={[
        { value: "", name: "Todas" },
        { value: "1", name: "1 Estrelas" },
        { value: "2", name: "2 Estrelas" },
        { value: "3", name: "3 Estrelas" },
        { value: "4", name: "4 Estrelas" },
        { value: "5", name: "5 Estrelas" },
      ]}
    />
  );
}
