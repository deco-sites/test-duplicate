import Icon from "$store/components/ui/Icon.tsx";

type Props = {
  rating: number;
  size?: number;
};

function Rating({ rating, size = 16 }: Props) {
  return (
    <div class="flex gap-[1px]">
      {new Array(5).fill(null).map((_, index) => {
        const startIconId = rating > index && rating < index + 1
          ? "HalfStar"
          : index + 1 <= rating
          ? "FilledStar"
          : "OutlineStar";

        return (
          <Icon
            id={startIconId}
            class="text-primary"
            title={`${rating} de 5 estrelas`}
            size={size}
          />
        );
      })}
    </div>
  );
}

export default Rating;
