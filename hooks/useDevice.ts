import { useContext } from "preact/hooks";
import { SectionContext } from "deco/components/section.tsx";

export default function useDevice() {
  const sectionContext = useContext(SectionContext);

  const isPreview = sectionContext?.context?.state.debugEnabled;
  const isMobile = sectionContext?.device !== "desktop";
  const isMac = sectionContext?.request?.headers.get("user-agent")?.includes(
    "Macintosh",
  );

  return {
    isPreview,
    isMobile,
    isMac,
  };
}
