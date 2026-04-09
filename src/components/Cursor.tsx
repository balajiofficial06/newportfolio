import { useEffect, useRef, type RefObject } from "react";
import styled from "styled-components";
import type Lenis from "lenis";

const Dot = styled.div`
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference;
  transition: width 0.15s ease, height 0.15s ease;
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

export default function Cursor({
  lenisRef,
}: {
  lenisRef: RefObject<Lenis | null>;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  // Track mouse position — direct DOM, no state
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

  // Expand dot on fast scroll — direct DOM, no state, no re-renders
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const onScroll = ({ velocity }: { velocity: number }) => {
      if (!dotRef.current) return;
      const size = 20 + Math.min(Math.abs(velocity) * 30, 60);
      dotRef.current.style.width = `${size}px`;
      dotRef.current.style.height = `${size}px`;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenisRef]);

  return (
    <>
      <Dot id="cursor-dot" ref={dotRef} />
      <Aura id="cursor-aura" ref={auraRef} />
    </>
  );
}
