import { profile } from "@/data/profile";

import Socials from "./Socials";

const FOOTER_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => {
  return (
    <footer>
      <div className="wrap footer-grid">
        <a href="#home" className="logo" aria-label={`${profile.name}, home`}>
          {profile.logo.text}
          <span>{profile.logo.accent}</span>
        </a>

        <ul className="footer-links">
          {FOOTER_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <Socials compact />
      </div>

      <div className="wrap footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
