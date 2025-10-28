import { useEffect, useState } from "react";
import { Hero } from "./Hero";
import FeaturedSlides from "./FeaturedSlides";
import { Solutions } from "./Solutions";
import { Projects } from "./Projects";
import { Testimonials } from "./Testimonials";
import { Contact } from "./Contact";
import { MapSection } from "./MapSection";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;

    const footerEl = document.querySelector('footer');

    if (footerEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const isIntersecting = entries.some((e) => e.isIntersecting);
          setIsFooterVisible(isIntersecting);
        },
        { root: null, threshold: 0.05 }
      );
      observer.observe(footerEl);
    } else {
      const threshold = 150;
      const onScroll = () => {
        const scrolledToBottom =
          window.innerHeight + window.scrollY >=
          (document.documentElement.scrollHeight || document.body.scrollHeight) - threshold;
        setIsFooterVisible(scrolledToBottom);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Main Content - Slides first, then Hero and other sections */}
      <FeaturedSlides onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <Solutions onNavigate={onNavigate} />
      <Projects onNavigate={onNavigate} />
      <Testimonials onNavigate={onNavigate} />
      <Contact onNavigate={onNavigate} />
      <MapSection onNavigate={onNavigate} />
    </>
  );
}
