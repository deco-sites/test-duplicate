import Icon from "$store/components/ui/Icon.tsx";
import { useId } from "$store/sdk/useId.ts";
import type { JSX } from "preact";
import { useState } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { HTMLWidget } from "apps/admin/widgets.ts";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";
import { Platform } from "deco-sites/fast-fashion/apps/site.ts";

const subscribe = (
  { email, name, platform }: {
    email: string;
    name: string;
    platform: Platform;
  },
) => {
  switch (platform) {
    case "vtex":
      return invoke.vtex.actions.newsletter.subscribe({ email, name });
    case "wake":
      return invoke.wake.actions.newsletter.register({ email, name });
    default:
      throw new Error("Unknown platform");
  }
};

export interface Input {
  /**
   * @title Label
   */
  label: string;
  /**
   * @title Nome
   * @description Assim como cadastrado no MasterData
   */
  name: string;
  placeholder?: string;
  /**
   * @ignore
   */
  type: "text" | "email";
  /**
   * @ignore
   */
  error?: string;
}

export interface Form {
  name: Input;
  email: Input;
  buttonText?: string;
  /**
   * @format html
   * @title Termos de Uso
   */
  termsOfUse?: HTMLWidget;
}

export interface Props {
  title?: string;
  /** @format textarea */
  description?: string;
  form: Form;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

function Input({
  label,
  placeholder,
  type,
  name,
  loading,
  error,
}: Input & {
  loading: boolean;
}) {
  const id = useId();
  return (
    <div
      class="flex flex-col gap-2 w-full group"
      data-error={error ? "true" : undefined}
    >
      <label htmlFor={id} class="font-bold text-sm">
        {label}
      </label>
      <div class="relative flex h-fit">
        <input
          id={id}
          data-loading={loading ? "true" : undefined}
          class={"w-full bg-white h-12 px-4 outline-none text-sm placeholder:text-gray-400 text-neutral border border-gray-300 data-[loading='true']:border-success-500 data-[loading='true']:text-success-500 group-data-[error='true']:border-danger-500"}
          type={type}
          placeholder={placeholder}
          name={name}
          disabled={loading}
        />
        {loading && (
          <Icon
            id="Check"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            class="w-4 h-4 top-1/2 right-4 -translate-y-1/2 absolute pointer-events-none stroke-success-500"
          />
        )}
      </div>
      {error && <span class="text-xs text-danger-500">{error}</span>}
    </div>
  );
}

function Checkbox({
  label,
  onChange,
}: {
  label: string;
  onChange?: (value: boolean) => unknown;
}) {
  const id = useId();

  return (
    <div class="flex items-center gap-4 w-full">
      <div class="relative w-6 h-6 shrink-0">
        <input
          id={id}
          class="peer appearance-none shrink-0 w-full h-full bg-white outline-none checked:bg-primary-500 border border-gray-300 checked:!border-primary-500 hover:border-neutral-500"
          type="checkbox"
          onChange={(e) => onChange?.(e.currentTarget.checked)}
        />
        <Icon
          id="Check"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          class="w-4 h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute pointer-events-none hidden peer-checked:block stroke-white"
        />
      </div>
      <label
        htmlFor={id}
        class="font-bold prose [&_p]:text-xs [&_a]:text-info [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}

export default function Newsletter({
  title,
  description,
  form,
  sectionProps,
  isMobile,
  platform,
}: Props & { isMobile: boolean; platform: Platform }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setErrors({});

    try {
      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;
      const email = (
        e.currentTarget.elements.namedItem("email") as RadioNodeList
      )?.value;

      const errors: Record<string, string> = {};

      if (!name) {
        errors.name = "Por favor, insira um nome";
      }

      if (!email) {
        errors.email = "Por favor, insira um e-mail";
      }

      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = "Digite um e-mail válido";
      }

      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }

      setLoading(true);

      if (acceptNewsletter) {
        await subscribe({ email, name, platform });
        setSuccess(true);
      } else {
        alert(
          "Você precisa aceitar a nossa Política de Privacidade para prosseguir",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Section isMobile={isMobile} {...sectionProps}>
        <div class="bg-secondary-200 text-secondary-200-content px-5 py-12 md:py-12  text-center">
          <div class="container flex flex-col gap-4 justify-center items-center">
            <div class="font-bold flex flex-col gap-2 items-center justify-center">
              <h2 class="text-2xl font-secondary">
                E-mail cadastrado com sucesso!
              </h2>
              <div>
                <p class="text-sm">Em breve você receberá nossos conteúdos</p>
                <p class="text-sm">exclusivos por e-mail. Aproveite!</p>
              </div>
            </div>
            <button
              class="btn btn-primary px-4 max-[540px]:w-full min-w-[123px] py-3 transition-all"
              onClick={() => setSuccess(false)}
            >
              Voltar
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="bg-secondary-200 text-secondary-200-content py-[46px] md:py-7">
        <div class="container flex flex-col gap-8 justify-center max-w-5xl">
          <div class="flex flex-col items-center">
            {title && (
              <h2 class="text-2xl text-center font-bold lg:leading-8 font-secondary">
                {title}
              </h2>
            )}
            {description && (
              <h3 class="text-sm font-bold text-center">{description}</h3>
            )}
          </div>
          <div class="flex justify-center ">
            {form
              ? (
                <form
                  onSubmit={handleSubmit}
                  autocomplete="on"
                  class="flex flex-col gap-6 md:gap-4 w-full"
                  noValidate
                >
                  <div class="flex flex-col gap-4 md:flex-row">
                    <Input
                      type="text"
                      label="Nome"
                      name="name"
                      loading={loading}
                      placeholder="Digite seu nome"
                      error={errors["name"]}
                    />

                    <Input
                      type="email"
                      label="E-mail"
                      name="email"
                      placeholder="Digite seu email"
                      loading={loading}
                      error={errors["email"]}
                    />

                    {form.termsOfUse
                      ? (
                        <div class="py-2 md:hidden">
                          <Checkbox
                            label={form.termsOfUse}
                            onChange={setAcceptNewsletter}
                          />
                        </div>
                      )
                      : null}
                    <Button
                      class="btn btn-primary md:mt-7 min-w-44"
                      loading={loading}
                      ariaLabel="Enviar"
                      title="Enviar"
                      type="submit"
                    >
                      {form.buttonText}
                    </Button>
                  </div>
                  {form.termsOfUse
                    ? (
                      <div class="md:block hidden">
                        <Checkbox
                          label={form.termsOfUse}
                          onChange={setAcceptNewsletter}
                        />
                      </div>
                    )
                    : null}
                </form>
              )
              : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function NewsletterSkeleton({
  title,
  description,
  sectionProps,
  isMobile,
}: Props & { isMobile: boolean }) {
  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="bg-secondary-200 text-secondary-200-content py-[46px] md:py-7">
        <div class="container flex flex-col gap-8 justify-center max-w-5xl">
          <div class="flex flex-col items-center">
            {title && (
              <h2 class="text-2xl text-center font-bold lg:leading-8 font-secondary">
                {title}
              </h2>
            )}
            {description && (
              <h3 class="text-sm font-bold text-center">{description}</h3>
            )}
            <div class="my-4">
              <span class="loading loading-spinner" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
