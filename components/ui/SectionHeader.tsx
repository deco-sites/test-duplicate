export interface Props {
  title?: string;
  fontSize?: "Small" | "Normal" | "Large";
  description?: string;
  alignment?: "center" | "left";
  colorReverse?: boolean;
}

function Header(props: Props) {
  return (
    <>
      {props.title || props.description
        ? (
          <div
            class={`flex flex-col gap-2 ${
              props.alignment === "left" ? "text-left" : "text-center"
            }`}
          >
            {props.title && (
              <h2 class="text-neutral-700 font-secondary text-2xl font-bold lg:leading-8">
                {props.title}
              </h2>
            )}
            {props.description && <h3 class="leading-5">{props.description}
            </h3>}
          </div>
        )
        : null}
    </>
  );
}

export default Header;
