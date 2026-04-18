import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Section, SectionTitle } from "../utils/Atoms";
import { initSnakeGame, type SnakeGameHandle } from "../utils/snakeGame";

// ── headings ──────────────────────────────────────────────────────────────────

const Headline = styled.h2`
  font-size: clamp(2.8rem, 8vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  line-height: 1;
  color: var(--text-main);
`;

const Sub = styled.p`
  font-family: var(--font-mono);
  font-size: clamp(0.85rem, 1.5vw, 1.05rem);
  color: var(--text-dim);
  max-width: 42ch;
  line-height: 1.6;
`;

// ── game ui ───────────────────────────────────────────────────────────────────

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
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

const Hint = styled.p`
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.18);
`;

// ── component ─────────────────────────────────────────────────────────────────

export default function SnakeSection() {
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
    <Section id="play">
      <SectionTitle>Play</SectionTitle>

      <Headline>Take a break.</Headline>
      <Sub>
        You've seen the code. Now let's see the reflexes. Beat my high score
        — I dare you.
      </Sub>

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
          <span />
          <DPadBtn onClick={dpad("up")} aria-label="Up">▲</DPadBtn>
          <span />
          <DPadBtn onClick={dpad("left")} aria-label="Left">◀</DPadBtn>
          <span />
          <DPadBtn onClick={dpad("right")} aria-label="Right">▶</DPadBtn>
          <span />
          <DPadBtn onClick={dpad("down")} aria-label="Down">▼</DPadBtn>
          <span />
        </DPad>

        <Hint>Arrows or WASD to move · click canvas to start</Hint>
      </GameContent>
    </Section>
  );
}
