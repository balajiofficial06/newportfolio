import { useEffect, useState } from "react";

const SECTION_IDS = ["about", "skills", "projects", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

/**
 * Returns the id of the section currently most visible in the viewport.
 * Updates as the user scrolls.
 */
export function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.4 },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}
