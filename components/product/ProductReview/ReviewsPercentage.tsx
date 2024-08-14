export interface ReviewsPercentageProps {
  starsFive: number;
  starsFour: number;
  starsThree: number;
  starsTwo: number;
  starsOne: number;
  total: number;
}

function ReviewsPercentage({
  starsFive = 0,
  starsFour = 0,
  starsThree = 0,
  starsTwo = 0,
  starsOne = 0,
  total,
}: ReviewsPercentageProps) {
  const dataReview = {
    1: { quantity: starsOne },
    2: { quantity: starsTwo },
    3: { quantity: starsThree },
    4: { quantity: starsFour },
    5: { quantity: starsFive },
  } as Record<number, { quantity: number }>;

  return (
    <div class="">
      {Array.from([0, 1, 2, 3, 4]).map((_i, index) => {
        const percentageInfo = dataReview[index + 1];
        const widthPercentage = percentageInfo
          ? `${
            (
              ((percentageInfo?.quantity ?? 0) /
                Math.max(total, 1)) *
              100
            ).toFixed(2)
          }%`
          : "0%";

        return (
          <div class="flex items-center mb-2">
            <span class="w-16 text-xs text-neutral-700 shrink-0">
              {index + 1} Estrela{index + 1 === 1 ? "" : "s"}
            </span>
            <div class="w-[70%] lg:w-[736px] mx-3 relative ">
              <span class="w-full h-[5px] flex bg-neutral-200"></span>
              <span
                style={{ width: widthPercentage }}
                class={`h-[5px] flex bg-primary-400 absolute top-0 left-0`}
              >
              </span>
            </div>
            <span class="w-9 text-xs text-neutral-700 shrink-0 text-end">
              {widthPercentage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewsPercentage;
