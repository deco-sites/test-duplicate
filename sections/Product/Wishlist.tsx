import {
  default as Component,
  Props,
} from "$store/components/wishlist/WishlistGallery.tsx";

/**
 * @title Galeria de Favoritos
 */
export default function Section(props: Props) {
  return <Component {...props} />;
}

export function LoadingFallback() {
  return (
    <div style={{ height: "716px" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
