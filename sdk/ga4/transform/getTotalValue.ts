import type { AnalyticsItem } from "$store/sdk/ga4/types/index.ts";

export const getTotalValue = (items: AnalyticsItem[]) => {
  const value = items
    .reduce(
      (acc, { price, quantity, discount }) =>
        acc + (price * quantity - discount),
      0,
    )
    .toFixed(2);

  return parseFloat(value);
};
