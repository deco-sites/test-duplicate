import type { AnalyticsEvent } from "apps/commerce/types.ts";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";

export const sendEvent = <E extends AnalyticsEvent>(event: E) => {
  if (
    typeof window.DECO?.events?.dispatch !== "function"
  ) {
    console.info(
      "Cannot find Analytics section in your page. Press `.` to add Analytics and supress this warning",
    );

    return;
  }
  window.DECO?.events?.dispatch(event);

  // @ts-ignore - This is a global variable that is used by Google Tag Manager
  // console.log("event", JSON.stringify(event, " ", 2));
};

/**
 * This function is usefull for sending events on click. Works with both Server and Islands components
 */
export const SendEventOnClick = <E extends AnalyticsEvent>({
  event,
  id,
}: {
  event: E;
  id: string;
}) => (
  <script
    defer
    type="module"
    dangerouslySetInnerHTML={{
      __html:
        `addEventListener("load", () => document.getElementById("${id}")?.addEventListener("click", () => (${sendEvent})(${
          JSON.stringify(
            event,
          )
        })))`,
    }}
  >
  </script>
);

/**
 * This componente should be used when want to send event for rendered componentes.
 * This behavior is usefull for view_* events.
 */
export const SendEventOnLoad = <E extends AnalyticsEvent>({
  event,
}: {
  event: E;
}) => (
  <script
    defer
    type="module"
    dangerouslySetInnerHTML={{
      __html: `addEventListener("load", () => (${sendEvent})(${
        JSON.stringify(
          event,
        )
      }))`,
    }}
  />
);

export const SendEventOnView = <E extends AnalyticsEvent>(
  { event, id }: { event: E; id: string },
) => (
  <script
    defer
    src={scriptAsDataURI(
      (id: string, event: E) => {
        const elem = document.getElementById(id);

        if (!elem) {
          return console.warn(
            `Could not find element ${id}. Click event will not be send. This will cause loss in analytics`,
          );
        }

        const observer = new IntersectionObserver((items) => {
          for (const item of items) {
            if (!item.isIntersecting) continue;

            window.DECO.events.dispatch(event);
            observer.unobserve(elem);
          }
        });

        observer.observe(elem);
      },
      id,
      event,
    )}
  />
);
