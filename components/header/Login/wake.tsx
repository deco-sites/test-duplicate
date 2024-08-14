import { useUser } from "apps/wake/hooks/useUser.ts";
import BaseLogin from "./common.tsx";

export default function WakeLogin() {
  const { user, loading } = useUser();

  return <BaseLogin email={user.value?.email} loading={loading.value} />;
}
