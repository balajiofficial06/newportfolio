import { useEffect, useRef } from "react";
import { GlobalStyles } from "./GlobalStyles";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/ContactMe";
import Projects from "./components/Projects";
import SnakeSection from "./components/SnakeSection";
import Footer from "./components/Footer";
import { Outer, Page } from "./components/Layout";
import { useLenis } from "./hooks/useLenis";
import { useActiveSection } from "./hooks/useActiveSection";
import styled from "styled-components";

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--neon-cyan);
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 0 8px var(--neon-cyan);
`;

export default function App() {
  const lenisRef = useLenis();
  const activeSection = useActiveSection();
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Wire scroll progress bar and cursor velocity via direct DOM — no React state,
  // no 60fps re-renders of the entire component tree.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const onScroll = ({ progress }: { progress: number }) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress * 100}%`;
      }
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenisRef]);

  return (
    <Outer>
      <GlobalStyles />
      <ProgressBar ref={progressBarRef} />
      <Cursor lenisRef={lenisRef} />
      <Navbar lenisRef={lenisRef} activeSection={activeSection} />

      <Page>
        <Hero lenisRef={lenisRef} />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <SnakeSection />
      </Page>
      <Footer />
    </Outer>
  );
}
