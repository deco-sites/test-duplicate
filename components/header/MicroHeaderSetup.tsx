// deno-lint-ignore-file no-explicit-any
import { useEffect } from "preact/hooks";

export interface Props {
  rootId: string;
  threshold?: number;
}

// biome-ignore lint/suspicious/noExplicitAny: idk whats the type
const debounce = <T extends (...args: any[]) => any>(fn: T) => {
  let frame: number;

  return (...params: Parameters<T>): void => {
    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(() => {
      fn(...params);
    });
  };
};

const storeHasScrolledPast = (root: HTMLElement, threshold: number) => {
  const hasScrolledPastTresHold = globalThis.scrollY >= threshold;

  const previousValue = root.getAttribute("data-micro-header");

  if (previousValue === hasScrolledPastTresHold.toString()) return;

  root.setAttribute("data-micro-header", hasScrolledPastTresHold.toString());
};

const storeIsScrollingUp = (root: HTMLElement, scrollY: number) => {
  const isScrollingUp = globalThis.scrollY < scrollY;

  const previousValue = root.getAttribute("data-micro-header-up");

  if (previousValue === isScrollingUp.toString()) return;

  root.setAttribute("data-micro-header-up", isScrollingUp.toString());
};

const setup = ({ rootId, threshold = 100 }: Props) => {
  const root = document.getElementById(rootId);

  if (!root) {
    console.warn("Unable to find root element with id", rootId);
    return;
  }
  let scrollY = globalThis.scrollY;

  document.addEventListener(
    "scroll",
    debounce(() => {
      storeHasScrolledPast(root, threshold);
      storeIsScrollingUp(root, scrollY);

      scrollY = globalThis.scrollY;
    }),
    { passive: true },
  );

  storeHasScrolledPast(root, threshold);
};

function MicroHeaderSetup({ rootId, threshold }: Props) {
  useEffect(() => setup({ rootId, threshold }), []);

  return <div data-micro-header-controller-js />;
}

export default MicroHeaderSetup;
