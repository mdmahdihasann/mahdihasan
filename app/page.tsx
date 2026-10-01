import About from "@/components/home/About";
import BackToTop from "@/components/home/BackToTop";
import Background from "@/components/home/Background";
import ChatBot from "@/components/home/ChatBot";
import Contact from "@/components/home/Contact";
import CoursorGlow from "@/components/home/CoursorGlow";
import Experience from "@/components/home/Experience";
import Footer from "@/components/home/Footer";
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

export default function Page() {
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
          <Process />
          <Experience />
          <Numbers />
          <Contact />
        </div>
      </main>

      <Footer />
      <BackToTop />
      <ChatBot />

      {/* Class-driven behaviour (reveals, magnetic buttons, spotlights) — keep last. */}
      <Interactions />
    </>
  );
}
