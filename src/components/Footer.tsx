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
import logoImage from '../assets/logo.png';


export function Footer() {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-black text-white">
      <div className="section-container py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Solar Hut Solutions Logo" 
                className="h-12 w-auto"
              />
            </Link>
            
            <p className="text-gray-300 leading-relaxed">
              Leading solar energy solutions provider in India. 
              Helping families and businesses save money while protecting the environment.
            </p>
            
            <div className="space-y-3">
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
            <h3 className="font-semibold mb-4 text-[#FFA500]">Services</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold mb-4 text-[#FFA500]">Company</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold mb-4 text-[#FFA500]">Resources</h3>
            <ul className="space-y-2">
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
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Licensed • Bonded • Insured</p>
            <div className="flex justify-center items-center space-x-8 text-xs text-gray-500">
              <span>MNRE Certified</span>
              <span>•</span>
              <span>ISO 9001:2015</span>
              <span>•</span>
              <span>BIS Approved</span>
              <span>•</span>
              <span>Authorized Solar Dealer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}