import { SealPosition } from "$store/loaders/Seals/seals.tsx";
import {
  CategorySealConfig,
  ClusterSealConfig,
  isCategory,
  isCluster,
  isSpecification,
  SealConfig,
  SpecificationSealConfig,
} from "$store/loaders/Seals/seals.tsx";
import { Product, PropertyValue } from "apps/commerce/types.ts";
import { clx } from "$store/sdk/clx.ts";
import { useTheme } from "deco-sites/fast-fashion/sdk/useTheme.tsx";
import { getBetterContrastingColor } from "deco-sites/fast-fashion/sections/Theme/Theme.tsx";

interface Props {
  sealsConfig?: SealConfig[];
  product: Product;
  position: SealPosition;
  limit: number;
  width?: number;
  height?: number;
}

const getClusterConfigs = (
  sealsConfigs?: SealConfig[],
): ClusterSealConfig[] => {
  return (
    sealsConfigs?.filter((config): config is ClusterSealConfig =>
      isCluster(config)
    ) ?? []
  );
};

const getCategoryConfigs = (
  sealsConfigs?: SealConfig[],
): CategorySealConfig[] => {
  return (
    sealsConfigs?.filter((config): config is CategorySealConfig =>
      isCategory(config)
    ) ?? []
  );
};

const getSpecificationConfigs = (
  sealsConfigs?: SealConfig[],
): SpecificationSealConfig[] => {
  return (
    sealsConfigs?.filter((config): config is SpecificationSealConfig =>
      isSpecification(config)
    ) ??
      []
  );
};

const getClusterProperties = (properties?: PropertyValue[]) => {
  return properties?.filter((prop) => prop.name == "cluster") ?? [];
};

const getCategoryProperties = (properties?: PropertyValue[]) => {
  return properties?.filter((prop) => prop.name == "category") ?? [];
};

const getSpecificationProperties = (properties?: PropertyValue[]) => {
  return (
    properties?.filter(
      (prop) =>
        prop.valueReference == "SPECIFICATION" ||
        prop.valueReference == "PROPERTY",
    ) ?? []
  );
};

type FinalSealConfig = SealConfig & Omit<PropertyValue, "@type" | "image">;

const styles = {
  image: "rounded-full h-9 w-9 flex items-center justify-center",
  info: "h-full w-full flex items-center justify-center text-xs min-w-[100px]",
} as const;

const SealsList = ({ sealsConfig, product, position, limit = 3 }: Props) => {
  if (!sealsConfig?.length) return <></>;

  const { colors } = useTheme();

  const { additionalProperty = [], isVariantOf } = product;

  const { additionalProperty: additionalPropertyProduct = [] } = isVariantOf ??
    {};

  const properties = [...additionalProperty, ...additionalPropertyProduct];

  const clusterProperties = getClusterProperties(properties);
  const categoryProperties = getCategoryProperties(properties);
  const specificationProperties = getSpecificationProperties(properties);

  const positionSeals = sealsConfig?.filter(
    (config) => config.position == position,
  );

  const clusterConfigs = getClusterConfigs(positionSeals);
  const categoryConfigs = getCategoryConfigs(positionSeals);
  const specificationConfigs = getSpecificationConfigs(positionSeals);

  const filteredClusterConfigs = clusterConfigs.reduce((acc, config) => {
    const { image: _image, ...clusterProperty } = clusterProperties.find(
      (prop) => config.collectionId === prop.propertyID,
    ) ?? {};

    if (Object.entries(clusterProperty).length) {
      acc.push({ ...clusterProperty, ...config });
    }

    return acc;
  }, [] as Array<FinalSealConfig>);

  const filteredSpecificationConfigs = specificationConfigs.reduce(
    (acc, config) => {
      const specificationProperty = specificationProperties.find(
        (prop) =>
          config.specificationName === prop.name &&
          config.specificationValue === prop.value,
      ) ?? ({} as PropertyValue);

      if (Object.entries(specificationProperty).length) {
        const { image: _image, ...specProduct } = specificationProperty;

        acc.push({ ...specProduct, ...config });
      }

      return acc;
    },
    [] as Array<FinalSealConfig>,
  );

  const filteredCategoryConfigs = categoryConfigs.reduce((acc, config) => {
    const { image: _image, ...categoryProperty } = categoryProperties.find(
      (prop) => config.categoryId === prop.propertyID,
    ) ?? {};

    if (Object.entries(categoryProperty).length) {
      acc.push({ ...categoryProperty, ...config });
    }

    return acc;
  }, [] as Array<FinalSealConfig>);

  const filteredSeals = [
    ...filteredClusterConfigs,
    ...filteredSpecificationConfigs,
    ...filteredCategoryConfigs,
  ];

  return (
    <>
      {filteredSeals.slice(0, limit).map((seal) => {
        const textColor = getBetterContrastingColor(
          seal.background,
          colors.neutral,
          colors["base-100"],
        );

        return (
          <div
            style={{
              backgroundColor: seal.background,
              color: textColor,
            }}
            class={clx(
              position === "image" && styles.image,
              position === "info" && styles.info,
            )}
          >
            <span class="uppercase text-center inline text-[10px] leading-none font-bold">
              {seal.label}
            </span>
          </div>
        );
      })}
    </>
  );
};

export default SealsList;
