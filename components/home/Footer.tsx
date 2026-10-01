import { profile } from "@/data/profile";

const FOOTER_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

/** One quiet row: logo, copyright, links. */
const Footer = () => (
  <footer>
    <div className="wrap footer-row">
      <a href="#home" className="logo" aria-label={`${profile.name}, home`}>
        {profile.logo.text}
        <span>{profile.logo.accent}</span>
      </a>

      <p className="footer-copy">
        © {new Date().getFullYear()} {profile.name}. Designed and built in Dhaka.
      </p>

      <ul className="footer-links">
        {FOOTER_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;
