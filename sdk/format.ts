const formatters = new Map<string, Intl.NumberFormat>();

const formatter = (currency: string, locale: string) => {
  const key = `${currency}::${locale}`;

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    );
  }

  return formatters.get(key)!;
};

export const formatPrice = (
  price: number | undefined,
  currency = "BRL",
  locale = "pt-BR",
) => price ? formatter(currency, locale).format(price) : null;

type GenericValue<T> = T | GenericObject<T> | GenericArray<T>;
type GenericObject<T> = { [key: string]: GenericValue<T> };
type GenericArray<T> = Array<GenericValue<T>>;

export const removeProperties = <T>(
  obj: GenericValue<T>,
  propNames: string[],
): GenericValue<T> => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeProperties(item, propNames));
  }

  const newObj: GenericObject<T> = {};
  for (const [key, value] of Object.entries(obj as GenericObject<T>)) {
    if (typeof value === "object" && value !== null) {
      newObj[key] = removeProperties(value, propNames);
    } else {
      newObj[key] = value;
    }
  }

  propNames.forEach((propName) => {
    if (Object.prototype.hasOwnProperty.call(newObj, propName)) {
      delete newObj[propName];
    }
  });

  return newObj;
};
