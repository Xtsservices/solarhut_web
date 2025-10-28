import { useEffect, useState } from "react";
import { Eye, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface GalleryPageProps {
  onNavigate?: (page: string) => void;
}

const galleryData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1711884272371-cd61f372e2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNvbGFyJTIwcG93ZXIlMjBwbGFudHxlbnwxfHx8fDE3NjE1NjA1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Industrial Solar Installation",
    category: "industrial",
    location: "Hyderabad, Telangana",
    capacity: "250 kW",
    description: "Large-scale industrial solar installation powering manufacturing operations"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1540698868789-1d58f90db386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGNvbW1lcmNpYWwlMjBzb2xhciUyMHBhbmVscyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Commercial Solar Power Plant",
    category: "commercial",
    location: "Vijayawada, Andhra Pradesh",
    capacity: "180 kW",
    description: "Commercial building rooftop solar system for office complex"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1741233928760-4d3ca277f210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJlc2lkZW50aWFsJTIwc29sYXIlMjBwYW5lbHMlMjByb29mdG9wfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Residential Rooftop Solar",
    category: "residential",
    location: "Visakhapatnam, Andhra Pradesh",
    capacity: "15 kW",
    description: "Modern home solar installation with battery backup system"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1719256383688-305c0c00d179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNvbGFyJTIwZmFybSUyMGVuZXJneXxlbnwxfHx8fDE3NjE1NjA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Agricultural Solar Pumping",
    category: "agricultural",
    location: "Guntur, Andhra Pradesh",
    capacity: "25 kW",
    description: "Solar pumping system for irrigation in agricultural fields"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1726866492047-7f9516558c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGluc3RhbGxhdGlvbiUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NjE1NjA2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Industrial Warehouse Solar",
    category: "industrial",
    location: "Chennai, Tamil Nadu",
    capacity: "300 kW",
    description: "Large warehouse solar installation with energy monitoring system"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzYxNTYwNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Commercial Shopping Mall",
    category: "commercial",
    location: "Bangalore, Karnataka",
    capacity: "200 kW",
    description: "Shopping mall rooftop solar reducing energy costs by 70%"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1674606071893-2a9023075f70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGJsdWUlMjBza3l8ZW58MXx8fHwxNzYxNDg1NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Residential Villa Complex",
    category: "residential",
    location: "Pune, Maharashtra",
    capacity: "50 kW",
    description: "Gated community solar installation serving 20 villas"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1735584509085-4a03c468ace4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYxNTYwNjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Educational Institution",
    category: "institutional",
    location: "Mumbai, Maharashtra",
    capacity: "120 kW",
    description: "School campus solar system promoting green energy education"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1652039796905-5579dcfa14d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGVuZXJneSUyMGZhcm18ZW58MXx8fHwxNzYxNTYwNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Ground Mounted Solar Farm",
    category: "utility",
    location: "Jaipur, Rajasthan",
    capacity: "500 kW",
    description: "Utility-scale ground mounted solar farm feeding grid power"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1745393753678-c376bf8664d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBob3Rvdm9sdGFpYyUyMHN5c3RlbXxlbnwxfHx8fDE3NjE1NjA2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Hospital Solar Installation",
    category: "institutional",
    location: "Delhi",
    capacity: "150 kW",
    description: "Hospital solar system ensuring uninterrupted power supply"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwZ3JpZCUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NjE1NjA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Factory Rooftop Solar",
    category: "industrial",
    location: "Ahmedabad, Gujarat",
    capacity: "400 kW",
    description: "Textile factory solar installation reducing production costs"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1628206554201-41ebb06ef313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwbW9kdWxlc3xlbnwxfHx8fDE3NjE1NjA2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Luxury Residential Estate",
    category: "residential",
    location: "Gurgaon, Haryana",
    capacity: "35 kW",
    description: "Premium home solar with smart energy management system"
  },
];

