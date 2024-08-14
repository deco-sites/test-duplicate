import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { useUI } from "$store/sdk/useUI.ts";

interface Props {
  loading: boolean;
  totalItems: number;
  handleViewCart?: () => void;
}

function CartButton({ loading, totalItems, handleViewCart }: Props) {
  const { displayCart } = useUI();

  const handleClick = () => {
    handleViewCart?.();
    displayCart.value = true;
  };

  return (
    <Button
      class="btn-ghost h-10 px-2 min-h-10 w-[58px] md:p-0 md:w-[70px] hover:bg-transparent disabled:bg-transparent font-normal"
      ariaLabel="Abrir carrinho"
      data-deco={displayCart.value && "open-cart"}
      loading={loading}
      onClick={handleClick}
    >
      <div class="indicator max-md:pr-3">
        <Icon id="ShoppingCart" size={28} class="text-primary" />
        <span
          class={`md:hidden indicator-item badge badge-neutral badge-md text-xs px-0 size-5 transform-none border border-base-100`}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      </div>
      <div class="hidden md:flex flex-col text-left">
        <span>Itens</span>
        <strong>
          ({totalItems > 0 ? String(totalItems).padStart(2, "0") : "0"})
        </strong>
      </div>
    </Button>
  );
}

export default CartButton;
