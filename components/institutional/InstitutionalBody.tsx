import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  /**
   *  @title Título
   */
  title: string;
  /**
   *  @title Imagem
   */
  image?: {
    src?: ImageWidget;
    alt?: string;
  };
  /**
   *  @title Conteúdo
   */
  text: HTMLWidget;
}

export default function InstitutionalText({ title, text, image }: Props) {
  return (
    <div class="flex flex-col gap-4 text-neutral-700">
      <h1 class="text-neutral-700 text-2xl font-bold border-b border-neutral-700 pb-4 font-secondary">
        {title}
      </h1>
      {image && image.src && (
        <Image
          class=""
          alt={image.alt}
          src={image.src}
          width={861}
          height={240}
        />
      )}

      <div
        class=""
        dangerouslySetInnerHTML={{ __html: text }}
      >
      </div>
    </div>
  );
}
