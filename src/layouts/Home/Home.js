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
        title="Hire Remote MERN Stack Developer India | Scalable Web Apps Built Fast"
        description="Struggling to find a battle-tested developer who turns chaotic codebases into high-traffic winners? For startups and enterprises drowning in scalability woes, I craft AI-boosted MERN solutions that handle 10x loads without breaking a sweat—drawing from 12+ years optimizing pricing engines at Tesco. Skip the hiring hassle; let's deploy your next app in weeks."
        keywords="hire MERN stack developer, freelance full stack developer India, remote React Node expert, scalable web app development, AI integrated MERN solutions"
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
