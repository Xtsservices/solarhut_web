import React from "react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { ArrowRight, Zap } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
}

const slides: Slide[] = [
  {
    src: "/src/assets/c2bc912f-9408-4e38-988d-5c88663cb590.mp4",
    alt: "Professional Rooftop Solar Panel Installation",
    title: "Rooftop Solar Solutions",
    subtitle: "Harness the Power of the Sun",
    description: "Expert rooftop solar panel installations for homes and businesses. Save on energy bills and contribute to a sustainable future.",
    cta: "Get Free Quote"
  },
  {
    src: "/src/assets/Commercial-Solar.png",
    alt: "Professional Rooftop Solar Panel Installation",
    title: "Rooftop Solar Solutions",
    subtitle: "Harness the Power of the Sun",
    description: "Expert rooftop solar panel installations for homes and businesses. Save on energy bills and contribute to a sustainable future.",
    cta: "Get Free Quote"
  },
  {
    src: "/src/assets/IndustrialSolar.png",
    alt: "Commercial Building with Large-Scale Solar Panel System",
    title: "Commercial Solar Systems",
    subtitle: "Reduce Operating Costs for Your Business",
    description: "Enterprise-grade solar solutions for commercial buildings. Cut energy expenses and boost your sustainability profile.",
    cta: "Schedule Consultation"
  },
  {
    src: "/src/assets/GroundMountedSystems.png",
    alt: "Expansive Solar Panel Array Field Installation",
    title: "Industrial & Ground-Mounted",
    subtitle: "Large-Scale Solar Solutions",
    description: "Massive solar installations for industrial facilities and solar farms. Generate megawatts of clean, sustainable energy.",
    cta: "Explore Solutions"
  },
  {
    src: "/src/assets/AdvancedSolarTechnology.jpeg",
    alt: "Modern Solar Energy System Technology",
    title: "Advanced Solar Technology",
    subtitle: "Next-Generation Energy Solutions",
    description: "Cutting-edge solar systems with smart monitoring, energy storage, and maximum efficiency. The future of energy is here.",
    cta: "Learn More"
  },
  
];

interface FeaturedSlidesProps {
  onNavigate?: (page: string) => void;
}

const FeaturedSlides: React.FC<FeaturedSlidesProps> = ({ onNavigate }) => {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    // Only set interval for non-video slides
    if (current !== 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [current]);

  const handleVideoEnd = () => {
    // Move to next slide when video ends
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleCTAClick = () => {
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  return (
    <section className="w-full h-screen bg-gradient-to-r from-yellow-200 to-orange-200 flex items-center justify-center relative">
      {/* Background Video or Image */}
      {current === 0 ? (
        <video
          src={slides[current].src}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageWithFallback
          src={slides[current].src}
          alt={slides[current].alt}
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Dark Overlay - only for non-video slides */}
      {current !== 0 && <div className="absolute inset-0 bg-black/40" />}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-6 animate-fade-in">
          {/* Video slide - only show CTA button */}
          {current === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute bottom-16 left-0 right-0 flex justify-center animate-fade-up">
              {/* <Button
                size="lg"
                onClick={handleCTAClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 transition-all duration-300 transform hover:scale-105"
              >
                {slides[current].cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button> */}
            </div>
          </div>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-orange-500 p-4 rounded-full">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Subtitle */}
              <p className="text-orange-400 uppercase tracking-wider">
                {slides[current].subtitle}
              </p>
              
              {/* Title */}
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
                {slides[current].title}
              </h1>
              
              {/* Description */}
              <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                {slides[current].description}
              </p>
              
              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={handleCTAClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 transition-all duration-300 transform hover:scale-105"
                >
                  {slides[current].cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current 
                ? 'bg-orange-500 w-12 h-3' 
                : 'bg-white/50 hover:bg-white/75 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSlides;
