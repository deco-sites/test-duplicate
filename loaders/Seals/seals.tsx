export interface ClusterBadge {
  collectionId: string;
}

export interface SpecificationBadge {
  specificationName: string;
  specificationValue: string;
}

export interface CategoryBadge {
  categoryId: string;
}

// type Location = "shelf" | "pdp" | "both";

export type SealPosition = "image" | "info";

export interface SealDefaultConfig {
  label: string;
  /**
   * @format color-input
   */
  background: string;
  position: SealPosition;
}

/**
 * @title Category Seal
 */
export interface CategorySealConfig extends SealDefaultConfig, CategoryBadge {}

/**
 * @title Cluster Seal
 */
export interface ClusterSealConfig extends SealDefaultConfig, ClusterBadge {}

/**
 * @title Specification Seal
 */
export interface SpecificationSealConfig
  extends SealDefaultConfig, SpecificationBadge {}

export type SealConfig =
  | CategorySealConfig
  | ClusterSealConfig
  | SpecificationSealConfig;

export const isCategory = (
  config: SealConfig,
): config is CategorySealConfig => {
  return "categoryId" in config;
};

export const isCluster = (config: SealConfig): config is ClusterSealConfig => {
  return "collectionId" in config;
};

export const isSpecification = (
  config: SealConfig,
): config is SpecificationSealConfig => {
  return "categoryId" in config;
};

export interface Props {
  seals: (CategorySealConfig | ClusterSealConfig | SpecificationSealConfig)[];
}

/**
 * @title Selos
 */
const loader = (props: Props, _req: Request): SealConfig[] => {
  const { seals = [] } = props;

  return seals;
};

export default loader;
