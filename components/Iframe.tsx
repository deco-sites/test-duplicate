import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/compat";

export interface Props {
  /**
   * @format URL
   */
  src: string;
  /**
   * @description Uses the current window query params in the iframe src
   */
  useQueryParams?: boolean;
  width?: number;
  height?: number;
}

export default function Iframe(
  { src, height: initialHeight, width, useQueryParams }: Props,
) {
  if (!IS_BROWSER) return null;

  const ref = useRef<HTMLIFrameElement>(null);
  const height = useSignal(initialHeight || "100%");
  const loading = useSignal(true);
  const interval = useRef<Timer | null>(null);
  const url = new URL(src, window.location.origin);

  if (useQueryParams) {
    const windowUrl = new URL(window.location.href, "https://exemple.com");
    windowUrl.searchParams.forEach((key, value) => {
      url.searchParams.set(key, value);
    });
  }

  useEffect(() => {
    const resizeIframe = () => {
      if (interval.current) clearInterval(interval.current);

      interval.current = setInterval(() => {
        height.value = ref.current?.contentWindow?.document.body.scrollHeight ||
          "100%";
      }, 500);
    };

    const handleIframePathChange = (newPath: string) => {
      console.log("newPath", newPath);
      if (newPath === "/") {
        ref.current?.contentWindow?.document.body.classList.add("hidden");
        console.log("redirecting to /");
        globalThis.location.href = "/";
      }

      if (newPath?.includes("checkout")) {
        ref.current?.contentWindow?.document.body.classList.add("hidden");
        console.log("redirecting to checkout");
        globalThis.location.href = newPath;
      }
    };

    const handleLoad = () => {
      resizeIframe();
      loading.value = false;
      const iframePathname = ref.current?.contentWindow?.location.pathname;

      if (iframePathname) {
        handleIframePathChange(iframePathname);
      }
    };

    const handleNavigation = (e: Event & { destination: { url: string } }) => {
      const url = new URL(e.destination?.url);

      handleIframePathChange(url.pathname);
    };

    if (ref.current && ref.current.contentWindow) {
      ref.current.addEventListener("load", handleLoad);
      ref.current.contentWindow.addEventListener("resize", resizeIframe);
      // @ts-expect-error navigation is not a property of contentWindow
      ref.current.contentWindow.navigation?.addEventListener(
        "navigate",
        handleNavigation,
      );
    }

    return () => {
      ref.current?.removeEventListener("load", handleLoad);
      ref.current?.contentWindow?.removeEventListener("resize", resizeIframe);
      // @ts-expect-error navigation is not a property of contentWindow
      ref.current?.contentWindow?.navigation?.removeEventListener(
        "navigate",
        handleNavigation,
      );
    };
  }, []);

  return (
    <div class="relative">
      {loading.value && (
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  flex justify-center items-center">
          <span class="loading loading-spinner" />
        </div>
      )}
      <iframe
        style="border: none;"
        width={width || "100%"}
        height={height.value}
        title="Iframe"
        src={url.toString()}
        loading="lazy"
        frameBorder={0}
        allowFullScreen={true}
        ref={ref}
      />
    </div>
  );
}
