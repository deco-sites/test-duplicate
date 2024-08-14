import CopyButton from "$store/islands/CopyButton.tsx";
import { asset } from "$fresh/runtime.ts";

export interface ShareOptions {
  /**
   * @title Compartilhar via Pinterest
   */
  showPinterestButton?: boolean;
  /**
   * @title Compartilhar via Facebook
   */
  showFacebookButton?: boolean;
  /**
   * @title Compartilhar via Whatsapp
   */
  showWhatsappButton?: boolean;
  /**
   * @title Compartilhar via Twitter
   */
  showTwitterButton?: boolean;
  /**
   * @title Copiar link
   */
  showCopyButton?: boolean;
}

interface Props {
  options: ShareOptions;
  url: string;
  productImageURL?: string;
}

export function Share({ options, url, productImageURL }: Props) {
  const encodedURI = encodeURI(url);

  return (
    <div class="flex gap-6 items-center text-xs">
      <span class="text-sm font-bold">Compartilhe:</span>
      <div class="flex items-start gap-3">
        {options.showFacebookButton && (
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURI}`}
            title="Publicar no Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <img
              class="h-8 w-8"
              src={asset("/image/facebook.svg")}
              alt="Facebook"
              loading="lazy"
              height={32}
              width={32}
            />
          </a>
        )}
        {options.showWhatsappButton && (
          <a
            href={`https://api.whatsapp.com/send?text=${encodedURI}`}
            title="Compartilhar no Whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <img
              class="h-8 w-8"
              src={asset("/image/wpp.svg")}
              height={32}
              width={32}
              alt="Whatsapp"
              loading="lazy"
            />
          </a>
        )}
        {options.showPinterestButton && (
          <a
            href={`http://pinterest.com/pin/create/button/?url=${encodedURI}&media=${productImageURL}`}
            target="_blank"
            rel="noreferrer"
            title="Salvar no Pinterest"
          >
            <img
              class="h-8 w-8"
              src={asset("/image/pinterest.svg")}
              alt="Pinterest"
              loading="lazy"
              height={32}
              width={32}
            />
          </a>
        )}
        {options.showTwitterButton && (
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedURI}`}
            title="Publicar no Twitter"
            target="_blank"
            rel="noreferrer"
          >
            <img
              class="h-8 w-8"
              src={asset("/image/x.svg")}
              alt="Pinterest"
              loading="lazy"
              height={32}
              width={32}
            />
          </a>
        )}
        {options.showCopyButton && <CopyButton contentToCopy={url} />}
      </div>
    </div>
  );
}