export function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const openLightbox = (id: number) => setSelectedImage(id);
  const closeLightbox = () => {
    setSelectedImage(null);
    setZoomedImage(null);
  };

  const selectedImageData = galleryData.find((item) => item.id === selectedImage);

  const nextImage = () => {
    if (selectedImage === null) return;
    const filteredData = selectedCategory === "all" 
      ? galleryData 
      : galleryData.filter(item => item.category === selectedCategory);
    const nextIndex = (filteredData.findIndex((item) => item.id === selectedImage) + 1) % filteredData.length;
    setSelectedImage(filteredData[nextIndex].id);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    const filteredData = selectedCategory === "all" 
      ? galleryData 
      : galleryData.filter(item => item.category === selectedCategory);
    const currentIndex = filteredData.findIndex((item) => item.id === selectedImage);
    const prevIndex = (currentIndex - 1 + filteredData.length) % filteredData.length;
    setSelectedImage(filteredData[prevIndex].id);
  };

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "industrial", label: "Industrial" },
    { id: "institutional", label: "Institutional" },
    { id: "utility", label: "Utility Scale" },
    { id: "agricultural", label: "Agricultural" },
  ];

  const filteredGallery = selectedCategory === "all" 
    ? galleryData 
    : galleryData.filter(item => item.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'residential': return 'bg-blue-100 text-blue-700 border-0';
      case 'commercial': return 'bg-green-100 text-green-700 border-0';
      case 'industrial': return 'bg-orange-100 text-orange-700 border-0';
      case 'institutional': return 'bg-purple-100 text-purple-700 border-0';
      case 'utility': return 'bg-yellow-100 text-yellow-700 border-0';
      case 'agricultural': return 'bg-emerald-100 text-emerald-700 border-0';
      default: return 'bg-gray-100 text-gray-700 border-0';
    }
  };

  useEffect(() => {
    const prev = document.title;
    document.title = "Gallery | Solar Hut Solutions";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
              Our Gallery
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our solar power installations across different sectors. Real projects, real impact, real transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl text-[#FFA500] mb-2">500+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#FFA500] mb-2">50 MW+</div>
              <div className="text-gray-600">Total Capacity Installed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#FFA500] mb-2">15+</div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-[#FFA500] mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCategory(value)}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-12 h-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs md:text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGallery.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-lg bg-white hover:shadow-2xl transition-shadow">
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openLightbox(item.id)}
                            className="bg-white text-[#FFA500] rounded-full p-3 hover:bg-[#FFA500] hover:text-white transition"
                            aria-label="View image"
                          >
                            <Eye className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className={getCategoryBadgeColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl text-gray-900 mb-2">{item.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-2 text-[#FFA500]" />
                          {item.location}
                        </div>
                        <p className="text-[#FFA500] text-sm">{item.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">Want Your Project Featured Here?</h2>
          <p className="text-xl text-black/90 mb-8">
            Join hundreds of satisfied customers who have transformed their energy consumption with solar power
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={() => onNavigate && onNavigate('enquiry')}
            >
              Start Your Solar Journey
            </Button>
           
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && selectedImageData && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-5 right-5 z-[60] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFA500] hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Navigation */}
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFA500] hover:text-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFA500] hover:text-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative">
              <ImageWithFallback
                src={selectedImageData.image}
                alt={selectedImageData.title}
                onClick={() => setZoomedImage(selectedImageData.image)}
                className="w-full max-h-[60vh] md:max-h-[70vh] object-contain cursor-zoom-in bg-gray-100"
              />
            </div>

            {/* Image Info */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl text-gray-900 mb-2">{selectedImageData.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-[#FFA500]" />
                    {selectedImageData.location}
                  </div>
                </div>
                <Badge className={getCategoryBadgeColor(selectedImageData.category)}>
                  {selectedImageData.category}
                </Badge>
              </div>
              <p className="text-[#FFA500] text-lg mb-2">{selectedImageData.capacity}</p>
              <p className="text-gray-700">{selectedImageData.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            aria-label="Close zoomed image"
            className="absolute top-5 right-5 bg-white text-black rounded-full p-3 shadow-lg hover:bg-[#FFA500] hover:text-white transition z-[61]"
          >
            <X className="w-6 h-6" />
          </button>
          <ImageWithFallback
            src={zoomedImage}
            alt="Zoomed Preview"
            className="max-w-[95%] max-h-[95%] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
