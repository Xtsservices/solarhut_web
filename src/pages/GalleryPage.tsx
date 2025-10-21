import React, { useEffect, useState } from "react";
import { Eye, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Use Vite-resolvable static assets from the project's `src/assets/SolarHutImages` folder
const imgIndustrial = new URL("../assets/SolarHutImages/solar1.jpeg", import.meta.url).href;
const imgCommercial = new URL("../assets/SolarHutImages/solar3.jpeg", import.meta.url).href;
const imgResidential = new URL("../assets/SolarHutImages/solar4.jpeg", import.meta.url).href;

const galleryData = [
  {
    id: 1,
    image: imgIndustrial,
    title: "Industrial Solar Installation",
    category: "industrial",
    location: "Hyderabad, Telangana",
    capacity: "250 kW",
  },
  {
    id: 2,
    image: imgCommercial,
    title: "Commercial Solar Power Plant",
    category: "commercial",
    location: "Vijayawada, Andhra Pradesh",
    capacity: "180 kW",
  },
  {
    id: 3,
    image: imgResidential,
    title: "Residential Rooftop Solar",
    category: "residential",
    location: "Visakhapatnam, Andhra Pradesh",
    capacity: "15 kW",
  },
];

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openLightbox = (id: number) => setSelectedImage(id);
  const closeLightbox = () => setSelectedImage(null);

  const selectedImageData = galleryData.find((item) => item.id === selectedImage);

  const nextImage = () => {
    if (selectedImage === null) return;
    const nextIndex = (galleryData.findIndex((item) => item.id === selectedImage) + 1) % galleryData.length;
    setSelectedImage(galleryData[nextIndex].id);
  };

  const prevImage = () => {
    if (selectedImage === null) return;
    const currentIndex = galleryData.findIndex((item) => item.id === selectedImage);
    const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    setSelectedImage(galleryData[prevIndex].id);
  };

  return (
    <>
      {/* Keep document title in a side-effect instead of relying on Helmet */}
      <DocumentTitle title="Gallery | Truzon Solar" />

      <div className="min-h-screen bg-white text-black">
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFA500] mb-4">Our Gallery</h1>
          <p className="text-lg md:text-xl text-gray-700">
            Explore our solar power installations across different sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 pb-16 max-w-7xl mx-auto">
          {galleryData.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-lg">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-56 sm:h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openLightbox(item.id)}
                  className="bg-white text-[#FFA500] rounded-full p-3 hover:bg-[#FFA500] hover:text-white transition"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm opacity-80">{item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && selectedImageData && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={closeLightbox}
          >
            {/* Cancel / Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute top-5 right-5 z-[9999] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFA500] hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Navigation */}
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>

              <button
                onClick={nextImage}
                aria-label="Next image"
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>

              {/* Smaller Image */}
              <img
                src={selectedImageData.image}
                alt={selectedImageData.title}
                onClick={() => setZoomedImage(selectedImageData.image)}
                loading="eager"
                className="w-full max-h-[60vh] md:max-h-[70vh] object-contain cursor-zoom-in bg-gray-100"
              />

              {/* Image Info */}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-black mb-2">{selectedImageData.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-[#FFA500]" />
                  {selectedImageData.location}
                </div>
                <p className="text-[#FFA500] font-semibold mb-2">{selectedImageData.capacity}</p>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  Category: {selectedImageData.category.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Zoomed Image Modal */}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
            onClick={() => setZoomedImage(null)}
          >
            <button
              onClick={() => setZoomedImage(null)}
              aria-label="Close zoomed image"
              className="absolute top-5 right-5 bg-white text-black rounded-full p-3 shadow-lg hover:bg-[#FFA500] hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Preview"
              className="max-w-[90%] max-h-[85%] object-contain rounded-lg shadow-2xl"
            />
          </div>
        )}
      </div>
    </>
  );
}

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
  return null;
}
