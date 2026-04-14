import { useRef, useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { SectionTitle, Section } from "../utils/Atoms";

/* ---------- Animations ---------- */

const pulseAnim = keyframes`
  0%   { box-shadow: 0 0 0 0   rgba(0, 242, 255, 0.45); }
  70%  { box-shadow: 0 0 0 14px rgba(0, 242, 255, 0); }
  100% { box-shadow: 0 0 0 0   rgba(0, 242, 255, 0); }
`;

/* ---------- Styled Components ---------- */

const TimelineWrapper = styled.div`
  position: relative;
  padding-left: 40px;

  @media (max-width: 480px) {
    padding-left: 28px;
  }
`;

const FilamentSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  overflow: visible;
  pointer-events: none;
`;

const JourneyItem = styled.div<{ $revealed: boolean }>`
  position: relative;
  margin-bottom: 8rem;
  opacity: ${({ $revealed }) => ($revealed ? 1 : 0)};
  transform: ${({ $revealed }) =>
    $revealed ? "translateY(0)" : "translateY(28px)"};
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 3.5rem;
  }
`;

const Node = styled.div<{ $revealed: boolean }>`
  position: absolute;
  left: -46px;
  top: 10px;
  width: 16px;
  height: 16px;

  @media (max-width: 480px) {
    left: -34px;
    width: 12px;
    height: 12px;
  }
  border-radius: 50%;
  z-index: 10;
  transition:
    background 0.4s ease,
    border-color 0.4s ease,
    box-shadow 0.4s ease;

  background: ${({ $revealed }) =>
    $revealed ? "var(--neon-primary)" : "var(--bg)"};
  border: 2px solid
    ${({ $revealed }) =>
      $revealed ? "var(--neon-primary)" : "rgba(0, 242, 255, 0.15)"};

  ${({ $revealed }) =>
    $revealed &&
    css`
      animation: ${pulseAnim} 2s infinite;
    `}
`;

const Meta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-dim);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 14px;

  span {
    color: var(--neon-primary);
    font-weight: 500;
  }
`;

const ItemTitle = styled.h2`
  font-size: clamp(1.3rem, 5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  text-transform: uppercase;
  color: var(--text-main);
`;

const Description = styled.p`
  max-width: 480px;
  color: var(--text-dim);
  font-size: 1.05rem;
  line-height: 1.65;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    max-width: 100%;
    font-size: 0.95rem;
  }

  ${JourneyItem}:hover & {
    color: var(--text-main);
  }
`;

const Tags = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-dim);
  border-radius: 4px;
  transition:
    border-color 0.3s ease,
    color 0.3s ease,
    background 0.3s ease;

  ${JourneyItem}:hover & {
    border-color: var(--neon-primary);
    color: var(--neon-primary);
    background: rgba(0, 242, 255, 0.05);
  }
`;

/* ---------- Data ---------- */

const journeyItems = [
  {
    index: "01",
    meta: "Expert · 4 yrs",
    title: "Frontend",
    description:
      "Spec-to-pixel UI engineering across complex design systems. Component architecture, motion, and accessibility at production scale.",
    tags: ["React", "TypeScript", "styled-components", "Vite"],
  },
  {
    index: "02",
    meta: "Expert · 6 yrs",
    title: "Backend Architecture",
    description:
      "Scalable server-side design. API contracts, service boundaries, and systems built to handle real load.",
    tags: ["Node.js", "Express", "REST", "GraphQL"],
  },
  {
    index: "03",
    meta: "Expert · 4 yrs",
    title: "Databases",
    description:
      "Schema design, query optimisation, and data modelling across relational and document stores.",
    tags: ["PostgreSQL", "MongoDB", "Redis", "Prisma"],
  },
  {
    index: "04",
    meta: "Intermediate · 3 yrs",
    title: "AWS Cloud",
    description:
      "Provisioning production infrastructure. CI/CD pipelines, containers, and cost-conscious deployment strategies.",
    tags: ["EC2", "S3", "Lambda", "Docker"],
  },
  {
    index: "05",
    meta: "Advanced · 2 yrs",
    title: "Rust",
    description:
      "Systems programming for performance-critical paths. CLI tooling and WASM compile targets.",
    tags: ["Cargo", "Tokio", "WASM", "Actix"],
  },
];

/* ---------- Component ---------- */

export default function Skills() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(
    journeyItems.map(() => false),
  );

  // Scroll-driven filament — uses rAF to stay in sync with Lenis
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const line = lineRef.current;
    if (!wrapper || !line) return;

    let rafId: number;

    const tick = () => {
      const h = wrapper.offsetHeight;
      line.style.strokeDasharray = String(h);

      const rect = wrapper.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - rect.top) / h;
      const clamped = Math.max(0, Math.min(1, progress));
      line.style.strokeDashoffset = String(h * (1 - clamped));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Per-item reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = itemRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (idx === -1) return;
          setRevealed((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="skills">
      <SectionTitle>2. Skills</SectionTitle>

      <TimelineWrapper ref={wrapperRef}>
        {/* Filament SVG */}
        <FilamentSvg
          width="4"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Dim background track */}
          <line
            x1="2"
            y1="0"
            x2="2"
            y2="100%"
            stroke="rgba(0, 242, 255, 0.12)"
            strokeWidth="2"
            fill="none"
          />
          {/* Glowing active line (driven by rAF) */}
          <line
            ref={lineRef}
            x1="2"
            y1="0"
            x2="2"
            y2="100%"
            stroke="var(--neon-primary)"
            strokeWidth="2"
            fill="none"
            style={{
              filter: "drop-shadow(0 0 7px var(--neon-primary))",
              transition: "stroke-dashoffset 0.08s linear",
            }}
          />
        </FilamentSvg>

        {/* Journey items */}
        {journeyItems.map((item, i) => (
          <JourneyItem
            key={item.index}
            $revealed={revealed[i]}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            <Node $revealed={revealed[i]} />

            <Meta>
              <span>{item.index}</span>
              {item.meta}
            </Meta>

            <ItemTitle>{item.title}</ItemTitle>
            <Description>{item.description}</Description>

            <Tags>
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          </JourneyItem>
        ))}
      </TimelineWrapper>
    </Section>
  );
}
