import { Menu, X, ChevronDown, Phone, Download, Gift } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useRef } from 'react';

// @ts-ignore: accept importing image asset without a dedicated type declaration
import logoImage from '../../assets/image.png';
interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function Navbar({ onNavigate, currentPage = 'home' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'products' | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCount + 1 === 2) {
        onNavigate('login');
      } else if (clickCount + 1 === 1) {
        onNavigate('home');
      }
      setClickCount(0);
    }, 300);
  };

  const handleGetQuote = () => {
    onNavigate('enquiry');
  };

  const handleDownloadBrochure = () => {
    const brochureUrl = '/assets/solar-hut-brochure.pdf';
    const link = document.createElement('a');
    link.href = brochureUrl;
    link.download = 'Solar-Hut-Solutions-Brochure.pdf';
    link.click();
  };

  const handleReferEarn = () => {
    onNavigate('refer-earn');
  };

  const productsItems = [
    { title: 'Ground Mounted', action: () => onNavigate('ground-mounted') },
    { title: 'Residential Solar', action: () => onNavigate('residential') },
    { title: 'Commercial Solar', action: () => onNavigate('commercial') },
    { title: 'Industrial Solar', action: () => onNavigate('industrial') },
    { title: 'Solar Water Heaters', action: () => onNavigate('solar-water-heaters') },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="flex justify-between items-center py-2 sm:py-3 gap-2 sm:gap-4">
          {/* Logo - Left aligned with flex-start */}
          <div
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={handleLogoClick}
          >
            <img
              src={logoImage}
              alt="Solar Hut Solutions Logo"
              className="h-20 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain"
            />
          </div>

          {/* Desktop Menu - Center */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-14 2xl:gap-20 flex-1 justify-center text-xs xl:text-sm">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
              currentPage === 'home'
                ? 'text-[#FFA500] font-semibold border-b-2 border-[#FFA500] pb-1'
                : 'text-gray-700 hover:text-[#FFA500]'
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors ${
              currentPage === 'about'
                ? 'text-[#FFA500] font-semibold border-b-2 border-[#FFA500] pb-1'
                : 'text-gray-700 hover:text-[#FFA500]'
              }`}
            >
              About Us
            </button>

            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 transition-colors py-2 ${
              ['ground-mounted', 'residential', 'commercial', 'industrial', 'solar-water-heaters'].includes(currentPage)
                ? 'text-[#FFA500] font-semibold border-b-2 border-[#FFA500] pb-1'
                : 'text-gray-700 hover:text-[#FFA500]'
              }`}>
              <span>Products</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {activeDropdown === 'products' && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                {productsItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                  item.action();
                  setActiveDropdown(null);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-[#FFA500] hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {item.title}
                </button>
                ))}
              </div>
              )}
            </div>
            
            <button
              onClick={() => onNavigate('teams')}
              className={`transition-colors ${
              currentPage === 'teams'
              ? 'text-[#FFA500] font-semibold border-b-2 border-[#FFA500] pb-1'
              : 'text-gray-700 hover:text-[#FFA500]'
              }`}
            >
              Team
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors ${
              currentPage === 'contact'
                ? 'text-[#FFA500] font-semibold border-b-2 border-[#FFA500] pb-1'
                : 'text-gray-700 hover:text-[#FFA500]'
              }`}
            >
              Contact Us
            </button>
            </div>

            {/* Get Quote Button - Right */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0 justify-end">
    
            <button
              onClick={handleDownloadBrochure}
              className="flex items-center gap-1 xl:gap-2 bg-black text-white px-2 xl:px-4 py-1.5 xl:py-2 rounded text-xs xl:text-sm hover:bg-black/90 transition-colors"
            >
              <Download className="w-3 h-3 xl:w-4 xl:h-4" />
              Brochure
            </button>
            <button
              type="button"
              onClick={handleGetQuote}
              className="flex items-center gap-1 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 rounded-full border-2 border-[#FFA500] bg-white text-[#FFA500] hover:bg-[#FFA500] hover:text-white transition-colors text-xs xl:text-sm"
            >
              <Phone className="w-3 h-3 xl:w-4 xl:h-4" />
              <span>Get Quote</span>
            </button>
            {/* Login Button */}
  <button
    type="button"
    onClick={() => onNavigate('login')}
    className="flex items-center gap-1 xl:gap-2 px-3 xl:px-4 py-1.5 xl:py-2 rounded-full border-2 border-[#FFA500] bg-white text-[#FFA500] hover:bg-[#FFA500] hover:text-white transition-colors text-xs xl:text-sm"
  >
    Login
  </button>
            </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] bg-white z-50 overflow-y-auto">
            <div className="py-4 space-y-3 min-h-full">
            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-2 pb-3 border-b px-4">
              <button
                onClick={() => {
                  handleReferEarn();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-[#FFA500] text-white px-4 py-2 rounded text-sm hover:bg-[#FFA500]/90 transition-colors w-full"
              >
                <Gift className="w-4 h-4" />
                Refer & Earn
              </button>
              <button
                onClick={() => {
                  handleDownloadBrochure();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded text-sm hover:bg-black/90 transition-colors w-full"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </button>
              <button
                type="button"
                onClick={() => {
                  handleGetQuote();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-[#FFA500] bg-white text-[#FFA500] hover:bg-[#FFA500] hover:text-white transition-colors w-full"
              >
                <Phone className="w-4 h-4" />
                <span>Get Quote</span>
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${
                currentPage === 'home'
                  ? 'text-[#FFA500] bg-orange-50 font-semibold'
                  : 'text-gray-700 hover:text-[#FFA500] hover:bg-gray-50'
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${
                currentPage === 'about'
                  ? 'text-[#FFA500] bg-orange-50 font-semibold'
                  : 'text-gray-700 hover:text-[#FFA500] hover:bg-gray-50'
              }`}
            >
              About Us
            </button>

            {/* Mobile Products Dropdown */}
            <div className="border-b border-gray-200">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'products' ? null : 'products')
                }
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeDropdown === 'products' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeDropdown === 'products' && (
                <div className="bg-gray-50 pb-2">
                  {productsItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        item.action();
                        setActiveDropdown(null);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-10 py-3 text-gray-600 hover:text-[#FFA500] hover:bg-white transition-colors"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onNavigate('testimonials');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${
                currentPage === 'testimonials'
                  ? 'text-[#FFA500] bg-orange-50 font-semibold'
                  : 'text-gray-700 hover:text-[#FFA500] hover:bg-gray-50'
              }`}
            >
              Client Stories
            </button>

            <button
              onClick={() => {
                onNavigate('gallery');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${
                currentPage === 'gallery'
                  ? 'text-[#FFA500] bg-orange-50 font-semibold'
                  : 'text-gray-700 hover:text-[#FFA500] hover:bg-gray-50'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-6 py-4 transition-colors ${
                currentPage === 'contact'
                  ? 'text-[#FFA500] bg-orange-50 font-semibold'
                  : 'text-gray-700 hover:text-[#FFA500] hover:bg-gray-50'
              }`}
            >
              Contact Us
            </button>

            <div className="px-4 pt-2 pb-6">
              <Button
                onClick={() => {
                  onNavigate('enquiry');
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Get Free Quote
              </Button>
            </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
