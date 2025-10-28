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
    src: "https://images.unsplash.com/photo-1635424709845-3a85ad5e1f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwc29sYXIlMjBwYW5lbHMlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzYxNTYxODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Professional Rooftop Solar Panel Installation",
    title: "Residential Solar Solutions",
    subtitle: "Power Your Home with Clean Energy",
    description: "Save up to 90% on electricity bills with our premium rooftop solar installations. Join thousands of happy homeowners across India.",
    cta: "Get Free Quote"
  },
  {
    src: "https://images.unsplash.com/photo-1583829315216-06c78572eace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NjE1NDcxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Commercial Building with Large-Scale Solar Panel System",
    title: "Commercial Solar Systems",
    subtitle: "Reduce Operating Costs for Your Business",
    description: "Enterprise-grade solar solutions for commercial buildings. Cut energy expenses and boost your sustainability profile.",
    cta: "Schedule Consultation"
  },
  {
    src: "https://images.unsplash.com/photo-1626251376234-8bc112f0bcd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwYXJyYXklMjBmaWVsZHxlbnwxfHx8fDE3NjE1NjE4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Expansive Solar Panel Array Field Installation",
    title: "Industrial & Ground-Mounted",
    subtitle: "Large-Scale Solar Solutions",
    description: "Massive solar installations for industrial facilities and solar farms. Generate megawatts of clean, sustainable energy.",
    cta: "Explore Solutions"
  },
  {
    src: "https://images.unsplash.com/photo-1709195325979-efb62c1f01a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2xhciUyMGVuZXJneSUyMHN5c3RlbXxlbnwxfHx8fDE3NjE1NjE4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = () => {
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  return (
    <section className="w-full h-screen bg-gradient-to-r from-yellow-200 to-orange-200 flex items-center justify-center relative">
      {/* Background Image */}
      <ImageWithFallback
        src={slides[current].src}
        alt={slides[current].alt}
        className="w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-6 animate-fade-in">
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
