import { usePlatform } from "$store/sdk/usePlatform.tsx";
import type { Product } from "apps/commerce/types.ts";
import { OutOfStockVtex } from "$store/islands/OutOfStock/vtex.tsx";
import { OutOfStockWake } from "$store/islands/OutOfStock/wake.tsx";

export interface Props {
  productID: Product["productID"];
}

function OutOfStock({ productID }: Props) {
  const platform = usePlatform();

  if (platform === "vtex") return <OutOfStockVtex productId={productID} />;
  if (platform === "wake") return <OutOfStockWake productId={productID} />;

  return null;
}

export default OutOfStock;
