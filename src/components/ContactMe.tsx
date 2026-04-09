import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import emailjs from "@emailjs/browser";
import { Section } from "../utils/Atoms";
import { useOnEnter } from "../hooks/useOnEnter";

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

  @media (max-width: 480px) {
    gap: 40px;
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

  @media (max-width: 480px) {
    padding: 30px;
    gap: 25px;
  }
`;

const Group = styled.div<{ $visible?: boolean; $delay?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(20px)")};
  transition:
    opacity 0.4s var(--transition) ${({ $delay }) => $delay ?? 0}ms,
    transform 0.4s var(--transition) ${({ $delay }) => $delay ?? 0}ms;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-stroke);
  padding: 12px 0;
  font-size: 16px;
  color: var(--text-main);
  outline: none;
  width: 100%;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    border-bottom-color: var(--neon-cyan);
  }

  &::placeholder {
    color: transparent;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 12px;
  left: 0;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-dim);
  pointer-events: none;
  transition: all 0.3s ease;
  text-transform: uppercase;

  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ & {
    top: -16px;
    font-size: 10px;
    color: var(--neon-cyan);
  }
`;

const Textarea = styled.textarea`
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--glass-stroke);
  padding: 12px 0;
  font-size: 16px;
  color: var(--text-main);
  outline: none;
  width: 100%;
  resize: none;
  font-family: inherit;
  transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    border-bottom-color: var(--neon-cyan);
  }

  &::placeholder {
    color: transparent;
  }

  &:focus ~ ${Label}, &:not(:placeholder-shown) ~ ${Label} {
    top: -16px;
    font-size: 10px;
    color: var(--neon-cyan);
  }
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

const ErrorText = styled.span`
  color: #ff4d4d;
  font-family: var(--font-mono);
  font-size: 10px;
  margin-top: 5px;
  display: block;
`;

/* ---------------- Component ---------------- */

export default function ContactMe() {
  const fluxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formShellRef = useRef<HTMLDivElement>(null);
  const [formVisible, setFormVisible] = useState(false);

  useOnEnter(formShellRef, () => setFormVisible(true), 0.1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim())
      newErrors.name = "Transmission Origin (Name) is required";
    if (!formData.email.trim()) {
      newErrors.email = "Return Address (Email) is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid return address format";
    }
    if (!formData.subject.trim())
      newErrors.subject = "Project Blueprint (Subject) is required";
    if (!formData.message.trim()) newErrors.message = "Details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey,
      );
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <Section id="contact" style={{ position: "relative", overflow: "hidden" }}>
      {/*<ConductiveLine />*/}
      <FluxBackground ref={fluxRef} />

      <Grid>
        <Header>
          <Title>
            <span>Ignite</span>
            Contact
          </Title>

          <InfoBlock>
            <InfoItem>
              <InfoLabel>Direct Channel</InfoLabel>
              <InfoValue href="mailto:gm.raman.ww@gmail.com">
                gm.raman.ww@gmail.com
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Coordinates</InfoLabel>
              <InfoValue as="span">Chennai, India / Remote</InfoValue>
            </InfoItem>
          </InfoBlock>
        </Header>

        <FormShell ref={formShellRef}>
          <Form ref={formRef} onSubmit={handleSubmit} noValidate>
            <Group $visible={formVisible} $delay={0}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <Label>Name</Label>
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </Group>

            <Group $visible={formVisible} $delay={80}>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <Label>Email</Label>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </Group>

            <Group $visible={formVisible} $delay={160}>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <Label>Subject</Label>
              {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
            </Group>

            <Group $visible={formVisible} $delay={240}>
              <Textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <Label>Message</Label>
              {errors.message && <ErrorText>{errors.message}</ErrorText>}
            </Group>

            <Button type="submit" disabled={status === "sending"}>
              {status === "sending"
                ? "Transmitting..."
                : status === "success"
                  ? "Transmission Complete"
                  : status === "error"
                    ? "Transmission Failed"
                    : "Initialize Link"}
            </Button>
          </Form>
        </FormShell>
      </Grid>
    </Section>
  );
}
