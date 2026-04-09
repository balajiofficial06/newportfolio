import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

/* ---------- Animations ---------- */

const rotateCurrent = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ---------- Styled Components ---------- */

const Container = styled.div<{ level: number; $filled: boolean }>`
  position: relative;
  width: 320px;
  height: 440px;
  border-radius: 24px;

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    min-height: 280px;
  }
  background: var(--card-base);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;

  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  /* Viscous current */
  &::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0%,
      var(--neon-primary) 15%,
      var(--neon-secondary) 30%,
      var(--neon-accent) 45%,
      transparent 60%
    );
    animation: ${rotateCurrent} 4s linear infinite;
  }

  /* Inner shell */
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    background: var(--card-base);
    border-radius: 20px;
    z-index: 1;
  }

  &:hover {
    box-shadow: 0 0 50px rgba(112, 0, 255, 0.3);
  }

  &:hover::before {
    animation-duration: 2s;
  }

  --skill-level: ${({ level }) => level}%;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 40px 30px;

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(12, 12, 18, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Tag = styled.span`
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon-primary);
  border: 1px solid rgba(0, 242, 255, 0.3);
  padding: 4px 12px;
  border-radius: 100px;
  width: fit-content;
`;

const Title = styled.h2`
  font-family: var(--font-main);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: #fff;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DataPoint = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const Value = styled.span`
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
`;

const ProgressWrap = styled.div`
  grid-column: span 2;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 20px;
`;

const ProgressFill = styled.div<{ $filled: boolean; $delay: number }>`
  height: 100%;
  width: ${({ $filled }) => ($filled ? "var(--skill-level)" : "0%")};
  background: linear-gradient(
    90deg,
    var(--neon-primary),
    var(--neon-secondary)
  );
  transition: width 1.5s cubic-bezier(0.65, 0, 0.35, 1) ${({ $delay }) => $delay}ms;
`;

const Bloom = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  background: var(--neon-secondary);
  filter: blur(120px);
  opacity: 0.15;
  z-index: -1;
`;

/* ---------- Counter Roll ---------- */

function startCount(el: HTMLElement, target: number, duration = 800) {
  const start = performance.now();
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.floor(progress * target));
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = String(target);
  }
  requestAnimationFrame(tick);
}

/* ---------- Types ---------- */

type Metric = {
  label: string;
  value: string;
};

type SkillCardProps = {
  tag: string;
  title: string;
  metrics: Metric[];
  level: number;
  triggered: boolean;
  triggerDelay: number;
};

/* ---------- Component ---------- */

export default function SkillCard({
  tag,
  title,
  metrics,
  level,
  triggered,
  triggerDelay,
}: SkillCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const countedRef = useRef(false);

  // 3D tilt on mouse move
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = (y - rect.height / 2) / 15;
    const ry = (rect.width / 2 - x) / 15;
    ref.current.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) translateY(0) rotateX(0) rotateY(0) scale(1)";
  };

  // Counter roll when triggered (play once)
  useEffect(() => {
    if (!triggered || countedRef.current) return;
    countedRef.current = true;

    const timer = setTimeout(() => {
      metrics.forEach((m, i) => {
        const el = valueRefs.current[i];
        if (!el) return;
        const target = parseInt(m.value, 10);
        if (isNaN(target)) return; // non-numeric value stays static
        startCount(el, target);
      });
    }, triggerDelay);

    return () => clearTimeout(timer);
  }, [triggered, metrics, triggerDelay]);

  return (
    <>
      <Bloom />
      <Container
        ref={ref}
        level={level}
        $filled={triggered}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Inner>
          <Header>
            <Tag>{tag}</Tag>
            <Title dangerouslySetInnerHTML={{ __html: title }} />
          </Header>

          <Body>
            <Grid>
              {metrics.map((m, i) => (
                <DataPoint key={m.label}>
                  <MetricLabel>{m.label}</MetricLabel>
                  <Value ref={(el) => { valueRefs.current[i] = el; }}>
                    {m.value}
                  </Value>
                </DataPoint>
              ))}

              <ProgressWrap>
                <ProgressFill $filled={triggered} $delay={triggerDelay} />
              </ProgressWrap>
            </Grid>
          </Body>
        </Inner>
      </Container>
    </>
  );
}
