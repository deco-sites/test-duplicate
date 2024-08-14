import BaseProductReviews, { CreateReviewDTO } from "./common.tsx";
import { useUser } from "apps/vtex/hooks/useUser.ts";
import { useSignal, useSignalEffect } from "@preact/signals";
import { ReviewsAndRatingsOrder } from "deco-sites/fast-fashion/loaders/reviews/productReviews.ts";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";
import { Review } from "apps/commerce/types.ts";
import { AverageRating } from "deco-sites/fast-fashion/loaders/reviews/productAverageRating.ts";

export interface Props {
  productGroupID: string;
  isMobile: boolean;
}

const createRating = invoke.site.actions.createReview;
const { productReviews, productAverageRating, hasShopperReviewedProduct } =
  invoke.site.loaders.reviews;

export default function VtexProductReviews(
  { productGroupID, isMobile }: Props,
) {
  const loading = useSignal(true);
  const page = useSignal(1);
  const rating = useSignal<number | undefined>(undefined);
  const order = useSignal<ReviewsAndRatingsOrder | undefined>(undefined);
  const hasUserReviewed = useSignal(false);
  const reviews = useSignal<Review[] | undefined>(
    undefined,
  );
  const totalReviews = useSignal<number | undefined>(
    undefined,
  );
  const totalFilteredReviews = useSignal<number | undefined>(
    undefined,
  );
  const ratings = useSignal<AverageRating | undefined>(undefined);

  useSignalEffect(() => {
    loading.value = true;
    if (!reviews.peek()) {
      Promise.all([
        productReviews({
          productGroupID: productGroupID,
          page: page.value,
          rating: rating.value,
          orderBy: order.value,
        }),
        productAverageRating({
          productGroupID: productGroupID,
          stars: true,
        }),
        hasShopperReviewedProduct({
          productGroupID: productGroupID,
        }),
      ]).then(
        (
          [
            reviewsData,
            averageRatingsData,
            hasShopperReviewedData,
          ],
        ) => {
          reviewsData && (reviews.value = reviewsData.reviews);
          reviewsData &&
            (totalReviews.value = reviewsData.range?.total);
          reviewsData &&
            (totalFilteredReviews.value = reviewsData.range?.total);
          averageRatingsData && (ratings.value = averageRatingsData);
          hasUserReviewed.value = hasShopperReviewedData;
          loading.value = false;
        },
      );
    } else {
      productReviews({
        productGroupID: productGroupID,
        page: page.value,
        rating: rating.value,
        orderBy: order.value,
      }).then(
        (
          reviewsData,
        ) => {
          reviewsData &&
            (totalFilteredReviews.value = reviewsData.range?.total);
          reviewsData && (reviews.value = reviewsData.reviews);
          loading.value = false;
        },
      );
    }
  });

  const { user } = useUser();
  const isUserLoggedIn = Boolean(user.value?.email);

  const handleCreateReview = async (review: CreateReviewDTO) => {
    await createRating({
      productId: productGroupID,
      rating: review.rating,
      title: review.title,
      text: review.body,
    });
  };

  const handlePageChange = (newPage: number) => {
    page.value = newPage;
  };

  return (
    <BaseProductReviews
      isMobile={isMobile}
      loading={loading.value}
      reviews={reviews.value}
      ratings={ratings.value}
      hasUserReviewed={hasUserReviewed.value}
      isUserLoggedIn={isUserLoggedIn}
      page={page}
      totalReviews={totalReviews.value}
      totalFilteredReviews={totalFilteredReviews}
      onCreateReview={handleCreateReview}
      onPageChange={handlePageChange}
      orderBy={order.value ?? "SearchDate:desc"}
      orderByOptions={[
        { value: "SearchDate:asc", name: "Mais Antigas" },
        { value: "SearchDate:desc", name: "Mais Recentes" },
        { value: "Rating:asc", name: "Mais baixa" },
        { value: "Rating:desc", name: "Mais alta" },
      ]}
      onOrderByChange={(v) => order.value = v as ReviewsAndRatingsOrder}
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
