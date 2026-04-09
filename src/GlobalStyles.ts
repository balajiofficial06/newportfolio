import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

  :root {
    --bg: #050505;
    --surface: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.12);
    --accent-prism: linear-gradient(135deg,#ff00c1,#9600ff,#5b00ff,#00b8ff,#00ff88);
    --text-main: #f5f5f7;
    --text-dim: #86868b;
    --bg-color: #0a0a0a;
    --card-bg: #141414;
    --graphite: #2a2a2a;
    // --text-main: #e0e0e0;
    // --text-dim: #666666;
    --bg-deep: #050508;
    --card-base: #0c0c12;
    --neon-primary: #00f2ff;
    --neon-secondary: #7000ff;
    --neon-accent: #ff00c1;
    --transition: cubic-bezier(0.22, 1, 0.36, 1);
    --neon-cyan: #00f3ff;
    --neon-flux: #7000ff;
    --glass: rgba(255, 255, 255, 0.03);
    --glass-stroke: rgba(255, 255, 255, 0.1);
    // --text-main: #ffffff;
    // --text-dim: rgba(255, 255, 255, 0.5);
    --font-sans: "Inter", sans-serif;
    --font-mono: "JetBrains Mono", monospace;
  }

  .root {
  width: 100%;
  height: 100%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: none;
  }


  html {
    /* scroll-behavior removed — Lenis owns smooth scroll */
  }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal],
    [data-hero-item] {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
    .blob-drift {
      animation: none !important;
    }
  }

  body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: "Inter", sans-serif;
      overflow-x: hidden;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
  }

  // body::before {
  //     content: "";
  //     position: fixed;
  //     top: 0;
  //     left: 0;
  //     width: 100%;
  //     height: 100%;
  //     // background-image: radial-gradient(circle at 50% 50%, rgba(20, 20, 30, 0.8), transparent), url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3External%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E);
  //     opacity: 0.04;
  //     pointer-events: none;
  //     z-index: 100;
  // }

  h1, h2{
    font-weight: 800;
    letter-spacing: -0.04em;
    text-transform: uppercase;
  }
`;
