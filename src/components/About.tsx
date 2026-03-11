import styled from "styled-components";
import { asRem } from "../utils/helper";
import { Section, SectionTitle } from "../utils/Atoms";

export const InnerDiv = styled.div`
  /*position: relative;*/
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
  /*font-weight: bold;*/
  margin-bottom: ${asRem(24)};
  flex: 1;

  @media (max-width: 768px) {
    font-size: ${asRem(28)};
  }

  @media (max-width: 480px) {
    font-size: ${asRem(24)};
  }
`;

const AboutText = styled.div`
  color: var(--text-dim);
  font-size: ${asRem(18)};
  flex: 1;
`;

export default function About() {
  return (
    <Section id="about">
      <SectionTitle>1. About</SectionTitle>
      <InnerDiv>
        <Heading>Crafting robust systems, from the ground up.</Heading>
        <AboutText>
          <p>
            I am a software engineer with 6 years of experience specializing in
            backend development and systems programming. I build
            high-performance, scalable backend systems using Python and Node.js,
            and have a strong command of Rust for systems-level development. I
            also bring working knowledge of frontend technologies, giving me a
            well-rounded perspective across the full stack.
          </p>
        </AboutText>
      </InnerDiv>
    </Section>
  );
}
