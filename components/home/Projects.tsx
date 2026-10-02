import { ArrowRight, ArrowUpRight, FolderOpen } from "lucide-react";
import Image from "next/image";

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { span } from "@/lib/ui";
import { cn } from "@/lib/utils";

import PanelHead, { panelLink } from "./PanelHead";
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
      <span
        data-muted
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium cursor-default text-fg-3"
        title={`No public ${label.toLowerCase()} yet`}>
        <span aria-hidden>{icon}</span> {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-fg-2 transition-colors duration-[250ms] hover:text-khaki"
    >
      <span aria-hidden>{icon}</span> {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
};

const Projects = () => (
  <section id="projects" className={cn("panel reveal", span.full)} aria-labelledby="projects-title">
    <PanelHead
      icon={FolderOpen}
      title="Selected Work"
      id="projects-title"
      action={
        <a
          href={profile.socials.github}
          className={panelLink}
          target="_blank"
          rel="noreferrer noopener"
        >
          More on GitHub <ArrowRight size={15} aria-hidden />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      }
    />

    {/* Phones: a swipeable row with the next card peeking in. */}
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[clamp(14px,1.6vw,20px)] max-[600px]:scrollbar-none max-[600px]:-mx-[18px] max-[600px]:flex max-[600px]:snap-x max-[600px]:snap-mandatory max-[600px]:gap-3 max-[600px]:overflow-x-auto max-[600px]:overscroll-x-contain max-[600px]:scroll-px-[18px] max-[600px]:px-[18px] max-[600px]:pt-0.5 max-[600px]:pb-2.5">
      {projects.map((project) => (
        <article
          className={cn(
            "group/card reveal spotlight relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-bg-deep/60 p-2 transition-[border-color,box-shadow] duration-[350ms] ease-smooth hover:border-sage/32 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,.7)]",
            // Off-screen cards never cross the reveal observer; show them all.
            "max-[600px]:flex-[0_0_84%] max-[600px]:snap-start max-[600px]:opacity-100 max-[600px]:[--rv-y:0px]",
          )}
          key={project.name}
        >
          <div className="relative h-[clamp(150px,13vw,180px)] shrink-0 overflow-hidden rounded-xl after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_55%,rgba(20,31,24,.55))]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-[scale] duration-700 ease-smooth group-hover/card:scale-105 [&_svg]:block [&_svg]:size-full"
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
            <span className="absolute top-2.5 right-2.5 z-2 rounded-full border border-sage/30 bg-bg-deep/72 px-2.5 py-1 text-[11.5px] font-semibold text-fg-1 backdrop-blur-sm">{KIND[project.thumb]}</span>
          </div>

          <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
            <h3 className="mb-1.5 text-[17.5px]">{project.name}</h3>
            <p className="mb-4 text-[14px] text-pretty text-fg-2">{project.desc}</p>

            <ul className="mt-auto flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-[7px] border border-sage/20 bg-sage/7 px-[9px] py-[3px] text-[12px] font-medium text-sage"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-3.5 flex items-center gap-4 border-t border-line pt-3">
              <ProjectLink href={project.demo} icon="↗" label="Live Demo" />
              <ProjectLink href={project.repo} icon="⌥" label="GitHub" />
              <span
                className="ml-auto flex size-8 items-center justify-center rounded-[9px] border border-line-strong text-fg-2 transition-[background-color,color,border-color,rotate] duration-300 ease-smooth group-hover/card:rotate-45 group-hover/card:border-khaki group-hover/card:bg-khaki group-hover/card:text-ink"
                aria-hidden
              >
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
