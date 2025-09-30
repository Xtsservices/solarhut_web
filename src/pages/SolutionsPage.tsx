import { Link } from 'react-router-dom';
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Home, 
  Factory, 
  Building2, 
  MapPin, 
  Droplets, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export function SolutionsPage() {
  const solutions = [
    {
      id: "residential",
      title: "Residential Solutions",
      description: "Power your home with clean solar energy and save up to 90% on electricity bills",
      icon: Home,
      image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Rooftop Installation", "Net Metering", "25-Year Warranty", "Smart Monitoring"],
      link: "/solutions/residential"
    },
    {
      id: "commercial",
      title: "Commercial Solutions",
      description: "Reduce operational costs and enhance your business sustainability",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Large Scale Installation", "Energy Management", "Tax Benefits", "Quick ROI"],
      link: "/solutions/commercial"
    },
    {
      id: "industrial",
      title: "Industrial Solutions",
      description: "High-capacity solar solutions for manufacturing and industrial facilities",
      icon: Factory,
      image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["MW Scale Projects", "Grid Integration", "Power Purchase Agreement", "24/7 Support"],
      link: "/solutions/industrial"
    },
    {
      id: "ground-mounted",
      title: "Ground Mounted Systems",
      description: "Utility-scale solar farms and ground-mounted installations",
      icon: MapPin,
      image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Solar Farms", "Land Optimization", "Environmental Impact", "Grid Connection"],
      link: "/solutions/ground-mounted"
    },
    {
      id: "water-heaters",
      title: "Solar Water Heaters",
      description: "Efficient solar water heating systems for homes and businesses",
      icon: Droplets,
      image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Energy Efficient", "Cost Effective", "Eco Friendly", "Low Maintenance"],
      link: "/solutions/solar-water-heaters"
    }
  ];

  const benefits = [
    "Up to 90% reduction in electricity bills",
    "25-year performance warranty",
    "Zero maintenance costs",
    "Increase property value",
    "Government subsidies available",
    "Carbon footprint reduction"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative section-hero-orange-white text-white py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Solar Solutions for Every Need
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              From residential rooftops to large-scale industrial installations, 
              we provide comprehensive solar solutions tailored to your requirements
            </p>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Solar?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of clean, renewable energy with our advanced solar solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Solar Solutions</h2>
            <p className="text-xl text-gray-600">
              Comprehensive solar solutions designed for different applications and requirements
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card key={solution.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{solution.description}</p>
                    <div className="space-y-2 mb-6">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={solution.link}>
                      <Button className="w-full group">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Solar Technology</h2>
              <p className="text-lg text-gray-700 mb-6">
                We use only the highest quality solar panels and components from leading manufacturers, 
                ensuring maximum efficiency and long-term reliability for your solar investment.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">22%+</div>
                  <div className="text-sm text-gray-600">Panel Efficiency</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">25 Years</div>
                  <div className="text-sm text-gray-600">Warranty</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">0.5%</div>
                  <div className="text-sm text-gray-600">Annual Degradation</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">99%</div>
                  <div className="text-sm text-gray-600">Uptime Guarantee</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700">Tier 1 Panels</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">MNRE Approved</Badge>
                <Badge variant="outline" className="border-yellow-200 text-yellow-700">IEC Certified</Badge>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHNvbHV0aW9ucyUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU5MDM4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Solar Technology"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8">
            Get a free consultation and customized quote for your solar solution today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#FFA500] hover:bg-gray-100">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#FFA500]">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}