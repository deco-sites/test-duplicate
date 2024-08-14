import Image from "apps/website/components/Image.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { clx } from "$store/sdk/clx.ts";

/** @title {{name}} */
export interface NavSubLeaf {
  /**
   * @title Nome
   */
  name: string;
  /**
   * @title Url
   */
  url: string;
  /**
   * @title Children
   */
}

/** @titleBy name */
export interface NavLeaf {
  /**
   * @title Nome
   */
  name: string;
  /**
   * @title Url
   */
  url: string;
  /**
   * @title Children
   */
  children?: NavSubLeaf[];
}

export interface NavElement extends NavLeaf {
  /**
   * @title Submenu
   */
  children?: NavLeaf[];
  /**
   * @title Imagem
   * @description Imagem que será exibida no submenu (280x232 pixels)
   * @format image-uri
   */
  image?: string;
}

function NavItem(
  { item, openTo = "right" }: { item: NavElement; openTo: "left" | "right" },
) {
  const { url, name, children, image } = item;

  return (
    <li
      class={clx(
        "dropdown-hover dropdown",
        openTo === "left" && "dropdown-end",
      )}
    >
      <a tabindex={0} role="button" href={url} class="block py-4 px-3">
        <span class="font-bold">{name}</span>
      </a>
      {children && children.length > 0 && (
        <div
          tabindex={0}
          class="dropdown-content dropdown shadow-lg w-max flex gap-8 bg-white p-6 relative"
        >
          {image && (
            <div>
              <Image
                src={image}
                alt={name}
                width={280}
                height={232}
                loading="lazy"
              />
            </div>
          )}
          <ul class="flex items-start flex-col max-h-[232px] min-h-[232px] overflow-y-auto scrollbar">
            {children.map((node) => (
              <li class="group/subitem">
                <a
                  class="flex items-center justify-between hover:underline min-w-32 py-2.5 pr-1"
                  href={node.url}
                >
                  <span>{node.name}</span>
                  {node.children && node.children.length > 0 && (
                    <Icon
                      id="ChevronRight"
                      size={24}
                      class=""
                    />
                  )}
                </a>
                {node.children && node.children.length > 0 && (
                  <ul class="absolute top-0 right-0 translate-x-full bg-base-100 max-h-[280px] min-h-[280px] opacity-0 invisible p-6 group-hover/subitem:opacity-100 group-hover/subitem:delay-0 group-hover/subitem:visible transition-all delay-200 shadow-lg">
                    <div class="h-full w-3 bg-base-100 absolute top-0 left-0 -translate-x-2/3">
                      <div class="h-5/6 w-px bg-neutral-200 absolute top-1/2 right-0 -translate-y-1/2" />
                    </div>
                    {node.children.map((subnode) => (
                      <li>
                        <a
                          class="block hover:underline min-w-32 py-2.5"
                          href={subnode.url}
                        >
                          {subnode.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
