import { useEffect } from "preact/hooks";

export interface Props {
  rootId: string;
  scroll?: "smooth" | "auto";
  interval?: number;
  infinite?: boolean;
}

const ATTRIBUTES = {
  "data-slider": "data-slider",
  "data-slider-item": "data-slider-item",
  'data-slide="prev"': 'data-slide="prev"',
  'data-slide="next"': 'data-slide="next"',
  "data-dot": "data-dot",
  "data-thumbs": "data-thumbs",
  "data-thumb-item": "data-thumb-item",
  'data-thumb="prev"': 'data-thumb="prev"',
  'data-thumb="next"': 'data-thumb="next"',
};

// Percentage of the item that has to be inside the container
// for it it be considered as inside the container
const THRESHOLD = 0.6;

const intersectionX = (element: DOMRect, container: DOMRect): number => {
  const delta = container.width / 1_000;

  if (element.right < container.left - delta) {
    return 0.0;
  }

  if (element.left > container.right + delta) {
    return 0.0;
  }

  if (element.left < container.left - delta) {
    return element.right - container.left + delta;
  }

  if (element.right > container.right + delta) {
    return container.right - element.left + delta;
  }

  return element.width;
};

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number,
) {
  let timer: Timer;

  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

const intersectionY = (element?: DOMRect, container?: DOMRect): number => {
  if (!element || !container) {
    return 0.0;
  }

  const delta = container.height / 1_000;

  if (element.bottom < container.top - delta) {
    return 0.0;
  }

  if (element.top > container.bottom + delta) {
    return 0.0;
  }

  if (element.top < container.top - delta) {
    return element.bottom - container.top + delta;
  }

  if (element.bottom > container.bottom + delta) {
    return container.bottom - element.top + delta;
  }

  return element.height;
};

export const getElementsInsideContainer = (
  slider: Element,
  items: NodeListOf<Element> | HTMLCollection,
  axys: "x" | "y",
) => {
  const indices: number[] = [];
  const sliderRect = slider.getBoundingClientRect();

  for (let index = 0; index < items.length; index++) {
    const item = items.item(index);
    if (!item) {
      continue;
    }
    const rect = item.getBoundingClientRect();

    const ratio = axys === "y"
      ? intersectionY(rect, sliderRect) / rect.height
      : intersectionX(rect, sliderRect) / rect.width;

    if (ratio > THRESHOLD) {
      indices.push(index);
    }
  }

  return indices;
};

// as any are ok in typeguard functions
const isHTMLElement = (x: Element): x is HTMLElement =>
  // deno-lint-ignore no-explicit-any
  typeof (x as any).offsetLeft === "number";

const setup = ({ rootId, scroll, interval, infinite }: Props) => {
  let scrolling = false;

  const root = document.getElementById(rootId);
  const slider = root?.querySelector<HTMLElement>(
    `[${ATTRIBUTES["data-slider"]}]`,
  );
  const items = root?.querySelectorAll(`[${ATTRIBUTES["data-slider-item"]}]`);
  const prev = root?.querySelectorAll(`[${ATTRIBUTES['data-slide="prev"']}]`);
  const next = root?.querySelectorAll(`[${ATTRIBUTES['data-slide="next"']}]`);
  const dots = root?.querySelectorAll(`[${ATTRIBUTES["data-dot"]}]`);

  const thumbs = root?.querySelector<HTMLElement>(
    `[${ATTRIBUTES["data-thumbs"]}]`,
  );
  const thumbItems = thumbs?.querySelectorAll(
    `[${ATTRIBUTES["data-thumb-item"]}]`,
  );

  if (!root || !slider || !items || items.length === 0) {
    console.warn(
      "Missing necessary slider attributes. It will not work as intended. Necessary elements:",
      { root, slider, items, rootId },
    );

    return;
  }

  if (thumbs && (!thumbItems || thumbItems.length === 0)) {
    console.warn(
      "Missing necessary thumb attributes. It will not work as intended. Necessary elements:",
      { thumbs, thumbItems },
    );

    return;
  }

  const goToItem = (
    index: number,
    slider?: HTMLElement | null,
    items?: NodeListOf<Element> | null,
    scroll: "smooth" | "auto" | undefined = "smooth",
    axis: "x" | "y" = "x",
  ) => {
    if (!slider || !items) {
      return;
    }

    const item = items.item(index);

    if (!isHTMLElement(item)) {
      console.warn(
        `Element at index ${index} is not an html element. Skipping carousel`,
      );

      return;
    }

    if (axis === "x") {
      slider.scrollTo({
        top: 0,
        behavior: scroll,
        left: item.offsetLeft - slider.offsetLeft,
      });
    } else {
      slider.scrollTo({
        top: item.offsetTop - slider.offsetTop,
        behavior: scroll,
        left: 0,
      });
    }
  };

  const observer = new IntersectionObserver(
    (elements) =>
      elements.forEach((item) => {
        const index = Number(item.target.getAttribute("data-slider-item")) || 0;
        const dot = dots?.item(index);
        const thumb = thumbItems?.item(index);

        if (item.isIntersecting) {
          dot?.setAttribute("disabled", "");

          if (thumbs && thumb) {
            thumb.setAttribute("disabled", "");

            const thumbIsNotVisible = intersectionY(
              thumb.getBoundingClientRect(),
              thumbs.getBoundingClientRect(),
            ) < thumb.getBoundingClientRect().height;

            if (thumbIsNotVisible) {
              goToItem(index, thumbs, thumbItems, "smooth", "y");
            }
          }
        } else {
          dot?.removeAttribute("disabled");
          thumb?.removeAttribute("disabled");
        }

        if (!infinite) {
          if (index === 0) {
            if (item.isIntersecting) {
              prev?.forEach((el) => el.setAttribute("disabled", ""));
            } else {
              prev?.forEach((el) => el.removeAttribute("disabled"));
            }
          }
          if (index === items.length - 1) {
            if (item.isIntersecting) {
              next?.forEach((el) => el.setAttribute("disabled", ""));
            } else {
              next?.forEach((el) => el.removeAttribute("disabled"));
            }
          }
        }
      }),
    { threshold: THRESHOLD, root: slider, rootMargin: "16px" },
  );

  if (thumbs) {
    slider.addEventListener("scroll", () => {
      if (!scrolling) {
        items.forEach((item) => observer.unobserve(item));

        scrolling = true;
      }
    });

    slider.addEventListener("scrollend", () => {
      if (scrolling) {
        items.forEach((item) => observer.observe(item));

        scrolling = false;
      }
    });
  }

  items.forEach((item) => observer.observe(item));

  for (let it = 0; it < (items?.length ?? 0); it++) {
    dots?.item(it)?.addEventListener(
      "click",
      () => goToItem(it, slider, items, scroll),
    );
    thumbItems?.item(it)?.addEventListener(
      "click",
      () => {
        goToItem(it, slider, items, scroll);
      },
    );
  }

  const onClickPrev = () => {
    const indices = getElementsInsideContainer(slider, items, "x");
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingFirst = indices[0] === 0;
    const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage);

    goToItem(
      isShowingFirst ? items.length - 1 : (pageIndex - 1) * itemsPerPage,
      slider,
      items,
      scroll,
    );
  };

  const onClickNext = () => {
    const indices = getElementsInsideContainer(slider, items, "x");
    // Wow! items per page is how many elements are being displayed inside the container!!
    const itemsPerPage = indices.length;

    const isShowingLast = indices[indices.length - 1] === items.length - 1;
    const pageIndex = Math.floor(indices[0] / itemsPerPage);

    goToItem(
      isShowingLast ? 0 : (pageIndex + 1) * itemsPerPage,
      slider,
      items,
      scroll,
    );
  };

  prev?.forEach((el) => el.addEventListener("click", onClickPrev));
  next?.forEach((el) => el.addEventListener("click", onClickNext));

  const timeout = interval && setInterval(onClickNext, interval);

  // Unregister callbacks
  return () => {
    for (let it = 0; it < (dots?.length ?? 0); it++) {
      dots?.item(it).removeEventListener(
        "click",
        () => goToItem(it, slider, items, scroll),
      );
    }

    prev?.forEach((el) => el.removeEventListener("click", onClickPrev));
    next?.forEach((el) => el.removeEventListener("click", onClickNext));

    observer.disconnect();

    clearInterval(timeout);
  };
};

function Slider({
  rootId,
  scroll = "smooth",
  interval,
  infinite = false,
}: Props) {
  useEffect(
    () => setup({ rootId, scroll, interval, infinite }),
    [rootId, scroll, interval, infinite],
  );

  return <div class="hidden" data-slider-controller-js />;
}

export default Slider;
