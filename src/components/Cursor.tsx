import { useEffect, useRef } from "react";
import styled from "styled-components";

const Dot = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: white;
  border-radius: 50%;
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Aura = styled.div`
  width: 400px;
  height: 400px;
  position: fixed;
  background: radial-gradient(circle, rgba(255, 0, 193, 0.15), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  @media (max-width: 1024px) {
    display: none;
  }
`;

export default function Cursor({ cursorVal }: { cursorVal: number }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dotRef.current || !auraRef.current) return;
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      auraRef.current.style.left = `${e.clientX}px`;
      auraRef.current.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <Dot id="cursor-dot" size={cursorVal} ref={dotRef} />
      <Aura id="cursor-aura" ref={auraRef} />
    </>
  );
}
