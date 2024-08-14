import Button from "$store/components/ui/Button.tsx";
import { useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";
import { useEffect, useRef } from "preact/hooks";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";

export interface Props {
  coupon?: string;
  onAddCoupon: (text: string) => Promise<void>;
}

function Coupon({ coupon, onAddCoupon }: Props) {
  const loading = useSignal(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const uiState = useSignal<"idle" | "add" | "added">(
    coupon ? "added" : "idle",
  );

  const hasTriedToApplyCoupon = useSignal(false);

  useEffect(() => {
    if (loading.value) return;

    uiState.value = !coupon && hasTriedToApplyCoupon.value
      ? "add"
      : coupon
      ? "added"
      : "idle";
  }, [coupon, hasTriedToApplyCoupon.value, loading.value]);

  useEffect(() => {
    globalThis.document.addEventListener("mouseup", () => {
      if (uiState.value === "add" && inputRef.current?.value === "") {
        uiState.value = "idle";
      }
    });

    return () => {
      globalThis.document.removeEventListener("mouseup", () => {});
    };
  }, []);

  return (
    <div class="flex">
      {uiState.value === "idle"
        ? (
          <Button
            class="btn-link font-bold text-neutral-500 p-0 h-8 min-h-8"
            onClick={() => (uiState.value = "add")}
            ariaLabel="Adicionar cupom"
            title="Adicionar cupom"
          >
            Adicionar cupom
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
              Cupom
            </span>
            {uiState.value === "added"
              ? (
                <Button
                  class="gap-2 text-primary btn-ghost h-8 min-h-8 hover:bg-transparent p-0"
                  onClick={() => (uiState.value = "add")}
                >
                  {coupon}{" "}
                  <Icon id="Close" size={24} class="text-neutral-600" />
                </Button>
              )
              : (
                <form
                  onMouseUp={(e) => e.stopPropagation()}
                  class="flex gap-1 md:max-w-[264px] flex-1"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const {
                      currentTarget: { elements },
                    } = e;

                    const input = elements.namedItem(
                      "coupon",
                    ) as HTMLInputElement;
                    const text = input.value;

                    if (!text) return;

                    try {
                      loading.value = true;
                      await onAddCoupon(text);
                      hasTriedToApplyCoupon.value = true;
                    } finally {
                      loading.value = false;
                    }
                  }}
                >
                  <div
                    class="flex-grow group/input flex flex-col gap-2"
                    data-error={hasTriedToApplyCoupon.value && !coupon}
                  >
                    <input
                      ref={inputRef}
                      name="coupon"
                      class="input h-12 text-sm placeholder:text-neutral-400 border border-neutral-300 w-full outline-none bg-transparent group-data-[error='true']/input:border-danger-500"
                      type="text"
                      value={uiState.value === "add" ? "" : coupon ?? ""}
                      placeholder="Digite o cupom"
                    />
                    <span class="group-data-[error='false']/input:hidden text-danger-500">
                      Cupom inválido
                    </span>
                  </div>
                  <Button
                    class="btn-primary h-12 w-24"
                    type="submit"
                    htmlFor="coupon"
                    loading={loading.value}
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

export default Coupon;
