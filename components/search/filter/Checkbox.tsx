import { JSX } from "preact";

type Props = JSX.IntrinsicElements["input"];

export default function Checkbox(
  { id, ...props }: Props,
) {
  return (
    <label
      htmlFor={id}
      class="group/checkbox flex items-center justify-center w-6 h-6 border border-neutral-300"
    >
      <input type="checkbox" class="hidden" {...props} />

      <div class="hidden w-3 h-3 bg-neutral-600 group-has-[input:checked]/checkbox:flex" />
    </label>
  );
}
