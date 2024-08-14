import { HTMLAttributes } from "https://esm.sh/v128/preact@10.19.6/compat/src/index.js";

interface Props extends HTMLAttributes<HTMLIFrameElement> {
  src: string;
}

export const getYouTubeVideoId = (url: string) => {
  if (url.includes("watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId;
  }

  if (url.includes("shorts")) {
    const videoId = url.split("shorts/")[1];
    return videoId;
  }
};

const convertToEmbeddedUrl = (url: string) => {
  if (url.includes("embed")) return url;

  if (url.includes("watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("shorts")) {
    const videoId = url.split("shorts/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
};

export default function Video({ src, ...rest }: Props) {
  const isYouTubeVideo = src.includes("youtube.com") ||
    src.includes("youtu.be");

  if (isYouTubeVideo) {
    src = convertToEmbeddedUrl(src) || src;
  }

  return (
    <iframe
      {...rest}
      class="product-aspect"
      src={src}
    />
  );
}
