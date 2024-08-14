export function formatPriceToAnalytics(price: number) {
  const formatted = (price / 100).toFixed(2);
  return parseFloat(formatted);
}

export const categoriesToAnalytics = (
  categories: string[],
): Record<`item_category${number | ""}`, string> => {
  return categories.slice(0, 5).reduce((result, category, index) => {
    result[`item_category${index === 0 ? "" : index + 1}`] = category;
    return result;
  }, {} as Record<`item_category${number | ""}`, string>);
};
