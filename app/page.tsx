import About from "@/components/home/About";
import BackToTop from "@/components/home/BackToTop";
import Background from "@/components/home/Background";
import ChatBot from "@/components/home/ChatBot";
import Contact from "@/components/home/Contact";
import CommandPalette from "@/components/home/CommandPalette";
import CoursorGlow from "@/components/home/CoursorGlow";
import Experience from "@/components/home/Experience";
import Footer from "@/components/home/Footer";
import GitHubActivity from "@/components/home/GitHubActivity";
import Hero from "@/components/home/Hero";
import Interactions from "@/components/home/Interactions";
import Navber from "@/components/home/Navber";
import Numbers from "@/components/home/Numbers";
import Particles from "@/components/home/Particles";
import Process from "@/components/home/Process";
import Projects from "@/components/home/Projects";
import Services from "@/components/home/Services";
import Skills from "@/components/home/Skills";
import TechStrip from "@/components/home/TechStrip";
import { profile } from "@/data/profile";
import { getGitHubActivity, usernameFromUrl } from "@/lib/server/github";

export default async function Page() {
  // Cached for six hours inside getGitHubActivity, so the page stays static
  // and regenerates in the background.
  const github = await getGitHubActivity(usernameFromUrl(profile.socials.github));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Background />
      <Particles />
      <CoursorGlow />
      <Navber />

      <main id="main">
        <Hero />
        <TechStrip />

        {/* Every section below is a panel on one grid; pairs share a row. */}
        <div className="wrap panels">
          <About />
          <Skills />
          <Services />
          <Projects />
          <GitHubActivity data={github} />
          <Process />
          <Experience />
          <Numbers />
          {/* <Estimate /> ("Plan Your Project") is hidden on request; the component still exists. */}
          <Contact />
        </div>
      </main>

      <Footer />
      <BackToTop />
      <ChatBot />
      <CommandPalette />

      {/* Class-driven behaviour (reveals, magnetic buttons, spotlights) — keep last. */}
      <Interactions />
    </>
  );
}
