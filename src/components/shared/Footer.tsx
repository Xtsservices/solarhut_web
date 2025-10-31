import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";
import { useEffect, useState } from 'react';

// Import the logo
// @ts-ignore: Vite/Figma virtual asset provided at build time
import logoImage from '../../assets/image.png';
// @ts-ignore: Vite/Figma virtual asset provided at build time
import logoImage1 from '../../assets/MetadevLogo.png';



interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    services: false,
    company: false,
    resources: false,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
  }, []);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  };
  
  const footerLinks = {
    services: [
      { title: "Residential Solar", action: () => onNavigate?.('residential') },
      { title: "Commercial Solar", action: () => onNavigate?.('commercial') },
      { title: "Solar Installation", action: () => onNavigate?.('home') },
      { title: "System Maintenance", action: () => onNavigate?.('home') },
      { title: "Energy Storage", action: () => onNavigate?.('home') }
    ],
    company: [
      { title: "About Us", action: () => onNavigate?.('about') },
      { title: "Our Team", action: () => onNavigate?.('about') },
      { title: "Careers", action: () => onNavigate?.('home') },
      { title: "Testimonials", action: () => onNavigate?.('testimonials') },
      { title: "Gallery", action: () => onNavigate?.('gallery') }
    ],
    resources: [
      { title: "Solar Calculator", action: () => onNavigate?.('home') },
      { title: "Financing Options", action: () => onNavigate?.('home') },
      { title: "Warranties", action: () => onNavigate?.('home') },
      { title: "FAQs", action: () => onNavigate?.('home') },
      { title: "Contact Support", action: () => onNavigate?.('contact') }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 md:pt-10 md:pb-12 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={() => onNavigate?.('home')}
              className="flex items-center space-x-3"
            >
              <img 
                src={logoImage} 
                alt="Solar Hut Solutions Logo" 
                className="h-20 md:h-24 w-auto mt-4 md:mt-6"
              />
            </button>
            
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Leading solar energy solutions provider in India. 
              Helping families and businesses save money while protecting the environment.
            </p>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
                <span className="text-sm text-gray-300">Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
                <span className="text-sm text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
                <span className="text-sm text-gray-300">+91 87654 32109</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
                <span className="text-sm text-gray-300">info@solarhutsolutions.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[#FFA500] mt-4 md:mt-6 mb-4">Services</h3>
              {isMobile && (
                <button
                  className="text-gray-300 text-xl leading-none"
                  aria-expanded={!!openSections.services}
                  aria-controls="footer-services"
                  onClick={() => toggleSection('services')}
                  type="button"
                >
                  {openSections.services ? '−' : '+'}
                </button>
              )}
            </div>
            <ul id="footer-services" className={`${isMobile ? (openSections.services ? 'block' : 'hidden') : 'block'} space-y-2`}>
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={link.action}
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[#FFA500] mt-4 md:mt-6 mb-4">Company</h3>
              {isMobile && (
                <button
                  className="text-gray-300 text-xl leading-none"
                  aria-expanded={!!openSections.company}
                  aria-controls="footer-company"
                  onClick={() => toggleSection('company')}
                  type="button"
                >
                  {openSections.company ? '−' : '+'}
                </button>
              )}
            </div>
            <ul id="footer-company" className={`${isMobile ? (openSections.company ? 'block' : 'hidden') : 'block'} space-y-2`}>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={link.action}
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[#FFA500] mt-4 md:mt-6 mb-4">Resources</h3>
              {isMobile && (
                <button
                  className="text-gray-300 text-xl leading-none"
                  aria-expanded={!!openSections.resources}
                  aria-controls="footer-resources"
                  onClick={() => toggleSection('resources')}
                  type="button"
                >
                  {openSections.resources ? '−' : '+'}
                </button>
              )}
            </div>
            <ul id="footer-resources" className={`${isMobile ? (openSections.resources ? 'block' : 'hidden') : 'block'} space-y-2`}>
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={link.action}
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FFA500] transition-colors"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400 text-center">
              <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6">
                <span>© {currentYear} Solar Hut Solutions. All rights reserved.</span>
                 <span className="flex items-center gap-2 text-xs">
                   <span>Powered by <span className="text-[#FFA500]">Metadev</span></span>
                   <a href="https://metadev.in/" target="_blank" rel="noopener noreferrer">
                     <img src={logoImage1} alt="Metadev logo" className="h-20 w-auto" />
                   </a>
                 </span>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => onNavigate?.('home')} className="hover:text-[#FFA500] transition-colors">Privacy Policy</button>
                <button onClick={() => onNavigate?.('home')} className="hover:text-[#FFA500] transition-colors">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Licensed • Bonded • Insured</p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-500">
              <span>MNRE Certified</span>
              <span>ISO 9001:2015</span>
              <span>BIS Approved</span>
              <span>Authorized Solar Dealer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
