import { usePlatform } from "deco-sites/fast-fashion/sdk/usePlatform.tsx";
import VtexLogin from "deco-sites/fast-fashion/islands/header/Login/vtex.tsx";
import WakeLogin from "deco-sites/fast-fashion/islands/header/Login/wake.tsx";

export default function Login() {
  const platform = usePlatform();

  if (platform === "vtex") {
    return <VtexLogin />;
  }

  if (platform === "wake") {
    return <WakeLogin />;
  }

  throw new Error("Unknown platform");
}
