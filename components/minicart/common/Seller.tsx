import Button from "$store/components/ui/Button.tsx";
import { useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  coupon?: string;
  onAddCoupon: (text: string) => Promise<void>;
}

function Coupon({ coupon, onAddCoupon }: Props) {
  const loading = useSignal(false);
  const uiState = useSignal<"idle" | "add" | "added">(
    coupon ? "added" : "idle",
  );
  const hasTriedToApplyCoupon = useSignal(false);

  return (
    <div class="flex">
      {uiState.value === "idle"
        ? (
          <Button
            class="btn-link font-normal text-neutral-500 p-0 h-8 min-h-8"
            onClick={() => (uiState.value = "add")}
            ariaLabel="Adicionar cupom"
            title="Adicionar cupom"
          >
            Adicionar cupom
          </Button>
        )
        : (
          <div class="flex w-full items-center justify-between">
            <span class="gap-2">Cupom</span>
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
                  class="flex gap-1 max-w-[264px] flex-1"
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
                      hasTriedToApplyCoupon.value = true;
                      await onAddCoupon(text);
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
