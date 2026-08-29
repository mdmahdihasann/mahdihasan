export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

/**
 * ⚠️ PLACEHOLDER CONTENT — these are not real quotes from real people. Publishing
 * invented testimonials under invented names is dishonest, so either replace
 * them with quotes you actually have permission to use, or drop <Testimonials />
 * from app/page.tsx until you do.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Replace this with a real quote from a client you have worked with, in their own words.",
    name: "Client Name",
    role: "Role, Company",
    initials: "CN",
  },
  {
    quote:
      "A second real quote goes here — what the project was and what changed after it launched.",
    name: "Client Name",
    role: "Role, Company",
    initials: "CN",
  },
  {
    quote:
      "And a third. Short, specific quotes read far better than long general praise.",
    name: "Client Name",
    role: "Role, Company",
    initials: "CN",
  },
];
