import Button from "../ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";

interface Props {
  quantity: number;
  disabled?: boolean;
  loading?: boolean;
  style?: string;
  onChange?: (quantity: number) => void;
}

const QUANTITY_MAX_VALUE = 100;

function QuantitySelector({
  onChange,
  quantity,
  disabled,
  loading,
  style = "",
}: Props) {
  const decrement = () => onChange?.(Math.max(0, quantity - 1));

  const increment = () =>
    onChange?.(Math.min(quantity + 1, QUANTITY_MAX_VALUE));

  return (
    <div
      class={style != "product-card"
        ? "flex items-center relative"
        : "flex items-center relative max-sm:hidden"}
    >
      <Button
        ariaLabel="Diminuir quantidade"
        class="btn-xs btn-ghost disabled:text-neutral-600 px-0 hover:bg-transparent disabled:bg-transparent"
        onClick={decrement}
        disabled={quantity < 2 || disabled}
        loading={loading}
      >
        <Icon id="Minus" size={24} />
      </Button>
      <label class="hidden absolute" aria-label="Quantidade de produto">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          max={QUANTITY_MAX_VALUE}
          min={1}
          value={quantity}
          disabled={disabled}
          onBlur={(e) => onChange?.(e.currentTarget.valueAsNumber)}
          maxLength={3}
          size={3}
        />
      </label>
      <span class="countdown font-bold text-sm tabular-nums mx-2 pt-[2px] text-neutral-500">
        <span
          class="[&::before]:duration-300"
          style={{ "--value": quantity }}
        >
        </span>
      </span>
      <Button
        ariaLabel="Aumentar quantidade"
        class="btn-xs px-0 btn-ghost text-primary-500 hover:bg-transparent disabled:bg-transparent"
        onClick={increment}
        disabled={disabled}
        loading={loading}
      >
        <Icon id="Plus" size={24} />
      </Button>
    </div>
  );
}

export default QuantitySelector;
