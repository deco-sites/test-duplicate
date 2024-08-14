import {
  CommonContactForm,
  ContactFormData,
} from "$store/components/forms/contact/Common.tsx";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";

export function WakeContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    await invoke.wake.actions.submmitForm({
      body: data,
    });
  };

  return <CommonContactForm onSubmit={handleSubmit} />;
}
