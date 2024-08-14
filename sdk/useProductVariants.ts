import type { Product, ProductLeaf } from "apps/commerce/types.ts";

export interface SpecValue {
  name: string;
  value: string;
}

export interface SkuSpecValue {
  value: string;
  url: string;
  skuID: string;
  selected: boolean;
  inStock: boolean;
  priority: number;
  image?: string;
}

export interface SkuSpecGroup {
  name: string;
  label: string;
  values: SkuSpecValue[];
}

export interface DictionarySpec {
  label: string;
  possibleLabels: string[];
}

export interface Params {
  product: Product;
  dictionary?: DictionarySpec[];
  selectedSku?: string;
}

export function useProductVariants(
  { product, dictionary = [], selectedSku }: Params,
) {
  const { isVariantOf } = product;
  const { hasVariant = [] } = isVariantOf ?? {};

  if (hasVariant.length === 0) return [];

  const selectedVariant =
    hasVariant.find((variant) => variant.sku === selectedSku) ?? product;

  const selectedPriority = getVariantPriority(
    product,
    selectedVariant,
    dictionary,
  );

  const skuSpecGroups: SkuSpecGroup[] = [];

  for (const variant of hasVariant) {
    const { additionalProperty = [], url, sku } = variant;
    if (!url) continue;

    const priority = getVariantPriority(product, variant, dictionary);
    const inStock =
      variant.offers?.offers[0].availability === "https://schema.org/InStock";

    const selected = selectedPriority === priority;

    for (const property of additionalProperty) {
      const { valueReference, name, value } = property;

      if (valueReference !== "SPECIFICATION" || !name || !value) continue;

      const foundItem = dictionary.find((item) =>
        item.possibleLabels.includes(name)
      );
      const label = foundItem?.label ?? name;

      const newValue: SkuSpecValue = {
        value,
        url,
        skuID: sku,
        selected,
        priority,
        inStock,
        image: variant.image?.[0].url,
      };

      const foundSpecGroup = skuSpecGroups.find((variant) =>
        variant.name === name
      );

      if (foundSpecGroup) {
        const foundIndex = foundSpecGroup.values.findIndex((variantValue) =>
          variantValue.value === value
        );

        if (foundIndex != -1) {
          if (newValue.priority > foundSpecGroup.values[foundIndex].priority) {
            foundSpecGroup.values[foundIndex] = newValue;
          }
        } else {
          foundSpecGroup.values.push(newValue);
        }
      } else {
        skuSpecGroups.push({
          name,
          label,
          values: [newValue],
        });
      }
    }
  }

  // Ordena os grupos na ordem passada no dicionário
  skuSpecGroups.sort((a, b) => {
    const nameA = a.name;
    const nameB = b.name;

    const indexA = dictionary.findIndex((item) =>
      item.possibleLabels.includes(nameA)
    );
    const indexB = dictionary.findIndex((item) =>
      item.possibleLabels.includes(nameB)
    );

    return indexA - indexB;
  });

  return skuSpecGroups;
}

function getVariantSpecs({ additionalProperty = [] }: ProductLeaf) {
  return additionalProperty.reduce((acc, property) => {
    const { valueReference, name, value } = property;
    if (valueReference !== "SPECIFICATION" || !name || !value) return acc;

    return [...acc, { name, value }];
  }, [] as SpecValue[]);
}

function getVariantPriority(
  product: Product,
  productLeaf: ProductLeaf,
  dictionary: DictionarySpec[],
) {
  const selectedSpecs = getVariantSpecs(product);
  const variantSpecs = getVariantSpecs(productLeaf);

  return variantSpecs.toReversed().reduce((total, variantSpec, index) => {
    const { name, value } = variantSpec;

    const isSelected = selectedSpecs.some((spec) =>
      spec.name === name && spec.value === value
    );

    if (!isSelected) return total;

    const dictIndex = dictionary.toReversed().findIndex((item) =>
      item.possibleLabels.includes(name)
    );

    const trueIndex = dictIndex === -1 ? index : dictIndex;

    return total + Math.pow(2, trueIndex);
  }, 0);
}
