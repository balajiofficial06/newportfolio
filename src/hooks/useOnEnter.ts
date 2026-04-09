import { useEffect, type RefObject } from "react";

/**
 * Fires callback once when element enters the viewport, then disconnects.
 * Play-once policy: element stays in its revealed state on scroll-up.
 */
export function useOnEnter(
  ref: RefObject<Element | null>,
  callback: () => void,
  threshold = 0.1,
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
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  // callback is intentionally excluded — callers must memoize if needed,
  // but for one-shot reveals a stable inline function is fine.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, threshold]);
}
