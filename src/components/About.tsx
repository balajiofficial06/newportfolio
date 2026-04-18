import { useRef, useState } from "react";
import styled from "styled-components";
import { asRem } from "../utils/helper";
import { Section, SectionTitle } from "../utils/Atoms";
import { useOnEnter } from "../hooks/useOnEnter";

export const InnerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 80px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Heading = styled.h2`
  font-size: ${asRem(32)};
  margin-bottom: ${asRem(24)};
  flex: 1;

  @media (max-width: 768px) {
    font-size: ${asRem(28)};
  }

  @media (max-width: 480px) {
    font-size: ${asRem(24)};
  }
`;

const AboutText = styled.div<{ $revealed: boolean }>`
  color: var(--text-dim);
  font-size: ${asRem(18)};
  flex: 1;
  line-height: 1.7;

  .word {
    display: inline-block;
    margin-right: 0.25em;
    opacity: ${({ $revealed }) => ($revealed ? 1 : 0)};
    transform: ${({ $revealed }) =>
      $revealed ? "translateY(0)" : "translateY(12px)"};
    transition:
      opacity 0.6s var(--transition),
      transform 0.6s var(--transition);
  }
`;

function splitWords(text: string): { word: string; index: number }[] {
  return text.split(" ").map((word, index) => ({ word, index }));
}

const ABOUT_TEXT =
  "I am a software engineer with 6 years of experience specializing in backend development and systems programming. I build high-performance, scalable backend systems using Python and Node.js, and have a strong command of Rust for systems-level development. I also bring working knowledge of frontend technologies, giving me a well-rounded perspective across the full stack.";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const words = splitWords(ABOUT_TEXT);

  useOnEnter(containerRef, () => setRevealed(true));

  return (
    <Section id="about">
      <SectionTitle>1. About</SectionTitle>
      <InnerDiv>
        <Heading>Crafting robust systems, from the ground up.</Heading>
        <AboutText ref={containerRef} $revealed={revealed}>
          <p>
            {words.map(({ word, index }) => (
              <span
                key={index}
                className="word"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {word}
              </span>
            ))}
          </p>
        </AboutText>
      </InnerDiv>
    </Section>
  );
}
