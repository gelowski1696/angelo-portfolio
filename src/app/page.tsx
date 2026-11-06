import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { StackExperience } from "@/components/sections/StackExperience";
import { portfolio } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header name={portfolio.name} />

      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <StackExperience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

