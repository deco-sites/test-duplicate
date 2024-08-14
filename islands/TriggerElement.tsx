import { debounce } from "std/async/mod.ts";
import { useEffect } from "preact/hooks";

export interface TriggerElementProps {
  id: string;
  trigger: string;
  offset?: number;
}

export const TriggerElement = (
  { id, offset = 0, trigger }: TriggerElementProps,
) => {
  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top <= self.innerHeight + offset;
          element.setAttribute(trigger, isVisible ? "true" : "false");
          ticking = false;
        });
      }
    };

    handleScroll();
    const handleScrollDebounced = debounce(handleScroll, 100);
    self.addEventListener("scroll", handleScrollDebounced);

    return () => {
      self.removeEventListener("scroll", handleScrollDebounced);
    };
  }, [id, offset, trigger]);

  return null;
};
