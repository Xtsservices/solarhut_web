import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CheckCircle, Sun, Shield, Award, Facebook, X, Instagram, Linkedin, Youtube, Phone, ArrowUp, Share2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isSocialExpanded, setIsSocialExpanded] = useState(true);

  const features = [
    {
      icon: CheckCircle,
      title: "Save up to 90% on electricity bills",
      description: "Immediate cost reduction from day one"
    },
    {
      icon: Shield,
      title: "Cyclone-resistant durable systems",
      description: "Built to withstand extreme weather conditions"
    },
    {
      icon: Award,
      title: "25-year performance warranty",
      description: "Long-term protection and peace of mind"
    }
  ];

  const stats = [
    { value: "1000+", label: "Homes Powered" },
    { value: "₹5M+", label: "Customer Savings" },
    { value: "15+", label: "Years Experience" }
  ];

  const socialLinks = [
    { icon: Facebook, color: "#1877F2", href: "https://www.facebook.com/profile.php?id=61583439000135#" },
    {
      icon: (props: any) => (
        <img
          src="https://pbs.twimg.com/profile_images/1683364393323577345/uUWH_TiG_400x400.jpg"
          alt="X Profile"
          style={{ width: '20px', height: '20px', borderRadius: '50%' }}
          {...props}
        />
      ),
      color: "#000000",
      href: "https://x.com/SOLAR_HUT"
    },
    {
      icon: (props: any) => (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram Profile"
          style={{ width: '60px', height: '40px', borderRadius: '50%' }}
          {...props}
        />
      ),
      color: undefined,
      href: "https://www.instagram.com/solarhutsolutions?igsh=MW1icG1yeGoycWV3Mg&utm_source=qr"
    },
    { icon: Linkedin, color: "#0A66C2", href: "https://www.linkedin.com/company/solar-hut-solutions" },
    { icon: Youtube, color: "#FF0000", href: "https://www.youtube.com/@SOLARHUT-q7o" }
  ];

  const contactLinks = [
    { icon: FaWhatsapp, color: "#25D366", href: "#", label: "WhatsApp" },
    { icon: Phone, color: "#4285F4", href: "#", label: "Call" },
    { icon: ArrowUp, color: "#FFA500", href: "#top", label: "Back to Top", isScrollTo: true }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detect when footer is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    // Observe the footer element
    const footer = document.querySelector('footer');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <section className="relative bg-[#FEF7ED] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="flex items-center space-x-2 text-[#FFA500]">
              <Sun className="w-4 h-4" />
              <span className="text-sm">Leading Solar Solutions Provider</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-2">
                Power Your Future
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2">
                with
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#FFA500]">
                Solar Hut Solutions
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-800">
              Save up to 90% on your electricity bills with our cyclone-resistant durable systems
            </p>

            {/* Description */}
            <p className="text-gray-600">
              Join thousands of satisfied customers who have made the switch to clean, renewable energy. 
              Professional installation with industry-leading warranties and flexible financing options.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-orange-100"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFA500] flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => onNavigate?.('enquiry')}
                className="bg-[#FFA500] hover:bg-[#FF8C00] text-white px-8"
              >
                Get Free Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate?.('about')}
                className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl text-[#FFA500] mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/src/assets/PowerYourFuture.png"
                alt="Solar panels installation in India"
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              
              {/* Solar Installer Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#FFA500] text-white border-0 px-4 py-2">
                  Solar Installer
                </Badge>
              </div>

              {/* Financing Badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Starting from</div>
                <div className="text-2xl text-[#FFA500] mb-1">₹0 Down</div>
                <div className="text-xs text-gray-500">Hassle-free financing available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons - Fixed at Bottom Right Above Contact Links in Column */}
      {!isFooterVisible && (
        <>
          {/* Desktop - Always Visible */}
          <div className="hidden sm:flex fixed bottom-28 right-6 z-50">
            <div className="flex flex-col space-y-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                  style={{ backgroundColor: social.color }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile - Collapsible */}
          <div className="sm:hidden fixed bottom-28 right-4 z-50">
            <div className="flex flex-col items-end space-y-3">
              {/* Social Icons - Collapsible */}
              <div className={`flex flex-col space-y-3 transition-all duration-300 origin-bottom ${
                isSocialExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
              }`}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
                    style={{ backgroundColor: social.color }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => setIsSocialExpanded(!isSocialExpanded)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label={isSocialExpanded ? "Hide social media" : "Show social media"}
              >
                {isSocialExpanded ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Share2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contact Links - Fixed at Bottom Right in Row */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center space-x-3">
          {contactLinks.map((contact, index) => {
            // Always show Back to Top button, hide others when footer is visible
            if (!contact.isScrollTo && isFooterVisible) {
              return null;
            }
            
            return contact.isScrollTo ? (
              <button
                key={index}
                onClick={scrollToTop}
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: contact.color }}
                title={contact.label}
              >
                <contact.icon className="w-5 h-5 text-white" />
                <span className="text-sm text-white hidden sm:inline">{contact.label}</span>
              </button>
            ) : (
              <a
                key={index}
                href={contact.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all hover:scale-105 shadow-md"
                style={{ backgroundColor: contact.color }}
                target="_blank"
                rel="noopener noreferrer"
                title={contact.label}
              >
                <contact.icon className="w-5 h-5 text-white" />
                <span className="text-sm text-white hidden sm:inline">{contact.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
