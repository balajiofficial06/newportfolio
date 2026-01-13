import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Section } from "../utils/Atoms";

/* ---------------- Animations ---------------- */

const drift = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-45%, -55%) rotate(5deg); }
`;

const reveal = keyframes`
  to { opacity: 1; transform: translateY(0); }
`;

/* ---------------- Layout ---------------- */

// const Section = styled.section`
//   position: relative;
//   min-height: 100vh;
//   padding: 80px 20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
//   background: var(--bg-deep);
// `;

const FluxBackground = styled.div`
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(circle at center, rgba(112, 0, 255, 0.08), transparent 50%),
    radial-gradient(circle at 20% 30%, rgba(0, 243, 255, 0.05), transparent 40%);
  animation: ${drift} 20s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
`;

const ConductiveLine = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--neon-flux),
    var(--neon-cyan),
    transparent
  );
  opacity: 0.3;
`;

const Grid = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 100px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 60px;
  }
`;

/* ---------------- Header ---------------- */

const Header = styled.div``;

const Title = styled.h2`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin-bottom: 40px;

  span {
    display: block;
    color: transparent;
    -webkit-text-stroke: 1px var(--glass-stroke);
  }
`;

const InfoBlock = styled.div`
  margin-top: 60px;
`;

const InfoItem = styled.div`
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${reveal} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const InfoLabel = styled.span`
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  margin-bottom: 8px;
`;

const InfoValue = styled.a`
  font-size: 20px;
  color: var(--text-main);
  text-decoration: none;

  &:hover {
    color: var(--neon-cyan);
  }
`;

/* ---------------- Form ---------------- */

const FormShell = styled.div`
  padding: 2px;
  background: linear-gradient(135deg, var(--glass-stroke), transparent);
  border-radius: 24px;
`;

const Form = styled.form`
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(40px);
  padding: 60px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Group = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-stroke);
  padding: 12px 0;
  font-size: 18px;
  color: var(--text-main);
  outline: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    border-bottom-color: var(--neon-cyan);
    padding-left: 10px;
  }

  &:focus + div {
    width: 100%;
  }
`;

const Textarea = styled.textarea`
  ${Input};
  resize: none;
`;

const Indicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1px;
  width: 0;
  background: var(--neon-cyan);
  box-shadow: 0 0 15px var(--neon-cyan);
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Button = styled.button`
  margin-top: 20px;
  align-self: flex-start;
  padding: 20px 40px;
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  background: transparent;
  border: 1px solid var(--neon-cyan);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--neon-cyan);
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: -1;
  }

  &:hover {
    color: var(--bg-deep);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.3);
  }

  &:hover::before {
    transform: translateX(0);
  }
`;

/* ---------------- Component ---------------- */

export default function ContactMe() {
  const fluxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!fluxRef.current) return;

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      fluxRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(112,0,255,0.15), transparent 40%),
        radial-gradient(circle at 20% 30%, rgba(0,243,255,0.05), transparent 40%)
      `;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <Section style={{ position: "relative", overflow: "hidden" }}>
      {/*<ConductiveLine />*/}
      <FluxBackground ref={fluxRef} />

      <Grid>
        <Header>
          <Title>
            <span>Ignite</span>
            The Flux
          </Title>

          <InfoBlock>
            <InfoItem>
              <InfoLabel>Direct Channel</InfoLabel>
              <InfoValue href="mailto:hello@flux.studio">
                hello@flux.studio
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Coordinates</InfoLabel>
              <InfoValue as="span">London, UK / Remote</InfoValue>
            </InfoItem>
          </InfoBlock>
        </Header>

        <FormShell>
          <Form>
            {["Transmission Origin", "Return Address", "Project Blueprint"].map(
              (label) => (
                <Group key={label}>
                  <Label>{label}</Label>
                  <Input required />
                  <Indicator />
                </Group>
              ),
            )}

            <Group>
              <Label>Details</Label>
              <Textarea rows={4} />
              <Indicator />
            </Group>

            <Button type="submit">Initialize Link</Button>
          </Form>
        </FormShell>
      </Grid>
    </Section>
  );
}
