import Icon from "$store/components/ui/Icon.tsx";
// import { useUser } from "apps/vtex/hooks/useUser.ts";
import { useUser } from "apps/wake/hooks/useUser.ts";

function Login() {
  const { user } = useUser();
  const isLoggedIn = !!user.value?.email;

  return (
    <a
      class="flex items-center gap-2 h-10 max-lg:gap-4 max-lg:p-4 max-md:h-auto leading-[18px]"
      href="/conta"
      aria-label="Conta"
    >
      <Icon id="User" size={24} class={"text-primary"} title="Usuário" />
      {isLoggedIn
        ? (
          <div class="flex items-center gap-2">
            <div class="flex flex-col">
              <span>Olá cliente,</span>
              <span>Boas vindas!</span>
            </div>
            <a href="/logout" class="text-danger-400 flex h-full">
              [sair]
            </a>
          </div>
        )
        : (
          <div class="flex flex-col">
            <span>Boas vindas visitante,</span>
            <span>
              <strong>Faça Login</strong> ou <strong>Cadastre-se</strong>
            </span>
          </div>
        )}
    </a>
  );
}

export default Login;
