import { Head } from "$fresh/runtime.ts";
import type { SectionProps } from "deco/mod.ts";
import type { AppContext } from "$store/apps/site.ts";
import type { Props, StructuredData } from "./types.ts";
import { removeProperties } from "$store/sdk/format.ts";
import { Product } from "apps/commerce/types.ts";

export default function PageSEO(
  {
    title,
    meta,
    link,
    opengraph,
    twitter,
    jsonLD,
  }: SectionProps<typeof loader>,
) {
  return (
    <Head>
      {title && <title>{title}</title>}
      {link.map((item) => <link {...item} />)}
      {meta.map((item) => <meta {...item} />)}
      {opengraph.map((item) => <meta {...item} />)}
      {twitter.map((item) => <meta {...item} />)}

      {jsonLD?.map((data) => (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
    </Head>
  );
}

const KEYWORD_MAPPINGS = {
  "Brand": "Marca",
  "Category": "Categoria",
  "Department": "Departamento",
  "SubCategory": "Subcategoria",
  "Product": "Produto",
  "Collection": "Coleção",
  "Cluster": "Coleção",
  "Search": "Busca",
  "Unknown": "",
} as const;

const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  "applicableCountry": "BR",
  "@id": "#return_policy",
  "merchantReturnDays": 7,
  "returnFees": "https://schema.org/FreeReturn",
  "returnMethod": "https://schema.org/ReturnByMail",
  "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
};

const addMerchantReturnPolicy = (product: Product): Product => ({
  ...product,
  isVariantOf: product.isVariantOf
    ? {
      ...product.isVariantOf,
      hasVariant: product.isVariantOf.hasVariant.map((p) =>
        addMerchantReturnPolicy(p)
      ),
    }
    : undefined,
  offers: {
    ...product.offers,
    "hasMerchantReturnPolicy": MERCHANT_RETURN_POLICY,
  },
});

const renderTemplate = (template: string = "%s", value: string = "") =>
  template.replace("%s", value);

const getCanonicalByURL = (requestUrl: string) => {
  const url = new URL(requestUrl);
  const searchParams = Array.from(url.searchParams.keys());

  for (const key of searchParams) {
    if (!key.startsWith("filter.") && !key.startsWith("q")) {
      url.searchParams.delete(key);
    }
  }

  return url.toString();
};

const generateKeywords = (
  keywords: string = "",
  pageType: keyof typeof KEYWORD_MAPPINGS = "Unknown",
) => [KEYWORD_MAPPINGS[pageType], keywords].filter(Boolean).join(", ");

const getJsonLD = (structuredData: StructuredData) => {
  if (!structuredData) return [];
  const clonedData = structuredClone(structuredData);

  const PRODUCT_FIELDS_TO_REMOVE = ["sellerName", "teasers", "required"];

  if (clonedData["@type"] === "ProductDetailsPage") {
    const productWithMerchantReturnPolicy = addMerchantReturnPolicy(
      clonedData.product,
    );
    const productToJsonLD = {
      "@context": "https://schema.org",
      ...removeProperties(
        productWithMerchantReturnPolicy,
        PRODUCT_FIELDS_TO_REMOVE,
      ),
    };

    const breadcrumbListToJsonLD = {
      "@context": "https://schema.org",
      ...clonedData.breadcrumbList,
    };

    const jsonLDResult = [breadcrumbListToJsonLD, productToJsonLD];
    return jsonLDResult;
  }

  if (clonedData["@type"] === "ProductListingPage") {
    if (!clonedData.products) return [];

    const productsToJsonLD = {
      "@context": "https://schema.org",
      "@type": "Products",
      products: clonedData.products.map((p) => {
        const productThin = removeProperties(p, PRODUCT_FIELDS_TO_REMOVE);

        return addMerchantReturnPolicy(productThin);
      }),
    };

    const breadcrumbListToJsonLD = {
      "@context": "https://schema.org",
      ...clonedData.breadcrumb,
    };

    const jsonLDResult = [breadcrumbListToJsonLD, productsToJsonLD];
    return jsonLDResult;
  }

  return [];
};

export const loader = (
  {
    title,
    titleTemplate,
    description,
    descriptionTemplate,
    keywords,
    canonical,
    favicon,
    noIndex,
    noFollow,
    og,
    image,
    structuredData,
    omitProductsFromStructuredData,
  }: Props,
  request: Request,
  { seo: globalSeo }: AppContext,
) => {
  const pageType = structuredData?.["@type"];
  const seo = structuredData?.seo;

  title = renderTemplate(
    titleTemplate || globalSeo?.titleTemplate,
    title || seo?.title || globalSeo?.title,
  );

  description = renderTemplate(
    descriptionTemplate || globalSeo?.descriptionTemplate,
    description || seo?.description || globalSeo?.description,
  );

  canonical = canonical || getCanonicalByURL(request.url);
  favicon = favicon || globalSeo?.favicon;
  image = image || globalSeo?.image;

  const themeColor = globalSeo?.themeColor || "#FFFFFF";
  const type = og?.type || globalSeo?.type || "website";
  const card = type === "website" ? "summary" : "summary_large_image";
  const robots = globalSeo?.noIndexing
    ? "noindex,nofollow"
    : [noIndex && "noindex", noFollow && "nofollow"]
      .filter(Boolean).join(",");

  if (pageType === "ProductListingPage" && structuredData) {
    const pageTypes = structuredData.pageInfo.pageTypes ?? [];
    keywords = generateKeywords(keywords, pageTypes.at(-1));

    if (omitProductsFromStructuredData) {
      structuredData = structuredClone(structuredData);
      structuredData.products = [];
      structuredData.filters = [];
    }
  } else if (pageType === "ProductDetailsPage" && structuredData) {
    keywords = generateKeywords(keywords, "Product");

    if (omitProductsFromStructuredData) {
      structuredData = structuredClone(structuredData);
      structuredData.product.isVariantOf = undefined;
      structuredData.product.isSimilarTo = structuredData.product
        .isSimilarTo?.map((item) => ({ ...item, isVariantOf: undefined }));
      structuredData.product.isRelatedTo = structuredData.product
        .isRelatedTo?.map((item) => ({ ...item, isVariantOf: undefined }));
    }
  }

  const jsonLD = getJsonLD(structuredData);

  const meta = [
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "robots", content: robots },
    { name: "theme-color", content: themeColor },
  ].filter(({ content }) => !!content);

  const link = [
    { rel: "canonical", href: canonical },
    { rel: "shortcut icon", href: favicon },
  ].filter(({ href }) => !!href);

  const opengraph = [
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    { name: "og:type", content: type },
    { name: "og:image", content: image },
    { name: "og:url", content: canonical },
  ].filter(({ content }) => !!content);

  const twitter = [
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:card", content: card },
  ].filter(({ content }) => !!content);

  return {
    title,
    meta,
    link,
    opengraph,
    twitter,
    jsonLD,
  };
};
