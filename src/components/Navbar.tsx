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

const Link = styled.a`
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    color: var(--text-main);
  }
`;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  return (
    <Nav>
      <Link onClick={() => scrollTo("about")}>ABOUT</Link>
      <Link onClick={() => scrollTo("skills")}>SKILLS</Link>
      <Link onClick={() => scrollTo("projects")}>PROJECTS</Link>
      <Link onClick={() => scrollTo("contact")}>CONTACT</Link>
    </Nav>
  );
}
