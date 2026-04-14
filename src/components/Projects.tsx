import { useRef, useState } from "react";
import styled from "styled-components";
import { SectionTitle } from "../utils/Atoms";
import { useOnEnter } from "../hooks/useOnEnter";

/* ---------- Data ---------- */

const projects = [
  {
    id: "01_RUST_BASED_SQL_DB",
    title: "Adaptive DB",
    description:
      "A workload-aware SQL database engine built in Rust. Users declare read-heavy or write-heavy profiles per table, and the engine automatically selects the optimal storage structure — B+Tree for reads, LSM-Tree for writes. Bridging the gap where no single data structure wins.",
    link: "https://github.com/balajiofficial06/AdaptiveDB",
    cta: "View Project",
  },
  {
    id: "02_BOOKING_ENGINE",
    title: "Booking Engine",
    description:
      "A multi-tenant booking engine built to power premium leisure and wellness destinations. Supports tiered admission packages, restaurant reservations, gift cards, and dynamic pricing — deployed for clients including Laugarás Lagoon and Forest Lagoon.",
    link: "https://laugaraslagoon.is/experience",
    cta: "View Website",
  },
  {
    id: "03_npy",
    title: "Python Framework",
    description:
      "A modular Python backend framework built on FastAPI with plug-and-play setup for APIs, databases, logging, and caching. Drop in a module, define your models and routes — the framework handles the rest.",
    link: "https://github.com/balajiofficial06/npy",
    cta: "View Project",
  },
  {
    id: "04_ECOMMERCE_PLATFORM",
    title: "E-Commerce",
    description:
      "A full-stack e-commerce platform with product management, cart, checkout, and order tracking. Built with multi-vendor support, payment gateway integration, and a dynamic storefront.",
    link: "",
    cta: "View Project",
  },
];

/* ---------- Styled Components ---------- */

const Wrapper = styled.section`
  width: 100%;
  padding: 0 4rem;
  margin: 25% auto;

  @media (max-width: 768px) {
    padding: 0 2rem;
    margin: 15% auto;
  }

  @media (max-width: 480px) {
    padding: 0;
    margin: 10% auto;
  }
`;

/* ---------- Tectonic Grid ---------- */

const TectonicGrid = styled.div`
  position: relative;
  display: flex;
  width: calc(100% + 8rem);
  margin-left: -4rem;
  height: 70vh;

  @media (max-width: 768px) {
    width: calc(100% + 4rem);
    margin-left: -2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-left: 0;
  }
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  background: #050505;

  /* Grain overlay */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 20;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

/* Decorative vertical lines behind slabs */
const BgLines = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
`;

const BgLine = styled.div`
  width: 1px;
  height: 100%;
  background: #fff;
`;

/* ---------- Slab ---------- */

const Slab = styled.article<{ $entered: boolean; $delay: number }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  transition:
    flex 0.8s cubic-bezier(0.23, 1, 0.32, 1),
    background 0.4s ease,
    opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${({ $delay }) => $delay}ms,
    transform 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${({ $delay }) => $delay}ms;
  cursor: pointer;
  overflow: hidden;
  background: #000;
  z-index: 1;
  opacity: ${({ $entered }) => ($entered ? 1 : 0)};
  transform: ${({ $entered }) => ($entered ? "translateX(0)" : "translateX(60px)")};

  &:last-child {
    border-right: none;
  }

  &:hover {
    flex: 3;
    background: #0a0a0a;
  }

  @media (max-width: 768px) {
    height: 150px;
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    opacity: 1;
    transform: none;

    &:hover {
      height: 400px;
      flex: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const SlabId = styled.div`
  padding: 30px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  opacity: 0.5;
  z-index: 10;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (max-width: 768px) {
    ${Slab}:hover & {
      opacity: 0;
      visibility: hidden;
    }
  }
`;

const SlabTitleContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 30px;
  z-index: 10;
  pointer-events: none;
`;

const SlabHeading = styled.h3`
  font-size: 1.5rem;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: -0.02em;
  transform-origin: left bottom;
  transform: rotate(-90deg) translate(0, 0);
  transition:
    transform 0.8s cubic-bezier(0.23, 1, 0.32, 1),
    font-size 0.8s cubic-bezier(0.23, 1, 0.32, 1);

  ${Slab}:hover & {
    transform: rotate(0deg) translateY(-300px);
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    transform: rotate(0deg) translate(0, 0);
    font-size: 1.5rem;

    ${Slab}:hover & {
      transform: translateY(-280px);
      font-size: 2rem;
    }
  }
`;

const SlabContent = styled.div`
  position: absolute;
  bottom: 40px;
  left: 30px;
  right: 30px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition:
    opacity 0s,
    transform 0s,
    visibility 0s;
  max-width: 400px;
  min-width: 200px;
  z-index: 10;

  ${Slab}:hover & {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s,
      transform 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.3s,
      visibility 0s linear 0s;
    transform: translateY(0);
  }
`;

const SlabDescription = styled.p`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.7);
`;

const SlabBtn = styled.a`
  display: inline-block;
  padding: 12px 24px;
  border: 1px solid #fff;
  color: #fff;
  text-decoration: none;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  transition:
    background 0.3s ease,
    color 0.3s ease;

  &:hover {
    background: #fff;
    color: #000;
  }
`;

/* ---------- Component ---------- */

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useOnEnter(gridRef, () => setEntered(true));

  return (
    <Wrapper id="projects">
      <SectionTitle>3. Projects</SectionTitle>

      <TectonicGrid ref={gridRef} style={{ marginTop: "2rem" }}>
        <BgLines>
          <BgLine />
          <BgLine />
          <BgLine />
          <BgLine />
        </BgLines>

        {projects.map((p, i) => (
          <Slab key={p.id} $entered={entered} $delay={i * 120}>
            <SlabId>// {p.id}</SlabId>

            <SlabTitleContainer>
              <SlabHeading>{p.title}</SlabHeading>
            </SlabTitleContainer>

            <SlabContent>
              <SlabDescription>{p.description}</SlabDescription>
              <SlabBtn href={p.link}>
                {String(i + 1).padStart(2, "0")} — {p.cta}
              </SlabBtn>
            </SlabContent>
          </Slab>
        ))}
      </TectonicGrid>
    </Wrapper>
  );
}
