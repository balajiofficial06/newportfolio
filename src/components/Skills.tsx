import styled from "styled-components";
import SkillCard from "./SkillCard";
import { SectionTitle, Section } from "../utils/Atoms";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 1025px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    place-items: center;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export default function Skills() {
  return (
    <Section id="skills">
      <SectionTitle>2. Skills</SectionTitle>
      <Grid>
        <SkillCard
          tag="Advanced"
          title="Rust"
          level={80}
          metrics={[
            { label: "projects", value: "4" },
            { label: "years", value: "2" },
          ]}
        />
        <SkillCard
          tag="Expert"
          title="FRONTEND"
          level={85}
          metrics={[
            { label: "projects", value: "20" },
            { label: "years", value: "4" },
          ]}
        />
        <SkillCard
          tag="Expert"
          title="BACKEND<br/>ARCHITECTURE"
          level={95}
          metrics={[
            { label: "projects", value: "22" },
            { label: "years", value: "6" },
          ]}
        />
        <SkillCard
          tag="Intermediate"
          title="AWS<br/>CLOUD"
          level={85}
          metrics={[
            { label: "projects", value: "10" },
            { label: "years", value: "3" },
          ]}
        />
        <SkillCard
          tag="Expert"
          title="DATABASES"
          level={85}
          metrics={[
            { label: "projects", value: "16" },
            { label: "years", value: "4" },
          ]}
        />
      </Grid>
    </Section>
  );
}
