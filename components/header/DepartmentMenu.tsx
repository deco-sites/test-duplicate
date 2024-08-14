import { clx } from "$store/sdk/clx.ts";
import { NavElement } from "$store/components/header/NavItem.tsx";
import Icon from "$store/components/ui/Icon.tsx";

const depthClassesMap = {
  0: {
    container: "group/department",
    hover:
      "group-hover/department:opacity-100 group-hover/department:delay-0 group-hover/department:visible",
    link: "group-hover/department:rotate-180",
  },
  1: {
    container: "group/category",
    hover:
      "group-hover/category:opacity-100 group-hover/category:delay-0 group-hover/category:visible",
    link: "group-hover/category:rotate-180",
  },
  2: {
    container: "group/subcategory",
    hover:
      "group-hover/subcategory:opacity-100 group-hover/subcategory:delay-0 group-hover/subcategory:visible",
    link: "group-hover/subcategory:rotate-180",
  },
};

function MenuItemLink({
  name,
  url,
  depth,
  hasChildren,
}: {
  name?: string;
  url?: string;
  depth: number;
  hasChildren?: boolean;
}) {
  return (
    <a
      href={url}
      class="bg-base-100 h-8 pl-6 pr-2 flex items-center gap-2 font-normal justify-between min-w-40"
    >
      <span class="whitespace-pre hover:underline">{name}</span>
      {hasChildren && (
        <Icon
          id="ChevronRight"
          size={24}
          class={clx(
            "transition",
            depthClassesMap[depth as keyof typeof depthClassesMap].link,
          )}
        />
      )}
    </a>
  );
}

function MenuItem({ item, depth }: { item: NavElement; depth: number }) {
  const { url, name, children } = item;

  if (!children || children.length === 0) {
    return (
      <li class="block ">
        <MenuItemLink name={name} url={url} depth={depth} />
      </li>
    );
  }

  return (
    <li
      class={clx(
        depthClassesMap[depth as keyof typeof depthClassesMap].container,
      )}
    >
      <MenuItemLink name={name} url={url} depth={depth} hasChildren />
      <div
        class={clx(
          "opacity-0 invisible absolute top-0 right-0 translate-x-full bg-base-100 transition-all delay-200 py-6 pr-4 shadow-lg",
          depthClassesMap[depth as keyof typeof depthClassesMap].hover,
        )}
      >
        <div class="h-full w-3 bg-base-100 absolute top-0 left-0 -translate-x-2/3">
          <div class="h-5/6 w-px bg-neutral-200 absolute top-1/2 right-0 -translate-y-1/2" />
        </div>
        <ul class="max-h-56 min-h-56 overflow-y-auto scrollbar">
          {children.map((child) => <MenuItem item={child} depth={depth + 1} />)}
        </ul>
      </div>
    </li>
  );
}

function DepartmentMenu({ departments }: { departments: NavElement[] }) {
  return (
    <div class="dropdown dropdown-hover">
      <div tabindex={0} role="button" class="btn btn-ghost ">
        <Icon id="Bars3" size={24} title="Menu de departamentos" />
        <span>Departamentos</span>
      </div>
      <div class="dropdown-content shadow-lg p-0 bg-base-100 py-6 pr-4 z-10">
        <ul class="max-h-56 min-h-56 overflow-y-auto scrollbar">
          {departments.map((department) => (
            <MenuItem item={department} depth={0} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DepartmentMenu;
