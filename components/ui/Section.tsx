import type { JSX } from "preact";

/** @title Tamanho da margem */
export type Margin =
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

export interface Layout {
  mobile: {
    /** @title Margem top */
    marginTop?: Margin;

    /** @title Margem bottom */
    marginBottom?: Margin;
  };
  desktop: {
    /** @title Margem top */
    marginTop?: Margin;

    /** @title Margem bottom */
    marginBottom?: Margin;
  };
}

export interface SectionProps {
  /** @title Layout */
  layout?: Layout;

  /**
   * @hide
   * @ignore
   */
  isMobile: boolean;
}

export type Props = SectionProps & JSX.IntrinsicElements["div"];

function Section({ isMobile, layout, ...props }: Props) {
  const selectedLayout = isMobile ? layout?.mobile : layout?.desktop;
  const { marginTop = "0px", marginBottom = "0px" } = selectedLayout ?? {};

  return (
    <div
      style={{ marginTop, marginBottom }}
      {...props}
    />
  );
}

export default Section;
