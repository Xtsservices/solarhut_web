import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
// Use URL import to avoid TypeScript module resolution issues if filename contains spaces
const logoImage = new URL('../assets/logo.png', import.meta.url).href;


export function Footer() {
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
      "Residential Solar",
      "Commercial Solar", 
      "Solar Installation",
      "System Maintenance",
      "Energy Storage"
    ],
    company: [
      "About Us",
      "Our Team",
      "Careers",
      "Testimonials",
      "Blog"
    ],
    resources: [
      "Solar Calculator",
      "Financing Options",
      "Warranties",
      "FAQs",
      "Contact Support"
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
  <footer className="bg-black text-white pt-10 md:pt-12 lg:pt-16">
  <div className="section-container pt-20 pb-6 md:pt-12 md:pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Solar Hut Solutions Logo" 
                className="h-20 md:h-24 w-auto mt-4 md:mt-6"
              />
            </Link>
            
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Leading solar energy solutions provider in India. 
              Helping families and businesses save money while protecting the environment.
            </p>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#FFA500]" />
                <span className="text-sm text-gray-300">Hyderabad,Telangana,India.</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#FFA500]" />
                <span className="text-sm text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#FFA500]" />
                <span className="text-sm text-gray-300">+91 87654 32109</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#FFA500]" />
                <span className="text-sm text-gray-300">info@solarhutsolutions.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2 text-[#FFA500] mt-4 md:mt-6">Services</h3>
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
            <ul id="footer-services" className={`${isMobile ? (openSections.services ? 'block' : 'hidden') : 'block'} space-y-1 sm:space-y-2`}>
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2 text-[#FFA500] mt-4 md:mt-6">Company</h3>
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
            <ul id="footer-company" className={`${isMobile ? (openSections.company ? 'block' : 'hidden') : 'block'} space-y-1 sm:space-y-2`}>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2 text-[#FFA500] mt-4 md:mt-6">Resources</h3>
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
            <ul id="footer-resources" className={`${isMobile ? (openSections.resources ? 'block' : 'hidden') : 'block'} space-y-1 sm:space-y-2`}>
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-[#FFA500] transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FFA500] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6">
                <span>© {currentYear} Solar Hut Solutions. All rights reserved.</span>
                <span className="text-xs">Powered by <span className="text-[#FFA500] font-medium">Metadev</span></span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-[#FFA500] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#FFA500] transition-colors">Terms of Service</a>
              </div>
            </div>
            
            {/* Back to top button (moved here from HomePage) */}
            <div className="mt-4 md:mt-0 md:ml-auto flex justify-end">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                title="Back to top"
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary hover:bg-primary/90 focus:ring-primary"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V6" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
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