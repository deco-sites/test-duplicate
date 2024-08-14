import { invoke } from "$store/runtime.ts";
import OutOfStockCommon from "$store/components/product/OutOfStock/Common.tsx";

export function OutOfStockVtex({ productId }: { productId: string }) {
  const handleSubmit = async (
    { name, email }: { name: string; email: string },
  ) => {
    await invoke.vtex.actions.notifyme({ skuId: productId, name, email });
  };

  return <OutOfStockCommon onSubmit={handleSubmit} />;
}
