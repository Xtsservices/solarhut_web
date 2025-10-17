import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Star, 
  Quote, 
  MapPin, 
  Home, 
  Building2, 
  Factory,
  Play,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

interface CustomerStory {
  id: number;
  name: string;
  location: string;
  type: 'Residential' | 'Commercial' | 'Industrial';
  systemSize: string;
  savings: string;
  yearlySavings: string;
  rating: number;
  image: string;
  testimonial: string;
  shortTestimonial: string;
  date: string;
  hasVideo: boolean;
  roiPeriod: string;
  co2Saved: string;
  featured?: boolean;
}

export function FeaturedCustomerStories() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const customerStories: CustomerStory[] = [
    {
      id: 1,
      name: "Rajesh & Priya Kumar",
      location: "Mumbai, Maharashtra",
      type: "Residential",
      systemSize: "6.5 kW",
      savings: "₹8,500/month",
      yearlySavings: "₹1,02,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMGNvdXBsZXxlbnwxfHx8fDE3NTkwMzkxNjN8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Our monthly electricity bill dropped from ₹14,000 to just ₹5,500! The solar panels look great on our roof and the monitoring app lets us track our savings in real-time. Best decision we've made for our family's future.",
      shortTestimonial: "Cut our electricity bills by 60% and love tracking our daily solar generation!",
      date: "March 2024",
      hasVideo: true,
      roiPeriod: "4.2 years",
      co2Saved: "8.5 tons/year",
      featured: true
    },
    {
      id: 2,
      name: "Dr. Arun Gupta",
      location: "Bangalore, Karnataka",
      type: "Commercial",
      systemSize: "25 kW",
      savings: "₹35,000/month",
      yearlySavings: "₹4,20,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkxODZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "For our dental clinic, consistent power is crucial. The solar system with battery backup ensures zero downtime during procedures. Our patients appreciate our green initiative too!",
      shortTestimonial: "Zero power cuts and 70% savings - perfect for our medical practice!",
      date: "February 2024",
      hasVideo: false,
      roiPeriod: "3.8 years",
      co2Saved: "32 tons/year",
      featured: true
    },
    {
      id: 3,
      name: "Meera Industries",
      location: "Chennai, Tamil Nadu", 
      type: "Industrial",
      systemSize: "150 kW",
      savings: "₹1,25,000/month",
      yearlySavings: "₹15,00,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHdvbWFufGVufDF8fHx8MTc1OTAzOTE5N3ww&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Our textile manufacturing unit achieved energy independence with this massive installation. Production costs dropped significantly and we're now carbon neutral!",
      shortTestimonial: "Energy independence achieved - now we're a carbon neutral manufacturer!",
      date: "January 2024",
      hasVideo: true,
      roiPeriod: "3.2 years",
      co2Saved: "195 tons/year",
      featured: true
    },
    {
      id: 4,
      name: "Sunil & Family",
      location: "Pune, Maharashtra",
      type: "Residential",
      systemSize: "8 kW",
      savings: "₹12,000/month",
      yearlySavings: "₹1,44,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkxODZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Living in a joint family with high power consumption, solar was the perfect solution. Now we generate more than we consume and even sell back to the grid!",
      shortTestimonial: "Generate more than we consume - even earning from excess power!",
      date: "December 2023",
      hasVideo: false,
      roiPeriod: "4.5 years",
      co2Saved: "10.2 tons/year"
    },
    {
      id: 5,
      name: "Green Valley Resort",
      location: "Goa",
      type: "Commercial", 
      systemSize: "45 kW",
      savings: "₹65,000/month",
      yearlySavings: "₹7,80,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHdvbWFufGVufDF8fHx8MTc1OTAzOTIxOXww&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Our eco-resort now runs on 100% solar power. Guests love our sustainability story and our operational costs have decreased dramatically.",
      shortTestimonial: "100% solar powered resort - guests love our green commitment!",
      date: "November 2023",
      hasVideo: true,
      roiPeriod: "3.9 years",
      co2Saved: "58 tons/year"
    },
    {
      id: 6,
      name: "Smart Tech Solutions",
      location: "Hyderabad, Telangana",
      type: "Commercial",
      systemSize: "35 kW", 
      savings: "₹48,000/month",
      yearlySavings: "₹5,76,000",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkxNjN8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "As a tech company, we understand the importance of clean energy. Our office now runs on solar and our team is proud to work for a carbon-negative company.",
      shortTestimonial: "Our tech office is now carbon-negative thanks to solar power!",
      date: "October 2023",
      hasVideo: false,
      roiPeriod: "4.1 years",
      co2Saved: "45 tons/year"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential': return Home;
      case 'Commercial': return Building2;
      case 'Industrial': return Factory;
      default: return Home;
    }
  };

  const getTypeColors = (type: string) => {
    switch (type) {
      case 'Residential': 
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200'
        };
      case 'Commercial': 
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700', 
          border: 'border-emerald-200'
        };
      case 'Industrial': 
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200'
        };
      default: 
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200'
        };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ₹{i < rating ? 'text-[#FFA500] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="section-alternate-1 section-padding-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,165,0,0.15)_1px,transparent_0)] [background-size:24px_24px]"></div>
      
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#FFA500]/10 text-[#FFA500] px-4 py-2 rounded-full mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Featured Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Real Customers,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#2D8A47]">
              Real Results
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how families, businesses, and industries across India are transforming their energy future with our solar solutions
          </p>
        </motion.div>

        {/* Customer Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {customerStories.map((story, index) => {
            const TypeIcon = getTypeIcon(story.type);
            const typeColors = getTypeColors(story.type);
            
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                onMouseEnter={() => setHoveredCard(story.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group"
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ₹{story.featured ? 'ring-2 ring-[#FFA500]/20' : ''} ₹{hoveredCard === story.id ? 'scale-[1.02]' : ''}`}>
                  <CardContent className="p-0">
                    {/* Header with image and basic info */}
                    <div className="relative p-6 pb-4">
                      {story.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-[#FFA500] to-[#2D8A47] text-white border-0">
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <ImageWithFallback
                            src={story.image}
                            alt={story.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          {story.hasVideo && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Play className="w-3 h-3 text-white fill-current" />
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate">{story.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">{story.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                              {renderStars(story.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{story.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="px-6 pb-4">
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-1 w-6 h-6 text-[#FFA500]/20" />
                        <p className="text-gray-700 text-sm leading-relaxed pl-5">
                          "{story.shortTestimonial}"
                        </p>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#FFA500]">{story.systemSize}</div>
                          <div className="text-xs text-gray-500">System Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#2D8A47]">{story.savings}</div>
                          <div className="text-xs text-gray-500">Monthly</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#1B5E7C]">{story.roiPeriod}</div>
                          <div className="text-xs text-gray-500">ROI Period</div>
                        </div>
                      </div>
                    </div>

                    {/* Type badge and environmental impact */}
                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between">
                        <Badge className={`₹{typeColors.bg} ₹{typeColors.text} ₹{typeColors.border} border`}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {story.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Zap className="w-4 h-4 text-[#FFA500]" />
                          <span>{story.co2Saved} CO₂ saved</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect - full testimonial */}
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: hoveredCard === story.id ? 1 : 0,
                        height: hoveredCard === story.id ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {story.testimonial}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Success stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          {[
            { label: "Happy Customers", value: "10,000+", icon: "👥" },
            { label: "Total Savings", value: "₹50+ Cr", icon: "💰" },
            { label: "CO₂ Reduced", value: "25,000+ tons", icon: "🌱" },
            { label: "Average Rating", value: "4.9/5.0", icon: "⭐" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFA500] to-[#2D8A47] text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Share Your Success Story</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-sm text-gray-600 mt-3">
            Join our community of satisfied solar customers
          </p>
        </motion.div>
      </div>
    </section>
  );
}