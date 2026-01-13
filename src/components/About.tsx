import styled, { keyframes } from "styled-components";
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
`;

const Heading = styled.h2`
  font-size: ${asRem(36)};
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

export default function About({
  setCursorVal,
}: {
  setCursorVal: (val: number) => void;
}) {
  return (
    <Section>
      <SectionTitle>1. About</SectionTitle>
      <InnerDiv>
        <Heading>Building the future, one pixel at a time.</Heading>
        <AboutText>
          <p>
            I am a passionate software engineer with a strong background in web
            development. I have a deep understanding of front-end technologies
            such as HTML, CSS, and JavaScript, as well as experience with
            back-end technologies like Node.js and Express. I am always eager to
            learn new technologies and stay up-to-date with the latest industry
            trends.
          </p>
        </AboutText>
      </InnerDiv>
    </Section>
  );
}
