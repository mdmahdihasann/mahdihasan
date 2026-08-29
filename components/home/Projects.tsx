import Image from "next/image";

import { projects } from "@/data/projects";

import ProjectThumb from "./ProjectThumb";

/**
 * A project without a URL renders as muted text instead of an anchor. The old
 * markup fell back to `href="#projects"`, which looked like a link but only
 * scrolled the visitor back to the grid they were already looking at.
 */
export const ProjectLink = ({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: string;
  label: string;
}) => {
  if (!href) {
    return (
      <span className="muted" title={`No public ${label.toLowerCase()} yet`}>
        <span aria-hidden>{icon}</span> {label}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      <span aria-hidden>{icon}</span> {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
};

const Projects = () => {
  return (
    <section id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">
            <span className="num">03</span> {"// Featured Work"}
          </p>
          <h2 className="section-title" id="projects-title">
            Selected <span className="grad">Projects</span>
          </h2>
          <p className="section-sub">
            A few projects I&apos;ve shipped recently, spanning storefronts,
            dashboards and platforms.
          </p>
        </div>

        <div className="projects-grid" id="projectsGrid">
          {projects.map((project) => (
            <article
              className="glass project-card reveal lift spotlight"
              key={project.name}
            >
              <div className="project-img">
                <div
                  className="ph"
                  style={{
                    backgroundImage: `linear-gradient(${project.gradient})`,
                  }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.name} screenshot`}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <ProjectThumb variant={project.thumb} />
                  )}
                </div>
              </div>

              <div className="project-body">
                <h3>{project.name}</h3>
                <p>{project.desc}</p>

                <ul className="tech-tags">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>

                <div className="project-links">
                  <ProjectLink href={project.demo} icon="↗" label="Live Demo" />
                  <ProjectLink href={project.repo} icon="⌥" label="GitHub" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
