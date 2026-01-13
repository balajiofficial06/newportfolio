import styled from "styled-components";

export const Page = styled.div`
  min-width: 320px;
  max-width: 1400px;

  margin: 0 auto; /* centers horizontally */
  padding: 0 1.5rem; /* mobile padding */

  @media (min-width: 768px) {
    padding: 0 3rem;
  }

  @media (min-width: 1200px) {
    padding: 0 4rem;
  }
`;

export const Outer = styled.div`
  width: 100%;
  height: 100%;
`;
