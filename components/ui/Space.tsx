import { LoaderContext } from "deco/types.ts";

/** @title Tamanho da margem */
export type Size =
  | "0px"
  | "1px"
  | "2px"
  | "4px"
  | "8px"
  | "16px"
  | "24px"
  | "32px"
  | "40px"
  | "64px"
  | "128px";

/** @title Configurações da seção */
export interface Props {
  /** @title Tamanho */
  size?: {
    desktop?: Size;
    mobile?: Size;
  };
}

export function loader(props: Props, _request: Request, ctx: LoaderContext) {
  const isMobile = ctx.device !== "desktop";
  return { ...props, isMobile };
}

function Space({ size, isMobile }: ReturnType<typeof loader>) {
  const { desktop, mobile } = size ?? {};

  const height = isMobile ? mobile : desktop;

  return <div class="w-full bg-transparent" style={{ height }} />;
}

export default Space;
