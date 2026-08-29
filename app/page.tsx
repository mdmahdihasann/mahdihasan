import About from "@/components/home/About";
import BackToTop from "@/components/home/BackToTop";
import Background from "@/components/home/Background";
import Contact from "@/components/home/Contact";
import CoursorGlow from "@/components/home/CoursorGlow";
import Experience from "@/components/home/Experience";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Interactions from "@/components/home/Interactions";
import Navber from "@/components/home/Navber";
import Particles from "@/components/home/Particles";
import Projects from "@/components/home/Projects";
import Services from "@/components/home/Services";
import Skills from "@/components/home/Skills";

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
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>

      <Footer />
      <BackToTop />

      {/* Class-driven behaviour (reveals, magnetic buttons, spotlights) — keep last. */}
      <Interactions />
    </>
  );
}
