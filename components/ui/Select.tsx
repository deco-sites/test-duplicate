import { useId } from "$store/sdk/useId.ts";
import Icon from "$store/components/ui/Icon.tsx";
import type { ComponentProps } from "preact";
import { twMerge } from "npm:tailwind-merge@2.2.2";
import { useSignal } from "@preact/signals";
import { JSX } from "preact";
import { useRef } from "preact/hooks";

type Props = {
  options: {
    name?: string;
    value?: string;
  }[];
  defaultValue: string;
  value?: string;
  id?: string;
  class?: string;
  onChange: (e: JSX.TargetedMouseEvent<HTMLInputElement>) => void;
} & Omit<ComponentProps<"div">, "onChange">;

export function Select(
  { defaultValue, options, id, class: _class, onChange, value }: Props,
) {
  const rootId = id ?? useId();

  const valueSelected = useSignal<string | undefined>(value ?? defaultValue);

  const inputSelect = useRef<HTMLInputElement | null>(null);

  function handleSelectedOption(e: JSX.TargetedMouseEvent<HTMLInputElement>) {
    valueSelected.value = e.currentTarget.dataset.label;

    onChange(e);

    inputSelect.current?.click();
  }

  return (
    <div class={twMerge("relative w-full", _class)}>
      <input
        type="checkbox"
        id={rootId}
        ref={inputSelect}
        class="opacity-0 absolute w-full h-full cursor-pointer peer/select z-30"
      />

      <label
        class="p-3 flex justify-between gap-1 items-center peer-checked/select:[&>svg]:rotate-180"
        htmlFor={rootId}
      >
        <span
          title={value ?? valueSelected.value}
          class="md:max-w-full text-sm font-bold capitalize text-neutral-700 truncate"
        >
          {value ?? valueSelected.value}
        </span>
        <Icon
          id="ChevronDown"
          size={16}
          class="flex-shrink-0 transition-all"
        />
      </label>

      <div class="absolute hidden inset-x-0 shadow-xl top-[calc(100%+1px)] bg-neutral-100 shadow-box  pl-0 peer-checked/select:block z-20">
        <ul class="overflow-x-hidden max-h-[172px] divide-y-2 divide-neutral-200">
          {options.map((option) => (
            <li
              title={option.name}
              class="cursor-pointer text-neutral-700 p-4 hover:bg-neutral-100 relative"
            >
              <input
                class="absolute inset-0 opacity-0 cursor-pointer peer"
                type="radio"
                name={`${rootId}-option`}
                value={option.value}
                data-label={option.name}
                onChange={handleSelectedOption}
                checked={value === option.name}
              />

              <span
                title={option.name}
                class="text-sm capitalize w-full truncate peer-checked:font-bold"
              >
                {option.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
