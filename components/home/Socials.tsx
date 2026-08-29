import { profile } from "@/data/profile";

type SocialLink = { label: string; href: string; path: string };

export const SOCIALS: SocialLink[] = [
  {
    label: "Facebook",
    href: profile.socials.facebook,
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z",
  },
  {
    label: "GitHub",
    href: profile.socials.github,
    path: "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z",
  },
  {
    label: "LinkedIn",
    href: profile.socials.linkedin,
    path: "M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9.75h4V21H3V9.75zm7 0h3.83v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.13c0-1.22-.02-2.8-1.71-2.8-1.71 0-1.97 1.34-1.97 2.71V21h-4V9.75z",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    path: "M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.2.5 7.8 6 7.8-6H4.2zm15.8 1.6-7.32 5.63a1 1 0 0 1-1.22 0L4.14 7.6V18.5c0 .2.16.5.36.5h15c.2 0 .5-.3.5-.5V7.6z",
  },
];

/** `mailto:` and `tel:` should open in place, not in a new tab. */
const opensInNewTab = (href: string) => /^https?:/i.test(href);

const Socials = ({ compact = false }: { compact?: boolean }) => (
  <ul className={`social-row${compact ? " compact" : ""}`}>
    {SOCIALS.map(({ label, href, path }) => {
      const external = opensInNewTab(href);

      return (
        <li key={label}>
          <a
            href={href}
            className="social-ic"
            aria-label={label}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d={path} />
            </svg>
          </a>
        </li>
      );
    })}
  </ul>
);

export default Socials;
