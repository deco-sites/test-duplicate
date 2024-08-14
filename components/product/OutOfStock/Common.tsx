import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { useId } from "$store/sdk/useId.ts";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

export interface Props {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
}

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
    <div class="flex flex-col gap-2 w-full">
      <label htmlFor={id} class="font-bold text-sm">
        {label}
      </label>
      <div class="relative flex h-fit">
        <input
          id={id}
          data-error={error ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
          class={"w-full bg-white h-12 px-4 outline-none text-sm placeholder:text-gray-400 border border-gray-300 data-[loading='true']:border-success-500 data-[loading='true']:text-success-500 data-[error='true']:border-danger-500 data-[error='true']:text-danger-500"}
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

function OutOfStockCommon({ onSubmit }: Props) {
  const loading = useSignal(false);
  const errors = useSignal<Record<string, string>>({});
  const success = useSignal(false);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;

      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;
      const email = (
        e.currentTarget.elements.namedItem("email") as RadioNodeList
      )?.value;

      const newErrors: Record<string, string> = {};

      if (!name) {
        newErrors.name = "Por favor, insira um nome";
      }

      if (!email) {
        newErrors.email = "Por favor, insira um e-mail";
      }

      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = "Digite um e-mail válido";
      }

      if (Object.keys(newErrors).length > 0) {
        errors.value = newErrors;
        return;
      }

      await onSubmit({ name, email });

      success.value = true;
      errors.value = {};
      e.currentTarget.reset();
    } finally {
      loading.value = false;
    }
  };

  return (
    <form
      class="form-control justify-start gap-4 text-neutral-500 text-sm"
      onSubmit={handleSubmit}
    >
      <span class="font-bold">Este produto está indisponível no momento</span>
      <span class="">
        Quer ser informado quando esse produto estiver disponível? Preencha os
        dados abaixo que nós te avisamos ;)
      </span>

      <Input
        label="Nome"
        name="name"
        type="text"
        placeholder="Digite seu nome"
        loading={loading.value}
        error={errors.value.name}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Digite seu e-mail"
        loading={loading.value}
        error={errors.value.email}
      />

      <Button
        class="btn btn-outline btn-primary disabled:loading group"
        disabled={loading.value}
        type="submit"
      >
        <span class="text-neutral group-hover:text-primary-content">
          Avise-me quando chegar
        </span>
      </Button>
      {success.value && (
        <span class="text-success-500 font-bold">
          E-mail cadastrado com sucesso!
        </span>
      )}
    </form>
  );
}

export default OutOfStockCommon;
