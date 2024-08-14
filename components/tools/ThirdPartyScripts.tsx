import { useEffect } from "preact/hooks";
import { asset } from "$fresh/runtime.ts";

/**
 * @title Dados do script
 * @titleBy url
 */
export interface ScriptProps {
  /**
   * @title URL
   */
  url: string;

  /**
   * @title ID do script
   */
  htmlID: string;

  /**
   * @title Delay de execução
   * @description Tempo (em milisegundos) até que o script seja carregado
   */
  delay?: number;

  /**
   * @title Ativo?
   * @description Ativa/Desativa a execução do script
   */
  active?: boolean;
}

export interface Props {
  /**
   * @title Scripts
   */
  scriptDataArray?: ScriptProps[];
}

function ThirdPartyScripts(
  { scriptDataArray = [] }: Props,
) {
  useEffect(() => {
    scriptDataArray.forEach(
      ({ url, htmlID, delay = 1000, active = true }) => {
        if (!active) return;

        url = url.startsWith("/") ? asset(url) : url;

        const _script = document.createElement("script");
        _script.src = url;
        _script.id = htmlID;
        _script.async = true;

        setTimeout(() => {
          document.body.appendChild(_script);
        }, delay);
      },
    );
  }, []);

  return null;
}

export default ThirdPartyScripts;
