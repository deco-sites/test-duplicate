import type { ComponentChildren, JSX } from "preact";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";

function Dot({ index, children }: {
  index: number;
  children: ComponentChildren;
}) {
  return (
    <button
      data-dot={index}
      aria-label={`Ir para o item ${index + 1}`}
      title={`Ir para o item ${index + 1}`}
      class="focus:outline-none group"
    >
      {children}
    </button>
  );
}

function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

function NextButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-slide="next"
      aria-label="Próximo item"
      title="Próximo item"
      {...props}
    />
  );
}

function PrevButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-slide="prev"
      aria-label="Item anterior"
      title="Item anterior"
      {...props}
    />
  );
}

function Thumbs(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-thumbs {...props} />;
}

function ThumbItem(
  { index, children, class: _class = "" }: {
    index: number;
    children: ComponentChildren;
    class?: string;
  } & JSX.IntrinsicElements["button"],
) {
  return (
    <button
      data-thumb-item={index}
      aria-label={`go to slider item ${index}`}
      class={clx("focus:outline-none group", _class)}
    >
      {children}
    </button>
  );
}

Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;

Slider.Thumbs = Thumbs;
Slider.ThumbItem = ThumbItem;

export default Slider;
