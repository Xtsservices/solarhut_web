import { Button } from "./ui/button";
import { Menu, Phone, X, ChevronDown, Download, Gift } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImage from '/src/assets/SolarHut Logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"products" | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if current path matches navigation item
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Helper function to check if current path matches any products routes
  const isProductsActive = () => {
    return location.pathname.includes('/solutions/') || 
           location.pathname.includes('/ground-mounted') ||
           location.pathname.includes('/residential') ||
           location.pathname.includes('/commercial') ||
           location.pathname.includes('/industrial') ||
           location.pathname.includes('/solar-water');
  };

  const handlePhoneClick = () => {
    window.open('tel:+919876543210', '_self');
  };

  const productsItems = [
    { title: "Ground Mounted", href: "/solutions/ground-mounted" },
    { title: "Residential", href: "/solutions/residential" },
    { title: "Commercial", href: "/solutions/commercial" },
    { title: "Industrial", href: "/solutions/industrial" },
    { title: "Solar Water Heaters", href: "/solutions/solar-water-heaters" }
  ];

  const handleDownloadBrochure = () => {
    // Add brochure download logic here
    const brochureUrl = '/assets/solar-hut-brochure.pdf';
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = 'Solar-Hut-Solutions-Brochure.pdf';
    link.click();
  };

  const handleReferEarn = () => {
    navigate('/refer-earn');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-[#FFA500]/10">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>+91 98765 43210</span>
              </span>
              <span>✉️ info@solarhut.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleReferEarn}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1 text-xs font-medium hover:bg-white/30 transition-all duration-300 flex items-center space-x-1"
              >
                <Gift className="w-3 h-3" />
                <span>Refer & Earn</span>
              </button>
              <button 
                onClick={handleDownloadBrochure}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1 text-xs font-medium hover:bg-white/30 transition-all duration-300 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Download Brochure</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="Solar Hut Solutions Logo" 
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFA500] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-1 bg-black/5 rounded-full px-2 py-1 backdrop-blur-sm">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isActivePath('/') 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}
              >
                HOME
              </Link>
              
              <Link 
                to="/about" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isActivePath('/about') 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}
              >
                About Us
              </Link>
              
              {/* Products Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isProductsActive() 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}>
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {activeDropdown === 'products' && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#FFA500]/20 py-3 z-50 transform translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300"
                    onMouseEnter={() => setActiveDropdown('products')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {productsItems.map((item, index) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block px-6 py-3 text-black hover:text-[#FFA500] hover:bg-[#FFA500]/5 transition-all duration-200 border-b border-black/5 last:border-b-0 font-medium"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#FFA500] rounded-full opacity-60"></div>
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/testimonials" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isActivePath('/testimonials') 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}
              >
                Client Stories
              </Link>

              <Link 
                to="/gallery" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isActivePath('/gallery') 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}
              >
                Gallery
              </Link>

              <Link 
                to="/contact" 
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ₹{
                  isActivePath('/contact') 
                    ? 'bg-[#FFA500] text-white shadow-lg' 
                    : 'text-black hover:bg-[#FFA500]/10 hover:text-[#FFA500]'
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* Call to Action Button */}
            <div className="ml-8">
              <Button 
                className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={handlePhoneClick}
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center space-x-1 text-black hover:text-[#FFA500] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#FFA500]/20 py-4 bg-white">
            <nav className="flex flex-col space-y-3">
              {/* Action Buttons for Mobile */}
              <div className="flex flex-col space-y-2 pb-3 border-b border-[#FFA500]/20 mb-3">
                <button 
                  onClick={() => {
                    handleReferEarn();
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#FFA500] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#FFA500]/90 transition-colors w-full"
                >
                  Refer & Earn
                </button>
                <button 
                  onClick={() => {
                    handleDownloadBrochure();
                    setIsMenuOpen(false);
                  }}
                  className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-black/90 transition-colors w-full"
                >
                  Download Brochure
                </button>
              </div>

              <Link to="/" className="text-black hover:text-[#FFA500] transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>HOME</Link>
              
              <Link to="/about" className="text-black hover:text-[#FFA500] transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              
              <div className="space-y-2">
                <div className="text-black font-medium py-2">Products</div>
                <div className="pl-4 space-y-2">
                  {productsItems.map((item) => (
                    <Link 
                      key={item.title}
                      to={item.href} 
                      className="block text-black/70 hover:text-[#FFA500] transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/testimonials" className="text-black hover:text-[#FFA500] transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Client Stories</Link>
              
              <Link to="/gallery" className="text-black hover:text-[#FFA500] transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
              
              <Link to="/contact" className="text-black hover:text-[#FFA500] transition-colors py-2 font-medium" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              
              <Button 
                className="bg-[#FFA500] hover:bg-[#FFA500]/90 text-white w-fit" 
                onClick={() => {
                  setIsMenuOpen(false);
                  handlePhoneClick();
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}