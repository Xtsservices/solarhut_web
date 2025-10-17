import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button when page is scrolled up to given distance and calculate progress
  const toggleVisibility = () => {
    const scrolled = window.pageYOffset;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;
    
    setScrollProgress(progress);
    
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener with throttling for better performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(toggleVisibility, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Scroll to top smoothly with enhanced animation
  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          {/* Progress Ring */}
          <div className="relative w-14 h-14">
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              {/* Background ring */}
              <path
                className="text-gray-300/20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress ring */}
              <path
                className="text-orange-500"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`₹{scrollProgress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            {/* Button */}
            <Button
              onClick={scrollToTop}
              className="absolute inset-1 w-12 h-12 rounded-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              size="icon"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              Back to top
            </div>
          </div>
        </div>
      )}
    </>
  );
}