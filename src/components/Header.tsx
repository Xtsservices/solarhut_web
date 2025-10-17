import { Button } from "./ui/button";
import { Menu, Phone, X, ChevronDown, Download, Gift } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Use URL import to avoid TypeScript module resolution issues with asset filenames
const logoImage = new URL('../assets/SolarHut Logo.png', import.meta.url).href;

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Solar Hut Solutions Logo" 
              className="h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation and Buttons */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors font-medium ${
                isActivePath('/') 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
              }`}
            >
              HOME
            </Link>
            
            <Link 
              to="/about" 
              className={`transition-colors font-medium ${
                isActivePath('/about') 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
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
              <button className={`flex items-center space-x-1 transition-colors py-2 font-medium ${
                isProductsActive() 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
              }`}>
                <span>Products</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {activeDropdown === 'products' && (
                <div 
                  className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown('products')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {productsItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block px-4 py-3 text-black hover:text-[#FFA500] hover:bg-white transition-colors border-b border-black/10 last:border-b-0"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/testimonials" 
              className={`transition-colors font-medium ${
                isActivePath('/testimonials') 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
              }`}
            >
              Client Stories
            </Link>

            <Link 
              to="/gallery" 
              className={`transition-colors font-medium ${
                isActivePath('/gallery') 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
              }`}
            >
              Gallery
            </Link>

            <Link 
              to="/contact" 
              className={`transition-colors font-medium ${
                isActivePath('/contact') 
                  ? 'text-[#FFA500] border-b-2 border-[#FFA500] pb-1' 
                  : 'text-black hover:text-[#FFA500]'
              }`}
            >
              Contact Us
            </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                <button 
                onClick={handleReferEarn}
                className="bg-[#FFA500] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#FFA500]/90 transition-colors"
                >
                Refer & Earn
                </button>
                <button 
                onClick={handleDownloadBrochure}
                className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-black/90 transition-colors"
                >
                Download Brochure
                </button>
                
                <Button 
                className="group bg-white text-[#FFA500] border-2 border-[#FFA500] hover:bg-[#FFA500] hover:text-white flex items-center space-x-2 transition-colors"
                onClick={handlePhoneClick}
                >
                <Phone className="w-4 h-4 group-hover:text-white text-[#FFA500] transition-colors" />
                <span className="group-hover:text-white text-[#FFA500] transition-colors">Call Now</span>
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