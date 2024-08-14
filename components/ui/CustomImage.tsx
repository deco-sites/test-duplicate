import { Head } from "$fresh/runtime.ts";
import type { JSX } from "preact";
import { forwardRef } from "preact/compat";
import { Manifest } from "apps/website/manifest.gen.ts";

export const PATH: `/live/invoke/${keyof Manifest["loaders"]}` =
  "/live/invoke/website/loaders/image.ts";

export type Props =
  & Omit<
    JSX.IntrinsicElements["img"],
    "width" | "height" | "preload"
  >
  & {
    src: string;
    /** @description Improves Web Vitals (CLS|LCP) */
    width: number;
    /** @description Improves Web Vitals (CLS|LCP) */
    height?: number;
    /** @description Web Vitals (LCP). Adds a link[rel="preload"] tag in head. Use one preload per page for better performance */
    preload?: boolean;
    /** @description Improves Web Vitals (LCP). Use high for LCP image. Auto for other images */
    fetchPriority?: "high" | "low" | "auto";
    /** @description Object-fit */
    fit?: FitOptions;

    factors?: number[];
  };

const FACTORS = [1, 2];

export type FitOptions = "contain" | "cover";

export const getOptimizedMediaUrl = ({
  originalSrc,
  width,
  height,
  factor,
  fit = "cover",
}: {
  originalSrc: string;
  width: number;
  height?: number;
  factor: number;
  fit?: FitOptions;
}) => {
  if (originalSrc.startsWith("data:")) return originalSrc;

  const params = new URLSearchParams();

  params.set("src", originalSrc);
  params.set("fit", fit);
  params.set("width", `${Math.trunc(factor * width)}`);
  height && params.set("height", `${Math.trunc(factor * height)}`);

  return `${PATH}?${params}`;
};

export const getSrcSet = (
  src: string,
  width: number,
  height?: number,
  fit?: FitOptions,
  factors?: number[],
) => {
  const factorsToUse = factors ?? FACTORS;

  if (factorsToUse.length <= 1) {
    return getOptimizedMediaUrl({
      originalSrc: src,
      width,
      height,
      factor: factorsToUse[0] ?? 1,
      fit,
    });
  }

  return (factors ?? FACTORS).map(
    (factor) =>
      `${
        getOptimizedMediaUrl({
          originalSrc: src,
          width,
          height,
          factor,
          fit,
        })
      } ${Math.trunc(factor * width)}w`,
  ).join(", ");
};

const CustomImage = forwardRef<HTMLImageElement, Props>((props, ref) => {
  const { preload, loading = "lazy" } = props;

  if (!props.height) {
    console.warn(
      `Missing height. This image will NOT be optimized: ${props.src}`,
    );
  }

  const srcSet = getSrcSet(
    props.src,
    props.width,
    props.height,
    props.fit,
    props.factors,
  );

  const isSingleFactor = (props.factors ?? FACTORS).length <= 1;

  const linkProps = {
    imagesrcset: isSingleFactor ? undefined : srcSet,
    imagesizes: props.sizes,
    fetchpriority: props.fetchPriority,
    media: props.media,
  };

  return (
    <>
      {preload && (
        <Head>
          <link as="image" rel="preload" href={props.src} {...linkProps} />
        </Head>
      )}
      <img
        {...props}
        data-fresh-disable-lock={true}
        preload={undefined}
        src={isSingleFactor ? srcSet : props.src}
        srcSet={isSingleFactor ? undefined : srcSet}
        loading={loading}
        ref={ref}
      />
    </>
  );
});

export default CustomImage;
