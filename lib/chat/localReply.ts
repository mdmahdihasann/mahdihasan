import { process } from "@/data/process";
import { profile } from "@/data/profile";
import { services } from "@/data/services";
import { skillGroups } from "@/data/skills";

import { education, work } from "./knowledge";

/**
 * The free, offline brain of the chat assistant: keyword intents over the
 * site's own data, understood in English, Banglish and Bangla. It answers when
 * no AI key is configured and whenever the AI call fails, so the bot never
 * goes silent.
 */

export type ChatAction = { label: string; href: string };
export type ChatReply = { text: string; actions?: ChatAction[] };
export type ChatTurn = { role: "user" | "assistant"; content: string };

export type Intent =
  | "hire"
  | "contact"
  | "greeting"
  | "skills"
  | "services"
  | "experience"
  | "education"
  | "projects"
  | "process"
  | "location"
  | "resume"
  | "social"
  | "languages"
  | "about"
  | "thanks";

export const hireActions = (): ChatAction[] => [
  {
    label: "Email Mahdi",
    href: `mailto:${profile.email}?subject=${encodeURIComponent("Project inquiry from your portfolio")}`,
  },
  { label: "Open contact form", href: "#contact" },
];

/** Ordered: on a tie, the earlier intent wins — hiring beats everything. */
const PATTERNS: [Intent, RegExp][] = [
  [
    "hire",
    /\b(hire|hiring|recruit|freelanc\w*|quote|budget|price|pricing|cost|rate|rates|charge|fee|payment|contract|available|availability|work with|work together|collaborat\w*|job|deadline|start date|kaj\s*(korte|korabo|korbo|dite|debo|ache|ase)|kaj korate|dam|koto\s*(taka|nibe|nen|niben|lagbe)|taka|niyog|hire kor\w*)\b|কাজ|দাম|টাকা|হায়ার|নিয়োগ/i,
  ],
  [
    "contact",
    /\b(contact|e-?mail|mail|phone|call|number|whats\s?app|reach|message him|jogajog|nombor)\b|নম্বর|যোগাযোগ|ইমেইল|ফোন/i,
  ],
  [
    "skills",
    /\b(skills?|tech|stack|technolog\w*|tools?|expert\w*|good at|proficient|programming languages?|framework|react|next(\.?js)?|typescript|javascript|js|ts|html|css|tailwind|bootstrap|wordpress|wp|elementor|bricks|woocommerce|postgres\w*|prisma|git|seo|performance|ki ki jane|ki jane|parse|pare)\b|দক্ষতা|স্কিল/i,
  ],
  [
    "services",
    /\b(services?|what (can|do) (he|you) (do|build|make|offer)|build|make|website|web ?site|web ?app|landing|e-?commerce|store|shop|api|integration|responsive|redesign|ki ki kore|ki kore|banate|banabe|banay)\b|সার্ভিস|ওয়েবসাইট/i,
  ],
  ["projects", /\b(projects?|portfolio|samples?|previous work|past work|case stud\w*|demo|clients?|kaj dekhte|ager kaj)\b|প্রজেক্ট/i],
  ["process", /\b(process|workflow|steps?|how (do|does) (you|he) work|approach|method|kivabe kaj)\b|প্রক্রিয়া/i],
  ["experience", /\b(experience|background|career|history|years?|job history|worked|current(ly)? (job|role)|oviggota|obhiggota|abhijnata)\b|অভিজ্ঞতা/i],
  ["education", /\b(education|study|studies|studying|university|degree|diploma|b\.?sc|cse|college|school|porashona|versity)\b|পড়াশোনা|বিশ্ববিদ্যালয়/i],
  ["location", /\b(where|location|located|based|live|lives|country|city|dhaka|mirpur|bangladesh|time ?zone|thake|kothay|bari)\b|কোথায়|ঢাকা/i],
  ["resume", /\b(cv|resume|résumé)\b|সিভি/i],
  ["social", /\b(github|linked ?in|facebook|fb|socials?|profile link)\b/i],
  ["languages", /\b(speak|speaks|english|bangla|bengali|languages? (does|do) (he|you))\b|বাংলা|ইংরেজি/i],
  ["about", /\b(who|about|introduce|introduction|tell me|summary|mahdi|ke uni|ke tini|tar somporke|somporke)\b|সম্পর্কে/i],
  ["greeting", /^\s*(hi+|hello+|hey+|yo|salam|assalamu?\s*alaikum|as-?salam\w*|good (morning|afternoon|evening)|kemon (achen|acho|aso)|হাই|হ্যালো|আসসালামু)(?![a-z])/i],
  ["thanks", /\b(thanks?|thank you|thx|ty|dhonnobad|dhonnyobad|bye|goodbye|ok(ay)?|great|nice|cool)\b|ধন্যবাদ/i],
];

