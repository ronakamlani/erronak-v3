import { Footer } from 'components/Footer';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { Profile } from 'layouts/Home/Profile';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';
import { ProjectsGrid } from './ProjectsGrid';
import { Button } from 'components/Button';



const disciplines = [
  'AI Prompt Engineer',
  'Full Stack Architect',
  'SaaS Specialist',
  'Cloud-Native Expert',
  'Team Lead',
];

export const Home = ({
  projects,
  featureProjects
}) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const details = useRef();

  // Dynamically generate refs for each featured project
  const projectRefs = featureProjects.map(() => useRef());

  useEffect(() => {
    const sections = [intro, ...projectRefs, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections, projectRefs]);

  return (
    <div className={styles.home}>
      <Meta
        title="Senior MERN Stack Engineer + Full-Stack Architect"
        description="Senior MERN Stack Engineer and Full-Stack Architect with 12+ years building scalable web and SaaS platforms. Expert in React, Node.js, MongoDB, cloud-native architectures, and AI-driven features. I design, architect and ship production-ready solutions across frontend, backend and infrastructure. Available for consulting, architecture, and senior engineering roles."
      />
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectsGrid
        projects={featureProjects.map((proj, i) => ({
          ...proj,
          sectionRef: projectRefs[i],
        }))}
        visibleSections={visibleSections}
      />
      <div className={styles.allProjectsContainer}>
        <Button
          secondary
          className={styles.button}
          href="/projects"
        >
          Browse all {projects ? projects.length : 0}+ projects
        </Button>
      </div>
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
