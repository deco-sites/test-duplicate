import { MatchContext } from "deco/blocks/matcher.ts";
import { testCanonical } from "$store/sdk/matcher.ts";

export interface Props {
  /**
   * @title Modo de lista
   * @description whitelist - Combina SOMENTE com as urls listadas | blacklist - Combina com qualquer url, EXCETO as listadas
   * @default whitelist
   */
  listType: "whitelist" | "blacklist";

  /**
   * @title Lista de URLs
   * @description Inserir urls levando em consideração o "Modo de lista"
   */
  urls?: string[];
}

/**
 * @title Canonical Matcher - Multiple
 */
export default function MultipleCanonicalMatcher(
  { listType = "whitelist", urls = [] }: Props,
  { request }: MatchContext,
) {
  // Accepts any canonical path if no URL pattern is given
  if (urls.length === 0) return true;

  const { pathname: canonicalPath } = new URL(request.url);
  const isWhiteList = listType === "whitelist";

  // Canonical path matches some URL pattern matches the
  const matches = urls.some((url) => testCanonical(url, canonicalPath));

  return isWhiteList && matches || !isWhiteList && !matches;
}
