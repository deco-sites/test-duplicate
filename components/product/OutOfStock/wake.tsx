import { invoke } from "$store/runtime.ts";
import OutOfStockCommon from "$store/components/product/OutOfStock/Common.tsx";

export function OutOfStockWake({ productId }: { productId: string }) {
  const handleSubmit = async (
    { name, email }: { name: string; email: string },
  ) => {
    await invoke.wake.actions.notifyme({
      name,
      email,
      productVariantId: Number(productId),
    });
  };

  return <OutOfStockCommon onSubmit={handleSubmit} />;
}
