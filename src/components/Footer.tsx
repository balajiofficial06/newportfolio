import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { initSnakeGame, type SnakeGameHandle } from "../utils/snakeGame";

// ── game section ──────────────────────────────────────────────────────────────

/** Outer wrapper — no background, no borders, just full width */
const GameSection = styled.section`
  width: 100%;
`;

/** Inner content box — mirrors the Page component's max-width + responsive padding */
const GameInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;

  @media (min-width: 768px) {
    padding: 6rem 3rem 4rem;
  }

  @media (min-width: 1200px) {
    padding: 7rem 4rem 4rem;
  }
`;

/** Matches SectionTitle from Atoms.tsx — consistent with About / Skills / Projects */
const GameTitle = styled.p`
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 3rem;
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const ScoreBar = styled.div`
  display: flex;
  gap: 3rem;
  align-items: baseline;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
`;

const ScoreLabel = styled.span`
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.25);
`;

const ScoreNumber = styled.span`
  font-family: var(--font-mono);
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--neon-cyan);
  text-shadow:
    0 0 8px rgba(0, 243, 255, 0.6),
    0 0 24px rgba(0, 243, 255, 0.2);
  line-height: 1;
`;

const GameCanvas = styled.canvas`
  display: block;
  /* Renders at 480×480 internally; scales down on narrow screens */
  width: min(480px, 100%);
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  border: 1px solid rgba(0, 243, 255, 0.25);
  box-shadow:
    0 0 0 1px rgba(0, 243, 255, 0.06),
    0 0 24px rgba(0, 243, 255, 0.15),
    0 0 72px rgba(0, 243, 255, 0.05);
  cursor: pointer;
  image-rendering: pixelated;
`;

/** Cross D-pad — 3×3 grid */
const DPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 3rem);
  grid-template-rows: repeat(3, 3rem);
  gap: 6px;
`;

const DPadBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid rgba(0, 243, 255, 0.2);
  background: rgba(0, 243, 255, 0.04);
  color: rgba(0, 243, 255, 0.5);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s, color 0.1s, border-color 0.1s, box-shadow 0.1s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 243, 255, 0.1);
    color: var(--neon-cyan);
    border-color: rgba(0, 243, 255, 0.5);
    box-shadow: 0 0 12px rgba(0, 243, 255, 0.2);
  }

  &:active {
    background: rgba(0, 243, 255, 0.18);
    box-shadow: 0 0 16px rgba(0, 243, 255, 0.35);
  }
`;

// ── footer row ────────────────────────────────────────────────────────────────

const FooterWrapper = styled.footer`
  width: 100%;
`;

const FooterRow = styled.div`
  width: 100%;
  padding: 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    flex-direction: column;
    text-align: center;
  }
`;

const Copy = styled.p`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.05em;
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-dim);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
  cursor: pointer;

  &:hover {
    color: var(--neon-cyan);
    border-color: var(--neon-cyan);
    background: rgba(0, 242, 255, 0.06);
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
    fill: currentColor;
  }
`;

// ── icons ─────────────────────────────────────────────────────────────────────

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const UpworkIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
  </svg>
);

// ── component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SnakeGameHandle | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const savedBest = parseInt(localStorage.getItem("snake-best") ?? "0", 10);
    setBest(savedBest);
    gameRef.current = initSnakeGame(canvasRef.current, setScore, setBest);

    const onKey = (e: KeyboardEvent) => gameRef.current?.handleKey(e);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      gameRef.current?.destroy();
    };
  }, []);

  const dpad = (direction: "up" | "down" | "left" | "right") => () =>
    gameRef.current?.handleDpad(direction);

  return (
    <>
      <GameSection>
        <GameInner>
          <GameTitle>Play</GameTitle>

          <GameContent>
            <ScoreBar>
              <ScoreItem>
                <ScoreLabel>Score</ScoreLabel>
                <ScoreNumber>{String(score).padStart(3, "0")}</ScoreNumber>
              </ScoreItem>
              <ScoreItem>
                <ScoreLabel>Best</ScoreLabel>
                <ScoreNumber>{String(best).padStart(3, "0")}</ScoreNumber>
              </ScoreItem>
            </ScoreBar>

            <GameCanvas
              ref={canvasRef}
              width={480}
              height={480}
              onClick={() => gameRef.current?.startOrRestart()}
              aria-label="Snake game — click or tap to start"
            />

            <DPad>
              <span /><DPadBtn onClick={dpad("up")}    aria-label="Up">▲</DPadBtn><span />
              <DPadBtn onClick={dpad("left")}  aria-label="Left">◀</DPadBtn>
              <span />
              <DPadBtn onClick={dpad("right")} aria-label="Right">▶</DPadBtn>
              <span /><DPadBtn onClick={dpad("down")}  aria-label="Down">▼</DPadBtn><span />
            </DPad>
          </GameContent>
        </GameInner>
      </GameSection>

      <FooterWrapper>
        <FooterRow>
          <Copy>© {new Date().getFullYear()} — Built with React & TypeScript</Copy>
          <SocialLinks>
            <SocialLink
              href="https://www.linkedin.com/in/balaji-m-392483140/"
              target="_blank"
              rel="Balaji M LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </SocialLink>
            <SocialLink
              href="https://www.upwork.com/freelancers/~01e1b14913dbd47ba5?viewMode=1"
              target="_blank"
              rel="Balaji M Upwork Profile"
              aria-label="Upwork"
            >
              <UpworkIcon />
            </SocialLink>
          </SocialLinks>
        </FooterRow>
      </FooterWrapper>
    </>
  );
}
