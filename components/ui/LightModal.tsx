import { JSX } from "preact";
import { useId } from "$store/sdk/useId.ts";
import { createContext } from "preact";

interface ContextData {
  id: string;
}

const ModalContext = createContext<ContextData>({ id: "" });

type LightModalProps = {
  uniqueID?: string;
  open?: boolean;
} & JSX.IntrinsicElements["div"];

export function LightModal(
  { uniqueID, open = false, ...props }: LightModalProps,
) {
  const ID = uniqueID ?? useId();

  return (
    <div class="fixed z-50 left-0 top-0 w-full h-full hidden has-[.filters-checkbox:checked]:flex items-center justify-end">
      <input
        class="hidden filters-checkbox"
        type="checkbox"
        id={ID}
        checked={open}
      />
      <label
        class="absolute left-0 top-0 z-[-1] flex w-full h-full bg-black/35"
        htmlFor={ID}
      />
      <ModalContext.Provider value={{ id: ID }}>
        <div {...props} />
      </ModalContext.Provider>
    </div>
  );
}

type TriggerProps = {
  uniqueID?: string;
} & JSX.IntrinsicElements["label"];
export function Trigger({ uniqueID, ...props }: TriggerProps) {
  return (
    <ModalContext.Consumer>
      {(contextData) => {
        return <label htmlFor={uniqueID ?? contextData.id} {...props} />;
      }}
    </ModalContext.Consumer>
  );
}
