import Icon from "$store/components/ui/Icon.tsx";
import { NavElement } from "$store/components/header/NavItem.tsx";
import Login from "$store/components/header/Login.tsx";
import CloseMenuButton from "$store/components/header/Buttons/CloseMenu.tsx";
import { clx } from "deco-sites/fast-fashion/sdk/clx.ts";

export interface Props {
  items: NavElement[];
}

function MenuItem({ item, level = 0 }: { item: NavElement; level: number }) {
  if (item.children?.length === 0 || !item.children) {
    return (
      <div>
        <a
          class={clx(
            "collapse-title flex border-b border-solid border-base-100",
            level === 1 && "bg-primary-200 text-primary-200-content",
            level === 2 && "bg-primary-100 text-primary-100-content",
          )}
          href={item.url}
        >
          {item.name}
        </a>
      </div>
    );
  }

  return (
    <div
      class="collapse rounded-none collapse-arrow"
      data-level={level}
    >
      <input type="checkbox" />
      <div
        class={clx(
          "collapse-title text-primary-content border-b border-solid border-base-100 pt-5",
          level === 0 && "font-bold",
          level === 1 && "bg-primary-200 !text-primary-200-content",
          level === 2 && "bg-primary-100 text-primary-100-content",
        )}
      >
        {item.name}
      </div>
      <div
        class={clx(
          "collapse-content px-0 !pb-0",
        )}
      >
        <ul class="">
          <li>
            <a
              class={clx(
                "collapse-title flex border-b border-solid border-base-100",
                level === 0 && "bg-primary-200 text-primary-200-content",
                level === 1 && "bg-primary-100 text-primary-100-content",
              )}
              href={item.url}
            >
              Ver todos
            </a>
          </li>

          {item.children?.map((node) => (
            <li class="!font-normal">
              <MenuItem item={node} level={level + 1} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Menu({ items }: Props) {
  return (
    <div class="relative flex flex-col h-full w-[80vw] max-h-screen overflow-auto text-sm">
      <div class="absolute top-0 right-0">
        <CloseMenuButton />
      </div>

      <ul class="flex flex-col py-2 bg-base-200 divide-y divide-neutral-300">
        <li>
          <Login />
        </li>
        <li>
          <a class="flex items-center gap-4 p-4" href="/conta">
            <Icon id="Account" size={24} class="text-primary" />
            <span class="text-sm">Minha conta</span>
          </a>
        </li>
        <li>
          <a class="flex items-center gap-4 p-4" href="/pedidos">
            <Icon id="Orders" size={24} class="text-primary" />
            <span class="text-sm">Meus pedidos</span>
          </a>
        </li>
        <li>
          <a class="flex items-center gap-4 p-4" href="/wishlist">
            <Icon id="HeartLine" size={24} class="text-primary" />
            <span class="text-sm">Favoritos</span>
          </a>
        </li>
      </ul>

      <ul class="flex flex-col bg-primary">
        {items.map((item) => (
          <li>
            <MenuItem item={item} level={0} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
