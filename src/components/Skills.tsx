import styled from "styled-components";
import SkillCard from "./SkillCard";
import { SectionTitle, Section } from "../utils/Atoms";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export default function Skills() {
  return (
    <Section id="skills">
      <SectionTitle>2. Skills</SectionTitle>
      <Grid>
        <SkillCard
          tag="Engine v.4.2"
          title="NEURAL<br/>FLUX"
          level={85}
          metrics={[
            { label: "Purity", value: "98.2%" },
            { label: "Latency", value: "12ms" },
          ]}
        />
        <SkillCard
          tag="Engine v.4.2"
          title="NEURAL<br/>FLUX"
          level={85}
          metrics={[
            { label: "Purity", value: "98.2%" },
            { label: "Latency", value: "12ms" },
          ]}
        />
        <SkillCard
          tag="Engine v.4.2"
          title="NEURAL<br/>FLUX"
          level={85}
          metrics={[
            { label: "Purity", value: "98.2%" },
            { label: "Latency", value: "12ms" },
          ]}
        />
        <SkillCard
          tag="Engine v.4.2"
          title="NEURAL<br/>FLUX"
          level={85}
          metrics={[
            { label: "Purity", value: "98.2%" },
            { label: "Latency", value: "12ms" },
          ]}
        />
      </Grid>
    </Section>
  );
}
