import { useSignal, useSignalEffect } from "@preact/signals";
import { invoke } from "$store/runtime.ts";
import Rating from "$store/components/product/Rating.tsx";

export interface Props {
  productGroupID: string;
}

function ProductCardRatings({ productGroupID }: Props) {
  const average = useSignal<number | undefined>(undefined);

  useSignalEffect(() => {
    // fetch average rating
    // if (typeof average.value === "undefined") {
    invoke.site.loaders.reviews.productAverageRating({
      productGroupID,
    }).then((data) => {
      average.value = data?.average ?? undefined;
    });
    // }
  });

  if (typeof average.value === "undefined") {
    return <div class="h-[18px]" />;
  }

  return <Rating rating={average.value} />;
}

export default ProductCardRatings;
