import { Hero } from "../components/Hero";
import { Solutions } from "../components/Solutions";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { Testimonials } from "../components/Testimonials";
import { Awards } from "../components/Awards";
import { Blog } from "../components/Blog";
import { Contact } from "../components/Contact";

export function HomePage() {
  return (
    <>
      <Hero />
      <Solutions />
      <About />
      <Projects />
      <Testimonials />
      <Awards />
      <Blog />
      <Contact />
    </>
  );
}