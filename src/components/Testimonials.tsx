import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, Quote, MapPin, DollarSign, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Homeowner",
      location: "Austin, TX",
      avatar: "SJ",
      rating: 5,
      savings: "$2,400/year",
      installDate: "2023",
      quote: "Solar Hut Solutions exceeded our expectations! The installation was seamless, and we're already seeing huge savings on our electricity bills. The team was professional, knowledgeable, and kept us informed throughout the entire process.",
      system: "12kW Residential System",
      featured: true
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Business Owner",
      location: "Dallas, TX",
      avatar: "MC",
      rating: 5,
      savings: "$15,000/year",
      installDate: "2023",
      quote: "As a business owner, the ROI from our solar installation has been incredible. Solar Hut Solutions delivered exactly what they promised, and our energy costs have dropped by 60%. Highly recommend them for any commercial project.",
      system: "85kW Commercial System",
      featured: true
    },
    {
      id: 3,
      name: "Jennifer Martinez",
      title: "Property Manager",
      location: "Houston, TX",
      avatar: "JM",
      rating: 5,
      savings: "$3,800/year",
      installDate: "2024",
      quote: "Managing multiple properties, I needed a reliable solar partner. Solar Hut Solutions has been amazing - from the initial consultation to ongoing maintenance. Our tenants love the reduced utility costs!",
      system: "18kW Multi-Property System",
      featured: true
    },
    {
      id: 4,
      name: "David Thompson",
      title: "Homeowner",
      location: "San Antonio, TX",
      avatar: "DT",
      rating: 5,
      savings: "$1,850/year",
      installDate: "2023",
      quote: "The quality of work and customer service from Solar Hut Solutions is outstanding. They handled everything from permits to installation, and our system has been performing flawlessly for over a year.",
      system: "8.5kW Residential System",
      featured: false
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      title: "Manufacturing Manager",
      location: "Fort Worth, TX",
      avatar: "LR",
      rating: 5,
      savings: "$45,000/year",
      installDate: "2022",
      quote: "Our industrial solar installation has been a game-changer for our manufacturing operations. The energy savings allow us to reinvest in our business while reducing our environmental impact.",
      system: "200kW Industrial System",
      featured: false
    },
    {
      id: 6,
      name: "Robert Kim",
      title: "Homeowner",
      location: "Plano, TX",
      avatar: "RK",
      rating: 5,
      savings: "$2,100/year",
      installDate: "2024",
      quote: "From start to finish, Solar Hut Solutions made the process easy and stress-free. The installation crew was respectful of our property, and the system looks great on our roof. We're thrilled with the results!",
      system: "10kW Residential System",
      featured: false
    }
  ];

  const stats = [
    { label: "Average Satisfaction", value: "4.9/5", icon: Star },
    { label: "Average Savings", value: "$8,500", icon: DollarSign },
    { label: "Happy Customers", value: "1,000+", icon: Quote },
    { label: "Years of Trust", value: "15+", icon: Calendar }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="testimonials" className="section-testimonials section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <Quote className="w-4 h-4 mr-2" />
            Customer Success Stories
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from real customers who have transformed 
            their energy future with Solar Hut Solutions' premium solar solutions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Customer Stories</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.filter(testimonial => testimonial.featured).map((testimonial) => (
              <Card key={testimonial.id} className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-bl-full"></div>
                <Quote className="absolute top-4 right-4 w-6 h-6 text-white" />
                
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  <blockquote className="text-gray-700 mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">System Size</span>
                      <Badge variant="outline" className="text-primary border-orange-200">
                        {testimonial.system}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Annual Savings</span>
                      <span className="font-semibold text-accent">{testimonial.savings}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Installed</span>
                      <span className="text-gray-900">{testimonial.installDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.filter(testimonial => !testimonial.featured).map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                    <p className="text-xs text-gray-600">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-sm text-gray-700 mb-3 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>{testimonial.system}</span>
                  <span className="text-accent font-medium">{testimonial.savings}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Testimonial CTA */}
        <div className="text-center bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              See More Customer Stories
            </h3>
            <p className="text-gray-600 mb-6">
              Watch video testimonials and read detailed case studies from our satisfied customers across Texas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Video Testimonials
              </button>
              <button className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-orange-50 transition-all duration-300">
                Read All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}