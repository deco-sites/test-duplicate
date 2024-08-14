import { useUser } from "apps/vtex/hooks/useUser.ts";
import BaseLogin from "./common.tsx";

export default function VtexLogin() {
  const { user, loading } = useUser();

  return <BaseLogin email={user.value?.email} loading={loading.value} />;
}
