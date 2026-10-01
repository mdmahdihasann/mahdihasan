import { experience } from "@/data/experience";
import { process } from "@/data/process";
import { profile } from "@/data/profile";
import { services } from "@/data/services";
import { skillGroups } from "@/data/skills";

/**
 * Everything the chat assistant is allowed to say about Mahdi, built from the
 * same `data/*.ts` the page renders — so the bot and the site never disagree.
 * Projects are left out on purpose: `data/projects.ts` is placeholder content.
 */

export const allSkills = skillGroups.flatMap((g) => g.items.map((s) => s.name));

export const work = experience.filter((e) => e.kind === "work");
export const education = experience.filter((e) => e.kind === "education");

export const skillsLine = skillGroups
  .map((g) => `${g.cat}: ${g.items.map((s) => s.name).join(", ")}`)
  .join("\n");

export function buildKnowledge(): string {
  const timeline = experience
    .map((e) => `- ${e.date} — ${e.role}, ${e.co}. ${e.desc}`)
    .join("\n");

  return `NAME: ${profile.name}
ROLE: ${profile.role}
LOCATION: ${profile.location} (Bangladesh time, UTC+6)
AVAILABILITY: ${profile.availability}
LANGUAGES SPOKEN: ${profile.languages.join(", ")}
EMAIL (the way to hire him): ${profile.email}
PHONE: ${profile.phone}
GITHUB: ${profile.socials.github}
LINKEDIN: ${profile.socials.linkedin}
FACEBOOK: ${profile.socials.facebook}
RESUME: available from the "Download Resume" button on the site

SUMMARY:
${profile.summary}

SKILLS:
${skillsLine}

SERVICES:
${services.map((s) => `- ${s.name}: ${s.desc}`).join("\n")}

EXPERIENCE AND EDUCATION:
${timeline}

HOW A PROJECT RUNS:
${process.map((p, i) => `${i + 1}. ${p.name} — ${p.desc}`).join("\n")}

PROJECTS: The project showcase on the site is still being updated, so there is
no public list of past client work here. Visitors who want work samples should
email ${profile.email} and Mahdi will share relevant examples.`;
}
