import { usePartialSection } from "deco/hooks/usePartialSection.ts";
import { useId } from "preact/hooks";
import {
  NewsletterSkeleton,
  Props as NewsletterProps,
} from "../../components/footer/Newsletter.tsx";
import Newsletter from "$store/islands/Newsletter.tsx";
import { AppContext } from "deco-sites/fast-fashion/apps/site.ts";
import { useScriptAsDataURI } from "deco/hooks/useScript.ts";
import { usePlatform } from "deco-sites/fast-fashion/sdk/usePlatform.tsx";

export interface Props extends NewsletterProps {
  /** @ignore */
  display?: boolean;
}

const script = (
  id: string,
) => {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (document.readyState !== "complete") {
          document.addEventListener("DOMContentLoaded", () => {
            // @ts-expect-error trustme, I'm an engineer
            entry.target.click();
          });

          return;
        }
        // @ts-expect-error trustme, I'm an engineer
        entry.target.click();
      }
    }
  }, { rootMargin: "200px" }).observe(element);
};

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

/**
 * @title Newsletter
 */
export default function DeferredNewsletter(
  { display, ...props }: ReturnType<typeof loader>,
) {
  const sectionID = useId();
  const buttonId = `deferred-${sectionID}`;
  const partial = usePartialSection<typeof DeferredNewsletter>({
    props: { display: true },
  });
  const platform = usePlatform();

  if (display) {
    return <Newsletter platform={platform} {...props} />;
  }

  return (
    <>
      <button
        {...partial}
        id={buttonId}
        class="flex"
        data-deferred
        aria-label={`Deferred Section - ${sectionID}`}
      />
      <NewsletterSkeleton {...props} />
      <script
        defer
        src={useScriptAsDataURI(
          script,
          buttonId,
        )}
      />
    </>
  );
}
