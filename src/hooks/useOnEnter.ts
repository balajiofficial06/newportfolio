import { useEffect, type RefObject } from "react";

/**
 * Fires callback once when element enters the viewport, then disconnects.
 * Play-once policy: element stays in its revealed state on scroll-up.
 *
 * rootMargin shrinks the effective viewport — "0px 0px -30% 0px" means the
 * observer fires when the element's top edge crosses 70% down the viewport
 * (i.e. the element has entered 30% of the viewport from the bottom).
 */
export function useOnEnter(
  ref: RefObject<Element | null>,
  callback: () => void,
  rootMargin = "0px 0px -30% 0px",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          try {
            callback();
          } catch (e) {
            console.error("useOnEnter callback threw:", e);
          }
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  // callback is intentionally excluded — callers must memoize if needed,
  // but for one-shot reveals a stable inline function is fine.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, rootMargin]);
}
