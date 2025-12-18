import fs from "fs";
import path from "path";
import { Footer } from "components/Footer";
import { Image } from "components/Image";
import { Meta } from "components/Meta";
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectImage,
  ProjectSection,
  ProjectSectionColumns,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from "layouts/Project";
import { Fragment } from "react";
import { media } from "utils/style";
import styles from "./slice/Slice.module.css";

// ✅ Fetch paths for all projects based on slugs in portfolio.json
export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "src", "data", "portfolio.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  const paths = data.map((project) => ({
    params: { slug: project.slug.replace("projects/", "") }, // ✅ remove 'projects/' prefix
  }));

  return {
    paths,
    fallback: false,
  };
}

// // ✅ Fetch single project by slug from portfolio.json
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "src", "data", "portfolio.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData);

  // ✅ match without 'projects/' prefix in slug
  const project = data.find(
    (p) => p.slug.replace("projects/", "") === params.slug
  );

  return {
    props: {
      project,
    },
  };
}

export const ProjectsDetail = ({ project }) => {
  // You can now use `project` fields for dynamic content
  const title = project?.title || "No Title";
  const description = project?.description || "";
  const roles = project?.technologies || [];

  return (
    <Fragment>
      <Meta title={title} prefix="Projects" description={description} />
      <ProjectContainer className={styles.slice}>
        <ProjectBackground
          src={project.gallery[0].image}
          srcSet={`${project.gallery[0].image} 1280w, ${project.gallery[0].image} 2560w`}
          placeholder={project.gallery[0].image}
          opacity={0.8}
        />
        <ProjectHeader
          title={title}
          description={description}
          roles={roles}
          links={project.links}
        />
        <ProjectSection padding="top">
          <ProjectSectionContent>
            <ProjectImage
              srcSet={[
                {
                  src: project.gallery[0].image,
                },
                {
                  src: project.gallery[1].image,
                },
              ]}
              placeholder={project.gallery[0].image}
              alt="The Slice web application showing a selected user annotation."
              sizes={`(max-width: ${media.mobile}px) 100vw, (max-width: ${media.tablet}px) 90vw, 80vw`}
            />
          </ProjectSectionContent>
        </ProjectSection>
        {project.contents.map((content, i) => {
          if (content.contentPosition === "LEFT") {
            return (
              <ProjectSection>
                <ProjectSectionColumns centered className={styles.columns}>
                  <div className={styles.imagesText}>
                    <ProjectSectionHeading>
                      {content.title}
                    </ProjectSectionHeading>
                    <ProjectSectionText
                      dangerouslySetInnerHTML={{ __html: content.description }}
                    ></ProjectSectionText>
                  </div>
                  <div className={styles.sidebarImages}>
                    {content.imagesLink.map((galleryIndex) => {
                      return (
                        <Image
                          className={styles.sidebarImage}
                          key={`leftPanel-${i}-${galleryIndex}`}
                          srcSet={[
                            {
                              src: project.gallery[galleryIndex].image,
                            },
                          ]}
                          placeholder={project.gallery[galleryIndex].image}
                          alt={project.gallery[galleryIndex].caption}
                          sizes={`(max-width: ${media.mobile}px) 200px, 343px`}
                        />
                      );
                    })}
                  </div>
                </ProjectSectionColumns>
              </ProjectSection>
            );
          } else if (content.contentPosition === "TOP") {
            return (
              <ProjectSection light>
                <ProjectSectionContent>
                  <ProjectTextRow>
                    <ProjectSectionHeading>
                      {content.title}
                    </ProjectSectionHeading>
                    <ProjectSectionText
                      dangerouslySetInnerHTML={{ __html: content.description }}
                    ></ProjectSectionText>
                  </ProjectTextRow>
                  {content.imagesLink.map((galleryIndex) => {
                    return (
                      <Image
                        key={`leftPanel-${i}-${galleryIndex}`}
                        srcSet={[
                          {
                            src: project.gallery[galleryIndex].image,
                          },
                        ]}
                        placeholder={project.gallery[galleryIndex].image}
                        alt={project.gallery[galleryIndex].caption}
                        sizes={`(max-width: ${media.mobile}px) 500px, (max-width: ${media.tablet}px) 800px, 1000px`}
                      />
                    );
                  })}
                </ProjectSectionContent>
              </ProjectSection>
            );
          } else {
            return (
              <ProjectSection padding="top">
                <ProjectSectionContent className={styles.grid}>
                  <div className={styles.gridImage}>
                    {content.imagesLink.map((galleryIndex, i) => {
                      if (i % 2 == 0) {
                        return (
                          <div className={styles.gridBackground}>
                            <Image
                              srcSet={[
                                {
                                  src: project.gallery[galleryIndex].image,
                                },
                              ]}
                              placeholder={project.gallery[galleryIndex].image}
                              alt={project.gallery[galleryIndex].caption}
                              role="presentation"
                              sizes={`(max-width: ${media.mobile}px) 312px, (max-width: ${media.tablet}px) 408px, 514px`}
                            />
                          </div>
                        );
                      }

                      return (
                        <div className={styles.gridForeground}>
                          <Image
                            srcSet={[
                              {
                                src: project.gallery[galleryIndex].image,
                              },
                            ]}
                            placeholder={project.gallery[galleryIndex].image}
                            alt={project.gallery[galleryIndex].caption}
                            sizes={`(max-width: ${media.mobile}px) 584px, (max-width: ${media.tablet}px) 747px, 556px`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.gridText}>
                    <ProjectSectionHeading>
                      {content.title}
                    </ProjectSectionHeading>
                    <ProjectSectionText
                      dangerouslySetInnerHTML={{ __html: content.description }}
                    ></ProjectSectionText>
                  </div>
                </ProjectSectionContent>
              </ProjectSection>
            );
          }
        })}

        {/* <ProjectSection>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Project outcomes</ProjectSectionHeading>
              <ProjectSectionText>
                Real-time collaborative annotation facilitated better collaboration
                between learners, and was much easier to run group exercises with the new
                shared layers feature. Learners gave feedback that is was enjoyable to
                work together and see what others were doing, and liked how interactive
                and easy to use the application was.
              </ProjectSectionText>
            </ProjectTextRow>
            <Image
              src={sliceIrl}
              placeholder={sliceIrlPlaceholder}
              alt="Students at the University of New South Wales using the new collaborative annotation features"
            />
          </ProjectSectionContent>
        </ProjectSection> */}
      </ProjectContainer>
      <Footer />
    </Fragment>
  );
};

export default ProjectsDetail;
