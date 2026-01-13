import styled, { keyframes } from "styled-components";
import { asRem } from "./helper";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*align-items: flex-start;*/
  padding: 0 4rem;
  gap: ${asRem(24)};
  margin: 25% auto;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

export const SectionTitle = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 1.3rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.2em;
`;