export function detectIntent(text: string): Intent | null {
  for (const [intent, re] of PATTERNS) {
    // A greeting only counts when it opens the message ("hi, what's his stack?"
    // should answer the stack), and thanks only when nothing else matched.
    if (intent === "greeting" || intent === "thanks") continue;
    if (re.test(text)) return intent;
  }
  for (const [intent, re] of PATTERNS) {
    if ((intent === "greeting" || intent === "thanks") && re.test(text)) return intent;
  }
  return null;
}

const list = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

/** A named technology the visitor asked about, if it's one Mahdi uses. */
function namedSkill(text: string) {
  const q = text.toLowerCase();
  for (const group of skillGroups) {
    for (const skill of group.items) {
      const key = skill.name.toLowerCase().replace(/\s*\(.*\)/, "").replace(/\.js$/, "");
      if (key.length > 2 && q.includes(key)) return { skill: skill.name, cat: group.cat };
    }
  }
  return null;
}

export function localReply(question: string): ChatReply {
  const intent = detectIntent(question);
  const first = profile.firstName;

  switch (intent) {
    case "hire":
      return {
        text: `Great — ${first} is ${profile.availability.toLowerCase()} and would love to hear about your project. The best way to hire him is by email: ${profile.email}. Share what you need, your timeline and budget, and he'll reply within a day.`,
        actions: hireActions(),
      };
    case "contact":
      return {
        text: `You can reach ${first} by email at ${profile.email} (best for project inquiries) or by phone at ${profile.phone}. He usually replies within a day.`,
        actions: hireActions(),
      };
    case "skills": {
      const hit = namedSkill(question);
      if (hit) {
        return {
          text: `Yes — ${hit.skill} is part of ${first}'s core toolkit (${hit.cat}). His full stack:\n${list(skillGroups.map((g) => `${g.cat}: ${g.items.map((s) => s.name).join(", ")}`))}`,
        };
      }
      return {
        text: `${first}'s stack:\n${list(skillGroups.map((g) => `${g.cat}: ${g.items.map((s) => s.name).join(", ")}`))}`,
      };
    }
    case "services":
      return {
        text: `Here's what ${first} builds for clients:\n${list(services.map((s) => s.name))}\nWant one of these for your business? Email him at ${profile.email}.`,
        actions: hireActions(),
      };
    case "projects":
      return {
        text: `${first}'s project showcase is being updated right now. If you'd like to see work samples relevant to your project, email him at ${profile.email} and he'll share them.`,
        actions: hireActions(),
      };
    case "process":
      return {
        text: `A project with ${first} runs in six steps:\n${list(process.map((p, i) => `${i + 1}. ${p.name} — ${p.desc}`))}`,
      };
    case "experience":
      return {
        text: `${work.map((w) => `${w.date}: ${w.role} — ${w.co}. ${w.desc}`).join("\n")}\nHe has worked across React/Next.js apps and custom WordPress & WooCommerce builds.`,
      };
    case "education":
      return {
        text: `${first}'s education:\n${list(education.map((e) => `${e.role}, ${e.co} (${e.date})`))}`,
      };
    case "location":
      return {
        text: `${first} is based in ${profile.location} (UTC+6) and works with clients remotely, worldwide.`,
      };
    case "resume":
      return {
        text: `You can download ${first}'s résumé right here.`,
        actions: [{ label: "Download résumé", href: profile.resumeUrl }],
      };
    case "social":
      return {
        text: `Find ${first} online:`,
        actions: [
          { label: "GitHub", href: profile.socials.github },
          { label: "LinkedIn", href: profile.socials.linkedin },
          { label: "Facebook", href: profile.socials.facebook },
        ],
      };
    case "languages":
      return { text: `${first} speaks ${profile.languages.join(" and ")} — feel free to write to him in either.` };
    case "about":
      return {
        text: `${profile.name} is a ${profile.role} from Dhaka, Bangladesh. ${profile.summary}`,
      };
    case "greeting":
      return {
        text: `Hi! 👋 I'm ${first}'s assistant. Ask me about his skills, services, experience or how to hire him.`,
      };
    case "thanks":
      return { text: `You're welcome! If you'd like to work with ${first}, just drop him an email at ${profile.email}.` };
    default:
      return {
        text: `I can tell you about ${first}'s skills, services, experience, education or how to hire him. For anything else, the quickest answer comes from ${first} himself: ${profile.email}.`,
        actions: hireActions(),
      };
  }
}

/** Hiring and contact questions always get the email buttons, whoever answers. */
export const actionsFor = (question: string): ChatAction[] | undefined => {
  const intent = detectIntent(question);
  return intent === "hire" || intent === "contact" ? hireActions() : undefined;
};
