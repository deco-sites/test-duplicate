import Icon from "$store/components/ui/Icon.tsx";
import { UnitPriceSpecification } from "apps/commerce/types.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { clx } from "$store/sdk/clx.ts";

function Instalment({
  method: { billingDuration, billingIncrement },
  currency,
}: {
  method: UnitPriceSpecification;
  currency: string;
}) {
  return (
    <li>
      <span class="block py-2.5 text-neutral-600 border-b border-solid border-neutral-200 text-sm leading-5">
        {billingDuration}X de{" "}
        <strong>{formatPrice(billingIncrement, currency)}</strong> sem juros
      </span>
    </li>
  );
}

/**
 * @titleBy name
 */
export interface CustomMethod {
  /** @title Nome */
  name: string;
  /**
   * @title Descrição
   * @format textarea
   */
  description: string;
}

interface Props {
  methods: UnitPriceSpecification[];
  customMethods: CustomMethod[];
}

function Trigger() {
  return (
    <label
      for="installments_modal"
      class="text-neutral-500 flex gap-2 item-center"
    >
      <span class="text-xs leading-[14px] underline cursor-pointer">
        Opções de pagamento
      </span>
      <Icon id="ChevronDown" size={16} />
    </label>
  );
}

function Modal({ methods, customMethods }: Props) {
  const installmentTypeMethods = methods.filter(
    (method) => method.billingDuration,
  );

  const highestBillingDuration = installmentTypeMethods.reduce(
    (highest, method) =>
      method.billingDuration! > highest.billingDuration! ? method : highest,
    installmentTypeMethods[0],
  );

  const highestBillingDurationMethods = installmentTypeMethods.filter(
    (method) => method.name === highestBillingDuration.name,
  );

  return (
    <>
      <input type="checkbox" id="installments_modal" class="modal-toggle" />
      <div class="modal" role="dialog">
        <div class="modal-box p-0 rounded-none max-w-[497px]">
          <div class="flex justify-between items-center pl-[30px] bg-primary text-primary-content py-1.5">
            <h3 class="text-lg font-bold">Formas de Pagamento</h3>
            <label class="btn btn-ghost" for="installments_modal">
              <Icon id="Close" size={24} />
            </label>
          </div>

          <div
            role="tablist"
            class="tabs tabs-bordered py-5 px-[30px]"
            style={{
              gridTemplateColumns: `repeat(${customMethods.length + 1}, auto)`,
            }}
          >
            <input
              type="radio"
              name="payment_tabs"
              role="tab"
              class="tab after:whitespace-pre !w-min px-0 checked:after:!font-bold !border-transparent border-b checked:!border-neutral-600"
              aria-label="Cartão de crédito"
              checked
            />
            <div
              role="tabpanel"
              class="tab-content mt-5 col-start-1 col-span-full"
            >
              <ul>
                {highestBillingDurationMethods.map((method) => (
                  <Instalment method={method} currency="BRL" />
                ))}
              </ul>
            </div>

            {customMethods.map(({ name, description }, index) => (
              <>
                <input
                  type="radio"
                  name="payment_tabs"
                  role="tab"
                  class={clx(
                    "tab after:whitespace-pre !w-min px-0 !border-transparent border-b checked:!border-neutral-600 checked:after:!font-bold",
                    index === customMethods.length - 1
                      ? "justify-self-end"
                      : "justify-self-center",
                  )}
                  aria-label={name}
                />
                <div
                  role="tabpanel"
                  class="tab-content mt-5 col-start-1 col-span-full min-h-80 "
                >
                  <div class="py-2.5 border-b border-solid border-neutral-200 text-sm">
                    {description}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <label class="modal-backdrop" for="installments_modal">
          Close
        </label>
      </div>
    </>
  );
}

const PaymentMethods = {
  Trigger,
  Modal,
};

export default PaymentMethods;
