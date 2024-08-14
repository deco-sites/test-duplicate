import { LoaderContext } from "deco/types.ts";
import { Section } from "deco/blocks/section.ts";
import Icon from "$store/components/ui/Icon.tsx";

/** @titleBy title */

interface Content {
  /**
   *  @title Título usado para o menu
   */
  title: string;
  /**
   *  @title Slug da página
   */
  slug: string;
  /**
   *  @title Conteúdo ao lado direito
   */
  body: Section[];
}

interface Props {
  /**
   *  @title Lista de itens
   */
  contents: Content[];
}

export const loader = (props: Props, req: Request, _: LoaderContext) => {
  const url = new URL(req.url);

  const matcher = url.pathname.match(/\/institucional\/([^\/?]+)\/?/);

  const slug = matcher && matcher[1];

  const filteredContents = props.contents.filter((content) => {
    return content.slug === slug;
  });

  return { ...props, filteredContents };
};

export default function Institutional(
  { contents, filteredContents }: ReturnType<typeof loader>,
) {
  return (
    <div class="container flex flex-col gap-12 my-10 xl:my-14 xl:mt-7">
      <div class="flex items-center gap-2 text-neutral-600 text-sm font-secondary">
        <a href="/" class="flex gap-2 items-center">
          <Icon id="Home" width={24} height={24} class="text-neutral-600" />
          <span>Home</span>
        </a>
        <Icon
          id="ChevronRight"
          width={24}
          height={24}
          class="text-neutral-600"
        />

        <p class="font-bold">{filteredContents[0]?.title}</p>
      </div>

      <div class="flex flex-col xl:flex-row gap-10 xl:gap-24">
        <nav class="gap-2 flex flex-col w-full xl:w-80 flex-shrink-0">
          <input
            id={"institucionalMenu"}
            type={"checkbox"}
            class="peer hidden"
          />
          <label
            class={"cursor-pointer xl:hidden w-full px-4 h-12 flex items-center justify-between bg-primary-500 text-primary-content font-bold uppercase"}
            htmlFor="institucionalMenu"
          >
            <span>Menu institucional</span>
            <Icon
              width={24}
              height={24}
              id="ChevronRight"
              class="rotate-90"
            />
          </label>

          <div class="gap-2 flex flex-col duration-150 max-xl:h-0 max-xl:opacity-0 max-xl:pointer-events-none peer-checked:h-auto peer-checked:opacity-100 peer-checked:pointer-events-auto">
            {contents.map(({ slug, title }) => {
              return (
                <a
                  data-active={filteredContents[0]?.slug === slug}
                  class="flex items-center pl-4 border border-neutral-300 h-12 uppercase text-neutral-700 data-[active=true]:border-primary-500 data-[active=true]:border-l-8 data-[active=true]:font-bold hover:border-primary-500 hover:font-bold hover:border-l-8"
                  href={slug}
                >
                  {title}
                </a>
              );
            })}
          </div>
        </nav>

        <div class="w-full">
          {filteredContents[0].body.map(({ Component, props }) => (
            <Component {...props} />
          ))}
        </div>
      </div>
    </div>
  );
}
