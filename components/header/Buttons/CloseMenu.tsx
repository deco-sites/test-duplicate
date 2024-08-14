import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { useUI } from "$store/sdk/useUI.ts";

export default function CloseMenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="btn btn-square size-10 btn-ghost min-h-10"
      ariaLabel="open menu"
      onClick={() => {
        displayMenu.value = false;
      }}
    >
      <Icon id="Close" size={24} />
    </Button>
  );
}
