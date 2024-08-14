import {
  CommonContactForm,
  ContactFormData,
} from "$store/components/forms/contact/Common.tsx";
import { invoke } from "deco-sites/fast-fashion/runtime.ts";

export function VtexContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    await invoke.vtex.actions.masterdata.createDocument({
      acronym: "FC",
      data: data as Record<string, unknown>,
    });
  };

  return <CommonContactForm onSubmit={handleSubmit} />;
}
