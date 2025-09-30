import { Button } from "./ui/button";
import { Menu, Phone, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from '../assets/logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"solutions" | "company" | "resources" | null>(null);

  const solutionsItems = [
    { title: "Residential Solar", href: "/solutions/residential" },
    { title: "Commercial Solar", href: "/solutions/commercial" },
    { title: "Industrial Solar", href: "/solutions/industrial" },
    { title: "Ground Mounted", href: "/solutions/ground-mounted" },
    { title: "Solar Water Heaters", href: "/solutions/solar-water-heaters" }
  ];

  const companyItems = [
    { title: "About Us", href: "/about" },
    { title: "Awards & Recognition", href: "/awards" },
    { title: "Testimonials", href: "/testimonials" }
  ];

  const resourcesItems = [
    { title: "Our Projects", href: "/projects" },
    { title: "Blog & News", href: "/blog" },
    { title: "FAQ", href: "/faq" },
    { title: "Government Subsidies", href: "/subsidy" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
            <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Solar Hut Solutions Logo" 
              className="h-28 w-28 object-contain"
              style={{ maxHeight: "7rem" }}
            />
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-[#FFA500] transition-colors"
            >
              Home
            </Link>
            
            {/* Solutions Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FFA500] transition-colors py-2">
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {activeDropdown === 'solutions' && (
                <div 
                  className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {solutionsItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-[#FFA500] hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Company Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('company')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FFA500] transition-colors py-2">
                <span>Company</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {activeDropdown === 'company' && (
                <div 
                  className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown('company')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {companyItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-[#FFA500] hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-[#FFA500] transition-colors py-2">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {activeDropdown === 'resources' && (
                <div 
                  className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown('resources')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block px-4 py-3 text-gray-700 hover:text-[#FFA500] hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-[#FFA500] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-[#FFA500]" />
              <span>+91 98765 43210</span>
            </div>
            <Button className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white">
              Get Free Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center space-x-1 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-orange-100 py-4 bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-[#FFA500] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              
              <div className="space-y-2">
                <div className="text-gray-700 font-medium py-2">Solutions</div>
                <div className="pl-4 space-y-2">
                  {solutionsItems.map((item) => (
                    <Link 
                      key={item.title}
                      to={item.href} 
                      className="block text-gray-600 hover:text-[#FFA500] transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-gray-700 font-medium py-2">Company</div>
                <div className="pl-4 space-y-2">
                  {companyItems.map((item) => (
                    <Link 
                      key={item.title}
                      to={item.href} 
                      className="block text-gray-600 hover:text-[#FFA500] transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-gray-700 font-medium py-2">Resources</div>
                <div className="pl-4 space-y-2">
                  {resourcesItems.map((item) => (
                    <Link 
                      key={item.title}
                      to={item.href} 
                      className="block text-gray-600 hover:text-[#FFA500] transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link to="/contact" className="text-gray-700 hover:text-[#FFA500] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 py-2">
                <Phone className="w-4 h-4 text-[#FFA500]" />
                <span>+91 98765 43210</span>
              </div>
              <Link to="/contact">
                <Button className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white w-fit" onClick={() => setIsMenuOpen(false)}>
                  Get Free Quote
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}