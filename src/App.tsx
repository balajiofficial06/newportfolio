import { GlobalStyles } from "./GlobalStyles";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/ContactMe";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { Outer, Page } from "./components/Layout";
import { useState } from "react";

export default function App() {
  const [cursorVal, setCursorVal] = useState(20);
  return (
    <Outer>
      <GlobalStyles />
      <Cursor cursorVal={cursorVal} />
      <Navbar />

      <Page>
        <Hero setCursorVal={setCursorVal} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Page>
      <Footer />
    </Outer>
  );
}
