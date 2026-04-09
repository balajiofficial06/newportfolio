import styled from "styled-components";
import type { RefObject } from "react";
import type Lenis from "lenis";

const Nav = styled.nav`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--surface);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: 100px;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 85%;
    padding: 1rem 1.5rem;
    gap: 1.5rem;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 0.8rem 1rem;
    gap: 1rem;
    top: 1rem;
  }
`;

const Link = styled.a<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? "var(--neon-cyan)" : "var(--text-dim)")};
  text-shadow: ${({ $active }) =>
    $active ? "0 0 12px var(--neon-cyan)" : "none"};
  text-decoration: none;
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.3s ease, text-shadow 0.3s ease;

  &:hover {
    color: var(--text-main);
    text-shadow: none;
  }
`;

export default function Navbar({
  lenisRef,
  activeSection,
}: {
  lenisRef: RefObject<Lenis | null>;
  activeSection: string | null;
}) {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    lenisRef.current?.scrollTo(el ?? 0);
  }

  const links = [
    { id: "about", label: "ABOUT" },
    { id: "skills", label: "SKILLS" },
    { id: "projects", label: "PROJECTS" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <Nav>
      {links.map(({ id, label }) => (
        <Link
          key={id}
          onClick={() => scrollTo(id)}
          $active={activeSection === id}
        >
          {label}
        </Link>
      ))}
    </Nav>
  );
}
