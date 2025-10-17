import { useState } from 'react';
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  MapPin, 
  Zap, 
  Calendar,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const galleryItems = [
    {
      id: 1,
      title: "Residential Solar Installation",
      location: "Mumbai, Maharashtra",
      capacity: "500 kW",
      category: "residential",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHByb2plY3RzJTIwZ2FsbGVyeSUyMGluc3RhbGxhdGlvbnN8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "Industrial Rooftop System",
      location: "Pune, Maharashtra", 
      capacity: "2 MW",
      category: "industrial",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGluZHVzdHJ5fGVufDF8fHx8MTc1OTAzODkzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "Commercial Building Solar",
      location: "Bengaluru, Karnataka",
      capacity: "1.5 MW",
      category: "commercial",
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGNvbW1lcmNpYWx8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      title: "Ground Mounted Solar Farm",
      location: "Rajasthan",
      capacity: "10 MW",
      category: "ground-mounted",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm18ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      title: "Residential Community Solar",
      location: "Chennai, Tamil Nadu",
      capacity: "800 kW",
      category: "residential",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHJlc2lkZW50aWFsfGVufDF8fHx8MTc1OTAzODkzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      title: "Manufacturing Plant Solar",
      location: "Hyderabad, Telangana",
      capacity: "3 MW",
      category: "industrial",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 7,
      title: "Office Complex Solar",
      location: "Gurgaon, Haryana",
      capacity: "1.2 MW",
      category: "commercial",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMG9mZmljZXxlbnwxfHx8fDE3NTkwMzg5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 8,
      title: "Solar Water Heating System",
      location: "Kochi, Kerala",
      capacity: "50 kW",
      category: "solar-water",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHdhdGVyJTIwaGVhdGluZ3xlbnwxfHx8fDE3NTkwMzg5Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'ground-mounted', name: 'Ground Mounted' },
    { id: 'solar-water', name: 'Solar Water' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (id: number) => {
    setSelectedImage(id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex].id);
  };

  const prevImage = () => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    const prevIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    setSelectedImage(filteredItems[prevIndex].id);
  };

  const selectedImageData = galleryItems.find(item => item.id === selectedImage);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#fef7ed' }}>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-[#FFA500]/10 text-[#FFA500] px-6 py-2 rounded-full text-sm font-medium mb-6 mt-12">
              <Eye className="w-4 h-4 mr-2" />
              Our Project Gallery
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Successful Solar 
              <span className="text-[#FFA500]"> Installations</span>
            </h1>
            <p className="text-xl text-black/70 mb-8 leading-relaxed">
              Explore our portfolio of successful solar projects across India, showcasing our expertise in residential, commercial, and industrial installations.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
                <Zap className="w-5 h-5 text-[#FFA500] mr-2" />
                <span className="text-black font-semibold">500+ Projects</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
                <MapPin className="w-5 h-5 text-[#FFA500] mr-2" />
                <span className="text-black font-semibold">Pan India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Browse by Category</h2>
            <p className="text-black/70 max-w-2xl mx-auto">
              Filter our projects by type to see specific installations that match your requirements
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ₹{
                  selectedCategory === category.id 
                    ? "bg-[#FFA500] text-white shadow-lg" 
                    : "bg-white text-black border-2 border-black/10 hover:border-[#FFA500] hover:text-[#FFA500] shadow-sm"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {filteredItems.length > 0 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.name} 
                <span className="text-[#FFA500]"> Gallery</span>
              </h2>
              <p className="text-black/70 text-lg">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-[#FFA500]/30 overflow-hidden mb-8"
                onClick={() => openLightbox(item.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#FFA500] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {item.capacity}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-lg text-black mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-black/70 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1 text-[#FFA500]" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-[#FFA500]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-12 h-12 text-[#FFA500]" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">No Projects Found</h3>
                <p className="text-black/70 text-lg mb-6">
                  We don't have any projects in this category yet, but we're always working on new installations.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-[#FFA500] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FFA500]/90 transition-colors"
                >
                  View All Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedImageData.image}
                alt={selectedImageData.title}
                className="w-full h-[60vh] object-cover"
              />
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-3xl font-bold text-black leading-tight">
                    {selectedImageData.title}
                  </h3>
                  <span className="bg-[#FFA500] text-white px-4 py-2 rounded-full text-lg font-semibold ml-4">
                    {selectedImageData.capacity}
                  </span>
                </div>
                <div className="flex items-center text-black/70 text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-[#FFA500]" />
                  {selectedImageData.location}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-black/70 text-sm uppercase tracking-wider font-medium mb-2">
                    Project Category
                  </p>
                  <p className="text-black capitalize font-semibold">
                    {selectedImageData.category.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}