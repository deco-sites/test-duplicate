import type { ProductLeaf, PropertyValue } from "apps/commerce/types.ts";

export type Possibility = {
  url?: string;
  imageUrl?: string;
  isSelectable: boolean;
  isSelected: boolean;
  value: string;
  isAvailable: boolean;
};

export type Possibilities = Record<
  string,
  Record<
    string,
    Possibility
  >
>;

const hash = ({ name, value }: PropertyValue) => `${name}::${value}`;

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  selected: ProductLeaf,
): Possibilities => {
  const possibilities: Possibilities = {};
  const selectedSpecs = new Set(selected.additionalProperty?.map(hash));

  for (const variant of variants) {
    const { url, additionalProperty = [], productID } = variant;
    const isSelected = productID === selected.productID;
    const specs = additionalProperty.filter(({ name, valueReference }) =>
      !omit.has(name!) && valueReference === "SPECIFICATION"
    );

    for (let it = 0; it < specs.length; it++) {
      const name = specs[it].name!;
      const value = specs[it].value!;
      const imageUrl = variant.image?.[0]?.url;

      if (omit.has(name)) continue;

      if (!possibilities[name]) {
        possibilities[name] = {};
      }

      // First row is always selectable
      const isSelectable = it === 0 ||
        specs.every((s) => s.name === name || selectedSpecs.has(hash(s)));
      const isAvailable = variant.offers?.offers[0].availability !==
        "https://schema.org/OutOfStock";

      possibilities[name][value] = {
        url,
        imageUrl,
        value,
        isSelectable,
        isSelected,
        isAvailable,
      };
    }
  }

  return possibilities;
};
