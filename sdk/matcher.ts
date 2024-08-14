import { Matcher } from "deco/blocks/matcher.ts";
import { LoaderContext } from "deco/types.ts";

export interface Matchable {
  /** @title Regra de aplicação do conteúdo */
  rule?: Matcher;
}

type Params<T extends Matchable> = {
  items: T[];
  request: Request;
  ctx: LoaderContext;
};

export async function filterByMatcher<T extends Matchable>(
  { items = [], request, ctx }: Params<T>,
) {
  const matchPromises = items.map(({ rule }) => {
    return new Promise<boolean>((resolve) => {
      if (rule) {
        ctx.get(rule).then((matcher) => {
          const matches = matcher({ device: ctx.device, request });
          resolve(matches);
        });
      } else {
        // Keeps the item if no rule was defined
        resolve(true);
      }
    });
  });

  const matches = await Promise.all(matchPromises);

  return items.filter((_, index) => matches[index]);
}

export function testCanonical(matcher: string, canonical: string) {
  const canonicalWithoutHost = canonical.replace(/^https?:\/\/[^/]+/, "");

  return new RegExp("^" + matcher).test(canonicalWithoutHost);
}
