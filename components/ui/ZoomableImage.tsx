import { IS_BROWSER } from "$fresh/runtime.ts";
import { effect, useSignal } from "@preact/signals";
import Image from "apps/website/components/Image.tsx";
import { ComponentProps } from "preact";
import { useRef } from "preact/hooks";

interface ContainerBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ZoomType = "click" | "hover";

interface Props extends ComponentProps<typeof Image> {
  type: ZoomType;
  factor: number;
}

const clamp = (min: number, max: number, value: number) =>
  Math.min(Math.max(value, min), max);

const getBounds = (element?: Element | null): ContainerBounds | null => {
  if (!element) return null;

  const bounds = element.getBoundingClientRect();

  return {
    x: bounds.left,
    y: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
};

const getMousePositionFromEvent = (
  event: MouseEvent,
  bounds?: ContainerBounds | null,
): { x: number; y: number; isOutOfBounds?: boolean } => {
  if (!bounds) {
    return { x: 0, y: 0 };
  }

  const [x, y] = [event.clientX - bounds.x, event.clientY - bounds.y];

  const threshold = 20;
  /* Uses out-of-bounds detection instead of simply a "mouse-out" event
     * to prevent from zooming out when the mouse hovers a button or suchlike */
  const isOutOfBounds = x < -threshold ||
    y < -threshold ||
    x > bounds.width + threshold ||
    y > bounds.height + threshold;

  // Values larger than 0 increase mouse movement sensivity
  const boost = 0.1;

  return {
    x: clamp(0, bounds.width, -bounds.width * boost + x * (1 + boost * 2)),
    y: clamp(0, bounds.height, -bounds.height * boost + y * (1 + boost * 2)),
    isOutOfBounds,
  };
};

function ZoomableImage({ type, factor, ...imageProps }: Props) {
  const isZoomedIn = useSignal(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerBounds = useRef<ContainerBounds | null>(null);

  const setPositionAndScale = (x: number, y: number, scale: number) => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    contentElement.style.transform = `scale(${scale}, ${scale}) translate3d(${
      -x / scale
    }px, ${-y / scale}px, 0)`;
  };

  const getContainerBounds = () =>
    containerBounds.current ?? getBounds(containerRef.current);

  const handleMouseOver = () => {
    isZoomedIn.value = true;
  };

  const handleClick = (event: MouseEvent) => {
    if (!isZoomedIn.value) {
      const mousePosition = getMousePositionFromEvent(
        event,
        getContainerBounds(),
      );

      setPositionAndScale(mousePosition.x, mousePosition.y, factor);
    }

    isZoomedIn.value = !isZoomedIn.value;
  };

  // Resets position when the image is zoomed out
  effect(() => {
    if (!isZoomedIn.value) {
      setPositionAndScale(0, 0, 1);
      containerBounds.current = null;
    }
  });

  // Adds mouse event handlers to the entire document, so that
  // mouse movement is not restricted to just the content element
  const handleClickOutside = (event: MouseEvent) => {
    if (!isZoomedIn.value) {
      return;
    }

    const isDescendant = containerRef.current &&
      event.target &&
      containerRef.current.contains?.(event.target as Node);

    if (isDescendant) {
      return;
    }

    isZoomedIn.value = false;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isZoomedIn.value) {
      return;
    }

    const mousePosition = getMousePositionFromEvent(
      event,
      getContainerBounds(),
    );

    // Uses out-of-bounds detection instead of simply a "mouse-out" event
    // to prevent from zooming out when the mouse hovers a button or suchlike
    if (type === "hover" && mousePosition.isOutOfBounds) {
      isZoomedIn.value = false;
    } else {
      setPositionAndScale(mousePosition.x, mousePosition.y, factor);
    }
  };

  if (IS_BROWSER) {
    document.addEventListener("mousemove", handleMouseMove);
    if (type === "click") {
      document.addEventListener("click", handleClickOutside);
    }
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
    <div
      ref={containerRef}
      onMouseOver={type === "hover" ? handleMouseOver : undefined}
      onClick={type === "click" ? handleClick : undefined}
      class="relative overflow-hidden w-full h-full"
    >
      <div
        ref={contentRef}
        style={{
          transformOrigin: "0 0",
          fontSize: 0,
          // Prevents accidental whitespaces on the content from stretching
          // the container, and consequently the zoomed image
        }}
      >
        <Image data-zoomed={isZoomedIn} {...imageProps} />
      </div>
    </div>
  );
}

export default ZoomableImage;
