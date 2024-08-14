import Icon from "$store/components/ui/Icon.tsx";
import { useEffect } from "preact/hooks";

const RADIO_NAME = "gallery-layout-input";

export const GALLERY_GRID_ID = "layout-type-grid";
export const GALLERY_LIST_ID = "layout-type-list";

export default function LayoutSwitcher() {
  return (
    <div class="flex gap-2 text-sm text-neutral-600">
      {/* Grid */}
      <label
        class="flex items-center gap-2 border border-neutral-300 h-10 px-2 rounded cursor-pointer has-[:checked]:bg-neutral-600 has-[:checked]:text-neutral-100"
        htmlFor={GALLERY_GRID_ID}
        aria-label="Grade"
        title="Grade"
      >
        <input
          class="hidden"
          type="radio"
          name={RADIO_NAME}
          id={GALLERY_GRID_ID}
        />
        <Icon id="Grid" width={21} height={21} />
        <span>Grade</span>
      </label>

      {/* List */}
      <label
        class="flex items-center gap-2 border border-neutral-300 h-10 px-2 rounded cursor-pointer has-[:checked]:bg-neutral-600 has-[:checked]:text-neutral-100"
        htmlFor={GALLERY_LIST_ID}
        aria-label="Lista"
        title="Lista"
      >
        <input
          class="hidden"
          type="radio"
          name={RADIO_NAME}
          id={GALLERY_LIST_ID}
        />
        <Icon id="List" width={21} height={21} />
        <span>Lista</span>
      </label>

      <LayoutSwitcherScript />
    </div>
  );
}

// (Island) Saves/loads layout config to/from local storage
export function LayoutSwitcherScript() {
  useEffect(() => {
    const $grid = document.getElementById(GALLERY_GRID_ID) as
      | HTMLInputElement
      | null;
    const $list = document.getElementById(GALLERY_LIST_ID) as
      | HTMLInputElement
      | null;

    if (!$grid || !$list) return;

    // Loads the current selected
    const galleyLayout = localStorage.getItem("gallery-layout") ?? "grid";
    if (galleyLayout === "grid") {
      $grid.checked = true;
    } else {
      $list.checked = true;
    }

    $grid.addEventListener("click", () => {
      localStorage.setItem("gallery-layout", "grid");
    });

    $list.addEventListener("click", () => {
      localStorage.setItem("gallery-layout", "list");
    });
  }, []);

  return <div class="hidden" data-layout-switcher-scripts />;
}
