import { useId } from "$store/sdk/useId.ts";

const script = (id: string) => {
  const callback = () => {
    const KEY = "store-cookie-consent";
    const ACCEPTED = "accepted";
    const HIDDEN = "translate-y-[200%]";

    const consent = localStorage.getItem(KEY);
    const elem = document.getElementById(id);

    if (consent !== ACCEPTED && elem) {
      const accept = elem.querySelector("[data-button-cc-accept]");
      accept && accept.addEventListener("click", () => {
        localStorage.setItem(KEY, ACCEPTED);
        elem.classList.add(HIDDEN);
      });
      elem.classList.remove(HIDDEN);
    }
  };

  addEventListener("scroll", callback, { once: true });
};

export interface Props {
  /**
   * @title Texto
   * @format html */
  text?: string;
  /**
   * @title Texto do botão de aceitar
   */
  acceptButtonLabel?: string;
}

const DEFAULT_PROPS = {
  text:
    `<p>Este site utiliza cookies para personalizar a sua experiência. Ao continuar navegando, você concorda com a nossa <a data-mce-href="../../../institucional/quem-somos" href="../../../institucional/quem-somos">política de utilização de cookies</a>.</p>`,
  acceptButtonLabel: "Ok, prosseguir",
};

function CookieConsent(props: Props) {
  const id = useId();
  const { text, acceptButtonLabel } = {
    ...DEFAULT_PROPS,
    ...props,
  };

  return (
    <>
      <div
        id={id}
        class="transform-gpu left-1/2 shadow-lg bg-base-100 -translate-x-1/2 translate-y-[200%] transition fixed bottom-0 lg:bottom-2 z-50 lg:flex w-full max-w-2xl px-[15px] py-[10px] lg:px-[30px] lg:py-[20px] flex flex-col text-center lg:text-left lg:flex-row gap-4 items-center border border-neutral-300"
      >
        <div
          class="text-sm [&_a]:font-bold [&_a:hover]:underline"
          dangerouslySetInnerHTML={{ __html: text }}
        />

        <button class="btn btn-primary h-[50px]" data-button-cc-accept>
          {acceptButtonLabel}
        </button>
      </div>
      <script
        defer
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${script})("${id}");` }}
      />
    </>
  );
}

export default CookieConsent;
