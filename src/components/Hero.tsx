import { useEffect, useRef, type RefObject } from "react";
import styled, { keyframes } from "styled-components";
import { asRem } from "../utils/helper";
import type Lenis from "lenis";

const drift = keyframes`
  from { transform: translate(0,0) scale(1); }
  to { transform: translate(-100px,50px) scale(1.2); }
`;

const scrollAnimation = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
`;

const Section = styled.section`
  height: 100vh;
  padding: 0 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  font-size: clamp(4rem, 12vw, 5rem);
  line-height: 0.9;
  background: linear-gradient(180deg, #fff 0%, #444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s var(--transition), transform 0.6s var(--transition);

  &[data-hero-item="visible"] {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: clamp(3rem, 12vw, 4rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(2rem, 12vw, 3rem);
  }
`;

const Blob = styled.div`
  position: absolute;
  right: 0;
  top: 20%;
  width: 500px;
  height: 500px;
  background: var(--accent-prism);
  filter: blur(120px);
  opacity: 0.2;
  border-radius: 50%;
  animation: ${drift} 20s infinite alternate linear;
  z-index: -1;

  @media (max-width: 768px) {
    animation: none; /* disable parallax + drift on mobile for performance */
  }
`;

const SubText = styled.p`
  font-family: "JetBrains Mono", monospace;
  padding-left: ${asRem(5)};
  font-size: ${asRem(16)};
  color: var(--text-dim);
  letter-spacing: 0.1rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  &[data-hero-item="visible"] {
    opacity: 1;
  }
`;

const SubText2 = styled.p`
  max-width: 550px;
  padding-left: ${asRem(10)};
  margin-top: ${asRem(20)};
  color: var(--text-dim);
  opacity: 0;
  transition: opacity 0.4s ease;

  &[data-hero-item="visible"] {
    opacity: 1;
  }

  @media (max-width: 768px) {
    margin-top: 0;
    padding-left: ${asRem(2)};
  }
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${asRem(5)};

  @media (max-width: 768px) {
   gap: ${asRem(20)};
  }
`;

const ScrollWrapper = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;

  &[data-hero-item="visible"] {
    opacity: 0.7;
  }
`;

const Mouse = styled.div`
  width: 26px;
  height: 40px;
  border: 2px solid var(--text-dim);
  border-radius: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--text-dim);
    border-radius: 50%;
    animation: ${scrollAnimation} 2s infinite;
  }
`;

const ScrollText = styled.span`
  font-size: 0.8rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export default function Hero({
  lenisRef,
}: {
  lenisRef: RefObject<Lenis | null>;
}) {
  const blobRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subText2Ref = useRef<HTMLParagraphElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // Hero entrance: staggered cascade on mount
  useEffect(() => {
    const timers = [
      setTimeout(() => subTextRef.current?.setAttribute("data-hero-item", "visible"), 100),
      setTimeout(() => titleRef.current?.setAttribute("data-hero-item", "visible"), 300),
      setTimeout(() => subText2Ref.current?.setAttribute("data-hero-item", "visible"), 700),
      setTimeout(() => scrollWrapperRef.current?.setAttribute("data-hero-item", "visible"), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Blob parallax — subscribes to Lenis scroll, direct DOM mutation
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const onScroll = ({ scroll }: { scroll: number }) => {
      if (blobRef.current) {
        blobRef.current.style.transform = `translateY(${scroll * 0.3}px)`;
      }
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenisRef]);

  return (
    <Section>
      <Blob ref={blobRef} />
      <ContentDiv>
        <SubText ref={subTextRef}>HI, This is Balaji</SubText>
        <Title ref={titleRef}>
          FULL STACK DEVELOPER
          <br />& ARCHITECT
        </Title>
        <SubText2 ref={subText2Ref}>
          Crafting high-performance digital artifacts through lacquered
          aesthetics and mathematical precision.
        </SubText2>
      </ContentDiv>
      <ScrollWrapper ref={scrollWrapperRef}>
        <Mouse />
        <ScrollText>Scroll</ScrollText>
      </ScrollWrapper>
    </Section>
  );
}
