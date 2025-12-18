
import { memo } from 'react';
import { ProjectSummary } from './ProjectSummary';

export const ProjectsGrid = memo(({ projects, visibleSections }) => {
  return projects.map((project,i) => {
    // Use remote gallery images for textures
    const textures = project.gallery?.slice(0, 2).map(img => ({
      srcSet: [{src:img.image}], // Only one source for remote images (could add small res if available)
      placeholder: {
        src: img.image,
        size: 100
      }, // Optional: you can use base64 if you have
    })) || [];

    return (
      <ProjectSummary
        key={project.slug}
        id={project.slug}
        sectionRef={project.sectionRef}
        visible={visibleSections.includes(project.sectionRef?.current)}
        index={i+1}
        title={project.title}
        description={project.description}
        buttonText="View project"
        buttonLink={project.slug}
        model={{
          type: project.type,
          alt: project.title,
          textures: textures,
        }}
        alternate={project.title}
      />
    );
  });
});
