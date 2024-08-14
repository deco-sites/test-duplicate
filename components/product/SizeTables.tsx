import Icon from "$store/components/ui/Icon.tsx";
import { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "$store/sdk/clx.ts";

/** @title {{title}} */
export interface TableCol {
  /** @title Titulo da coluna */
  title: string;
  /** @title Valores da coluna*/
  values: string[];
}

/** @title Tabela */
export interface Table {
  /** @title Colunas */
  cols: TableCol[];
}

/** @title Imagem */
export interface Image {
  /**
   *  @title Imagem
   * @format image-uri
   */
  image: string;
  /** @title Altura */
  height: number;
  /** @title Largura */
  width: number;
}

/** @title {{matchBy}}: {{id}} */
export interface SizeTable {
  matchBy: "categoryId" | "productId" | "matchAll";
  id?: string;
  /** @title Tabelas de Medidas */
  sizeTable: Table | Image;
}

export interface Props {
  product: Product;
  tables: SizeTable[];
}

const isImage = (table: Table | Image): table is Image => {
  return "image" in table;
};

const isTable = (table: Table | Image): table is Table => {
  return "cols" in table;
};

function Trigger() {
  return (
    <label
      for="sizes_modal"
      class="text-neutral-500 flex gap-2 item-center"
    >
      <span class="font-normal text-xs leading-[14px] underline cursor-pointer">
        Tabela de Medidas
      </span>
      <Icon id="ChevronDown" size={16} />
    </label>
  );
}

function Modal({ product, tables }: Props) {
  const productId = product.isVariantOf?.productGroupID ?? product.productID;
  const categoryIds = product.additionalProperty
    ?.filter((property) => property.name === "category")
    .map((property) => property.propertyID) ?? [];

  let tableToRender: Table | Image | undefined;

  for (const table of tables) {
    if (table.matchBy === "matchAll") {
      tableToRender = table.sizeTable;
    }

    if (table.matchBy === "categoryId") {
      for (const categoryId of categoryIds) {
        if (table.id === categoryId) {
          tableToRender = table.sizeTable;
        }
      }
    }

    if (table.matchBy === "productId" && table.id === productId) {
      tableToRender = table.sizeTable;
    }
  }

  if (!tableToRender) return null;

  return (
    <>
      <input type="checkbox" id="sizes_modal" class="modal-toggle" />
      <div class="modal" role="dialog">
        <div class="modal-box p-0 rounded-none max-w-[497px]">
          <div class="flex justify-between items-center pl-[30px] bg-primary text-primary-content py-1.5">
            <h3 class="text-lg font-bold flex items-center gap-2.5">
              <Icon id="Rule" size={32} />
              Tabela de Medidas
            </h3>
            <label class="btn btn-ghost" for="sizes_modal">
              <Icon id="Close" size={24} />
            </label>
          </div>
          <div class="p-5 font-normal">
            {isImage(tableToRender) && (
              <Image
                src={tableToRender.image}
                height={tableToRender.height}
                width={tableToRender.width}
              />
            )}
            {isTable(tableToRender) && (
              <div class="flex">
                {tableToRender.cols.map((col, index, _) => (
                  <div class="flex-1 text-center">
                    <div class={clx("py-3", index === 0 && "uppercase")}>
                      {col.title}
                    </div>
                    {col.values.map((value, index, array) => (
                      <div
                        class={clx(
                          "py-3",
                          index !== array.length - 1 &&
                            "border-b border-neutral-300",
                        )}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <span class="text-neutral-500 mt-2 block">medidas em cm</span>
          </div>
        </div>
        <label class="modal-backdrop" for="sizes_modal">
          Close
        </label>
      </div>
    </>
  );
}

const SizeTables = {
  Trigger,
  Modal,
};

export default SizeTables;
