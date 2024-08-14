import Icon from "$store/components/ui/Icon.tsx";
import { Section } from "deco/blocks/section.ts";

export interface Props {
  /**
   *  @title Telefone
   */
  phone?: string;

  /**
   *  @title Email
   */
  email?: string;

  /**
   *  @title hide
   * @ignore
   */
  term?: string;
  /**
   *  @title Prateleira da página não encontrada
   */
  notFoundShelf?: Section;
}

export default function NotFound(
  {
    phone = "(00) 0000-0000",
    email = "atendimento@loja.com.br",
    term,
    notFoundShelf,
  }: Props,
) {
  const ShelfComponent = notFoundShelf?.Component;
  const shelfProps = notFoundShelf?.props;

  return (
    <div class="flex flex-col">
      <div class="py-10 bg-neutral-200">
        <div class="container text-neutral-600 flex flex-col items-center gap-9">
          <div class="flex flex-col justify-center items-center text-center gap-3">
            {term
              ? (
                <h1 class="font-bold text-xl font-secondary">
                  Ops... Infelizmente não encontramos o resultado para{" "}
                  <span>"{term}"</span>
                </h1>
              )
              : (
                <h1 class="font-bold text-xl">
                  Ops... Infelizmente não encontramos o resultado para a busca
                  realizada
                </h1>
              )}

            <h2 class="">Siga as dicas abaixo e tente novamente:</h2>

            <div class="">
              <p>1. Busque por palavras ou termos menos específicos;</p>
              <p>2. Tente palavras ou termos diferentes;</p>
              <p>
                3. Verifique a ortografia do termo buscado.
              </p>
            </div>

            <p class="font-bold">
              Caso ainda não consiga encontrar o que procura, entre em contato
              conosco pelos canais:
            </p>

            <div class="flex-col md:flex-row flex justify-center items-center gap-3 xl:gap-10">
              <p class="flex items-center gap-3 hover:cursor-pointer">
                <Icon id="Phone" width={24} height={24} />
                <a href={``} class="text-info">{phone}</a>
              </p>
              <p class="flex items-center gap-3 hover:cursor-pointer">
                <Icon id="Email" width={24} height={24} />
                <span class="text-info">{email}</span>
              </p>
            </div>
          </div>

          <a
            href="/"
            class="p-2 w-52 h-12 flex items-center justify-center border border-primary-500 duration-150 hover:bg-primary-500 hover:text-primary-content text-neutral-600 text-sm font-bold"
          >
            Voltar para a Home
          </a>
        </div>
      </div>

      {ShelfComponent && <ShelfComponent {...shelfProps} />}
    </div>
  );
}
