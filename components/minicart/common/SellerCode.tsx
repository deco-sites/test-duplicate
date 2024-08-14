import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { useSignal, useSignalEffect } from "@preact/signals";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";
import { useEffect, useRef } from "preact/hooks";

interface Props {
  onAddSellerCode: (sellerCode: string) => void;
  onRemoveSellerCode?: () => void;
  sellerCode?: string;
  loading?: boolean;
}

function SellerCode({
  sellerCode,
  onAddSellerCode,
  onRemoveSellerCode,
  loading,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uiState = useSignal<"idle" | "add" | "added">(
    sellerCode ? "added" : "idle",
  );

  const hasTriedToApplySellerCode = useSignal(false);

  const handleSubmit = (
    e: Event & { currentTarget: HTMLFormElement },
  ) => {
    e.preventDefault();

    const {
      currentTarget: { elements },
    } = e;

    const input = elements.namedItem(
      "sellerCode",
    ) as HTMLInputElement;
    const text = input.value;

    if (!text) return;

    hasTriedToApplySellerCode.value = true;

    try {
      onAddSellerCode(text);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loading) return;

    uiState.value = !sellerCode && hasTriedToApplySellerCode.value
      ? "add"
      : sellerCode
      ? "added"
      : "idle";
  }, [loading, sellerCode]);

  useSignalEffect(() => {
    globalThis.document.addEventListener("mouseup", () => {
      if (uiState.value === "add" && inputRef.current?.value === "") {
        uiState.value = "idle";
      }
    });

    return () => {
      globalThis.document.removeEventListener("mouseup", () => {});
    };
  });

  return (
    <div class="flex">
      {uiState.value === "idle"
        ? (
          <Button
            class="btn-link text-neutral-500 p-0 h-8 min-h-8 font-bold"
            onClick={() => (uiState.value = "add")}
            ariaLabel="Adicionar código do vendedor"
            title="Adicionar código do vendedor"
          >
            Adicionar código do vendedor
          </Button>
        )
        : (
          <div
            class={clx(
              "flex md:flex-row w-full md:items-center justify-between",
              uiState.value === "add" &&
                "flex-col gap-1",
            )}
          >
            <span class="underline font-bold text-neutral-500 cursor-pointer">
              Cód. Vendedor
            </span>
            {uiState.value === "added"
              ? (
                <Button
                  class="gap-2 text-primary btn-ghost h-8 min-h-8 hover:bg-transparent p-0"
                  onClick={() => onRemoveSellerCode?.()}
                >
                  {sellerCode}{" "}
                  <Icon id="Close" size={24} class="text-neutral-600" />
                </Button>
              )
              : (
                <form
                  onMouseUp={(e) => e.stopPropagation()}
                  class="flex gap-1 flex-1 md:max-w-[264px]"
                  onSubmit={handleSubmit}
                >
                  <div
                    class="flex-grow group/input flex flex-col gap-2"
                    // data-error={!sellerCode}
                    // data error later can be used to validade the seller code with master data
                    data-error={false}
                  >
                    <input
                      ref={inputRef}
                      name="sellerCode"
                      class="input h-12 text-sm placeholder:text-neutral-400 border border-neutral-300 w-full outline-none bg-transparent group-data-[error='true']/input:border-danger-500"
                      type="text"
                      value={uiState.value === "add" ? "" : sellerCode ?? ""}
                      placeholder="Digite o cód."
                    />
                    <span class="group-data-[error='false']/input:hidden text-danger-500">
                      Cód inválido
                    </span>
                  </div>
                  <Button
                    class="btn-primary h-12 w-24"
                    type="submit"
                    htmlFor="sellerCode"
                    loading={loading}
                  >
                    Ativar
                  </Button>
                </form>
              )}
          </div>
        )}
    </div>
  );
}

export default SellerCode;
