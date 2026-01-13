import styled from "styled-components";

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
`;

const Link = styled.a`
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.75rem;

  &:hover {
    color: var(--text-main);
  }
`;

export default function Navbar() {
  return (
    <Nav>
      <Link href="#about">ABOUT</Link>
      <Link href="#skills">SKILLS</Link>
      <Link href="#projects">PROJECTS</Link>
      <Link href="#contact">CONTACT</Link>
    </Nav>
  );
}
