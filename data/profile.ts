/**
 * Single source of truth for the identity shown across the site — hero, nav,
 * footer, contact card and page metadata all read from here.
 */
export const profile = {
  name: "Mahdi Hasan",
  firstName: "Mahdi",
  role: "Frontend Developer",
  logo: { text: "mahdi", accent: ".dev" },
  tagline:
    "I build responsive, modern and user-friendly websites and web applications — from clean React and Next.js interfaces to custom WordPress and WooCommerce builds.",
  summary:
    "Frontend Developer experienced in building responsive, modern, and user-friendly websites and web applications. Skilled in HTML, CSS, JavaScript, TypeScript, React.js, Next.js, Tailwind CSS, Bootstrap and WordPress — plus Bricks Builder, Elementor, WooCommerce, API integration and database-driven applications.",
  email: "mdmahdicmt123@gmail.com",
  phone: "01890474002",
  location: "Mirpur-10, Dhaka, Bangladesh",
  availability: "Open for freelance work",
  /** Served from public/ — swap for a PDF export when you have one. */
  resumeUrl: "/CV.png",
  languages: ["English", "Bangla"],
  socials: {
    facebook: "https://www.facebook.com/mdmahdihasansojibe",
    github: "https://github.com/mdmahdihasann",
    linkedin: "https://www.linkedin.com/in/md-mahadi-hasan-9260782b4/",
  },
} as const;
