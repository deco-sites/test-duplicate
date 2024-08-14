import { useContext } from "preact/hooks";
import { SectionContext } from "deco/components/section.tsx";

export default function useEnvironment() {
  const sectionContext = useContext(SectionContext);

  const isPreview = sectionContext?.context?.state.debugEnabled;

  return {
    isPreview,
  };
}
