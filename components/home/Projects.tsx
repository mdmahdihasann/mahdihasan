import { ArrowRight, ArrowUpRight, FolderOpen } from "lucide-react";
import Image from "next/image";

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

import PanelHead from "./PanelHead";
import ProjectThumb, { type ThumbVariant } from "./ProjectThumb";

/** The chip in each card's corner, read off the kind of artwork it draws. */
const KIND: Record<ThumbVariant, string> = {
  storefront: "E-commerce",
  cms: "WordPress",
  dashboard: "Dashboard",
  app: "Web App",
  landing: "Landing Page",
  portfolio: "Portfolio",
};

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

const Projects = () => (
  <section id="projects" className="panel reveal" aria-labelledby="projects-title">
    <PanelHead
      icon={FolderOpen}
      title="Selected Work"
      id="projects-title"
      action={
        <a
          href={profile.socials.github}
          className="panel-link"
          target="_blank"
          rel="noreferrer noopener"
        >
          More on GitHub <ArrowRight size={15} aria-hidden />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      }
    />

    <div className="projects-grid">
      {projects.map((project) => (
        <article className="project-card reveal spotlight" key={project.name}>
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
                  sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <ProjectThumb variant={project.thumb} />
              )}
            </div>
            <span className="project-kind">{KIND[project.thumb]}</span>
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
              <span className="project-arrow" aria-hidden>
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Projects;
