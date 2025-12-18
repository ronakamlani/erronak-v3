import React, { useEffect, useRef, useState } from "react";
import fs from 'fs';
import path from 'path';
import { Meta } from "components/Meta";
import styles from "./project.module.css";
import { ProjectsGrid } from "layouts/Home/ProjectsGrid";
import { Footer } from "components/Footer";
import { Transition } from "components/Transition";
import { Heading } from "components/Heading";
import { DecoderText } from "components/DecoderText";
import { Divider } from "components/Divider";
import { tokens } from "components/ThemeProvider/theme";
import { cssProps, msToNum, numToMs } from "utils/style";

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src", "data", "portfolio.json");
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);
    // ✅ Sort data by 'index' property in ascending order
    data.sort((a, b) => {
      if (a.index === undefined) return 1;   // move undefined indexes to the end
      if (b.index === undefined) return -1;
      return a.index - b.index;
    });
    console.log("data",data.length);
    return { props: { portfolioData: data } };
  } catch (e) {
    console.error("Error reading portfolio.json", e);
    return { props: { portfolioData: [] } };
  }
}

export function Projects({ portfolioData }) {
  const initDelay = tokens.base.durationS;
  const projectRefs = portfolioData.map(() => useRef());
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const sections = [...projectRefs];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (!visibleSections.includes(section)) {
              setVisibleSections(prev => [...prev, section]);
            }
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    sections.forEach(section => observer.observe(section.current));
    return () => observer.disconnect();
  }, [visibleSections, projectRefs]);

  return (
    <div className={styles.intro}>
      <Meta title="Projects - erronak.com" description="" />
      <Transition unmount in={true} timeout={1600}>
        {(visible, status) => (
          <>
            <Heading className={styles.title} data-status={status} level={3} as="h1">
              <DecoderText text="Projects" start={status !== "exited"} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
          </>
        )}
      </Transition>
      <ProjectsGrid
        projects={portfolioData.map((proj, i) => ({
          ...proj,
          sectionRef: projectRefs[i],
        }))}
        visibleSections={visibleSections}
      />
      <Footer />
    </div>
  );
}

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}

export default Projects;