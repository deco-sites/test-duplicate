import { _platform } from "deco-sites/fast-fashion/apps/site.ts";
import { VtexContactForm } from "$store/islands/forms/contact/Vtex.tsx";
import { WakeContactForm } from "$store/islands/forms/contact/Wake.tsx";

export default function ContactForm() {
  if (_platform === "vtex") return <VtexContactForm />;
  if (_platform == "wake") return <WakeContactForm />;

  return null;
}
