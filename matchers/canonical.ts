import { MatchContext } from "deco/blocks/matcher.ts";

export interface Props {
  matcher?: string;
}

/**
 * @title Canonical Matcher
 */
export default function CanonicalMatcher(
  { matcher }: Props,
  { request }: MatchContext,
) {
  if (!matcher) return true;
  const withoutHost = new URL(request.url).pathname;

  return new RegExp(`^${matcher}`).test(withoutHost);
}
