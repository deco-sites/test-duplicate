import { useSignal } from "@preact/signals";
import { clx } from "$store/sdk/clx.ts";
import Icon from "deco-sites/fast-fashion/components/ui/Icon.tsx";

interface Props {
  contentToCopy: string;
}

export default function CopyButton({ contentToCopy }: Props) {
  const copied = useSignal(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contentToCopy);
    copied.value = true;
    setTimeout(() => (copied.value = false), 3000);
  };

  return (
    <button
      class={clx(
        "flex items-center justify-center bg-neutral-100 rounded-md",
        copied.value && "tooltip tooltip-open max-md:tooltip-left",
      )}
      onClick={copyToClipboard}
      data-tip="Link copiado!"
    >
      <Icon id="Copy" class="text-primary" size={32} />
    </button>
  );
}
