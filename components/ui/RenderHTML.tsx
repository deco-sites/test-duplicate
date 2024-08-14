import type { ComponentType, JSX } from "preact";

interface Props extends JSX.HTMLAttributes {
  html: string;
  as?: keyof JSX.IntrinsicElements;
}

export function RenderHTML({ html, as = "div", ...restProps }: Props) {
  const Component = as as unknown as ComponentType<JSX.HTMLAttributes>;

  return (
    <Component
      dangerouslySetInnerHTML={{ __html: html }}
      {...restProps}
    />
  );
}
