import { useState } from 'react';
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { FeaturedCustomerStories } from "../components/FeaturedCustomerStories";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Star, 
  Quote,
  MapPin,
  Home,
  Building2,
  Factory,
  Play,
  ThumbsUp
} from "lucide-react";

export function TestimonialsPage() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      type: "Residential",
      systemSize: "5 kW",
      savings: "₹8,000/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkxNjN8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Solar Hut Solutions transformed our home with a 5kW system. Our electricity bill went from ₹12,000 to just ₹4,000 per month. The installation was professional and the monitoring system helps us track our savings daily. Best investment we've made!",
      date: "March 2024",
      hasVideo: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Bangalore, Karnataka",
      type: "Residential",
      systemSize: "3 kW",
      savings: "₹5,500/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b19a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHdvbWFufGVufDF8fHx8MTc1OTAzOTE3M3ww&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "As a working mother, managing electricity bills was always stressful. Solar Hut Solutions' team made the entire process seamless. The 3kW system covers 85% of our energy needs. The team is very responsive and provides excellent after-sales service.",
      date: "February 2024",
      hasVideo: false
    },
    {
      id: 3,
      name: "Amit Patel",
      location: "Pune, Maharashtra",
      type: "Commercial",
      systemSize: "25 kW",
      savings: "₹45,000/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkxODZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Our restaurant business was struggling with high electricity costs. Solar Hut Solutions installed a 25kW system that cut our monthly bills by 70%. The ROI was achieved in just 3 years. Their maintenance service ensures consistent performance.",
      date: "January 2024",
      hasVideo: true
    },
    {
      id: 4,
      name: "Dr. Kavita Singh",
      location: "Delhi",
      type: "Commercial",
      systemSize: "15 kW",
      savings: "₹28,000/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHdvbWFufGVufDF8fHx8MTc1OTAzOTE5N3ww&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "For our dental clinic, uninterrupted power is crucial. The solar system with battery backup from Solar Hut Solutions ensures we never face power cuts during treatments. Patients appreciate our commitment to green energy too!",
      date: "December 2023",
      hasVideo: false
    },
    {
      id: 5,
      name: "Suresh Industries",
      location: "Chennai, Tamil Nadu",
      type: "Industrial",
      systemSize: "100 kW",
      savings: "₹1,50,000/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMG1hbnxlbnwxfHx8fDE3NTkwMzkyMDh8MA&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Our textile manufacturing unit installed a 100kW system. The energy independence has improved our production efficiency and reduced operational costs significantly. Solar Hut Solutions' project management was exceptional throughout the installation.",
      date: "November 2023",
      hasVideo: true
    },
    {
      id: 6,
      name: "Meera Reddy",
      location: "Hyderabad, Telangana",
      type: "Residential",
      systemSize: "7 kW",
      savings: "₹12,000/month",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbCUyMHdvbWFufGVufDF8fHx8MTc1OTAzOTIxOXww&ixlib=rb-4.1.0&q=80&w=400",
      testimonial: "Living in a joint family with high electricity consumption, we were spending ₹18,000 monthly on power bills. The 7kW solar system now covers our entire usage. The smart monitoring app is fantastic - we can see real-time generation and savings.",
      date: "October 2023",
      hasVideo: false
    }
  ];

  const stats = [
    { label: "Customer Satisfaction", value: "98%", icon: ThumbsUp },
    { label: "Average Rating", value: "4.9/5", icon: Star },
    { label: "Happy Customers", value: "10,000+", icon: Home },
    { label: "Total Savings", value: "₹50 Cr+", icon: Building2 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential': return Home;
      case 'Commercial': return Building2;
      case 'Industrial': return Factory;
      default: return Home;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Residential': return 'bg-orange-100 text-orange-700';
      case 'Commercial': return 'bg-orange-100 text-orange-700';
      case 'Industrial': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filterTestimonials = (type: string) => {
    if (type === 'all') return testimonials;
    return testimonials.filter(testimonial => testimonial.type === type);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ₹{i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Customer Success Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Hear from our satisfied customers who have transformed their lives with solar energy. 
              Real stories, real savings, real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Customer Stories Section */}
      {/* <FeaturedCustomerStories /> */}

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#FFA500]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-lg text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">
              Real experiences from real customers across different solar solutions
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="Residential">Residential</TabsTrigger>
              <TabsTrigger value="Commercial">Commercial</TabsTrigger>
              <TabsTrigger value="Industrial">Industrial</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid lg:grid-cols-2 gap-8">
                {testimonials.map((testimonial) => {
                  const TypeIcon = getTypeIcon(testimonial.type);
                  return (
                    <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="relative">
                            <ImageWithFallback
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            {testimonial.hasVideo && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                              <Badge className={`₹{getTypeColor(testimonial.type)} border-0`}>
                                {testimonial.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{testimonial.location}</span>
                            </div>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(testimonial.rating)}
                              </div>
                              <span className="text-sm text-gray-600">{testimonial.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative mb-4">
                          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-200" />
                          <p className="text-gray-700 leading-relaxed pl-6">
                            {testimonial.testimonial}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#FFA500]">{testimonial.systemSize}</div>
                            <div className="text-sm text-gray-600">System Size</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#2D8A47]">{testimonial.savings}</div>
                            <div className="text-sm text-gray-600">Monthly Savings</div>
                          </div>
                          <div className="text-center">
                            <TypeIcon className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                            <div className="text-sm text-gray-600">{testimonial.type}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {['Residential', 'Commercial', 'Industrial'].map((type) => (
              <TabsContent key={type} value={type}>
                <div className="grid lg:grid-cols-2 gap-8">
                  {filterTestimonials(type).map((testimonial) => {
                    const TypeIcon = getTypeIcon(testimonial.type);
                    return (
                      <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="relative">
                              <ImageWithFallback
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              {testimonial.hasVideo && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white fill-current" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{testimonial.location}</span>
                              </div>
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center space-x-1">
                                  {renderStars(testimonial.rating)}
                                </div>
                                <span className="text-sm text-gray-600">{testimonial.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative mb-4">
                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-200" />
                            <p className="text-gray-700 leading-relaxed pl-6">
                              {testimonial.testimonial}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#FFA500]">{testimonial.systemSize}</div>
                              <div className="text-sm text-gray-600">System Size</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-[#2D8A47]">{testimonial.savings}</div>
                              <div className="text-sm text-gray-600">Monthly Savings</div>
                            </div>
                            <div className="text-center">
                              <TypeIcon className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                              <div className="text-sm text-gray-600">{testimonial.type}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Share Your Success Story?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who have made the smart switch to solar energy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={() => { window.location.href = '/contact'; }}
            >
              Get Your Quote Today
            </Button>
            {/* <Button size="lg" variant="outline" className="border-[#FFA500] text-[#FFA500] hover:bg-gray-100 hover:text-white">
              Schedule Free Consultation
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
}