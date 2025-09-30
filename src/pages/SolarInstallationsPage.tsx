import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Wrench, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  ArrowRight,
  Settings,
  MapPin,
  Phone,
  Star
} from "lucide-react";

export function SolarInstallationsPage() {
  const services = [
    {
      title: "Residential Installation",
      description: "Complete rooftop solar installation for homes and apartments",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpbnN0YWxsYXRpb24lMjBzb2xhcnxlbnwxfHx8fDE3NTkwMzk0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Site assessment", "System design", "Professional installation", "Grid connection", "Net metering setup"],
      timeline: "1-3 days",
      warranty: "25 years"
    },
    {
      title: "Commercial Installation",
      description: "Large-scale solar solutions for businesses and institutions",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpbnN0YWxsYXRpb24lMjBzb2xhcnxlbnwxfHx8fDE3NTkwMzk0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Project management", "Engineering design", "Bulk installation", "Load analysis", "Performance monitoring"],
      timeline: "1-4 weeks",
      warranty: "25 years"
    },
    {
      title: "Industrial Installation",
      description: "High-capacity systems for manufacturing and industrial facilities",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpbnN0YWxsYXRpb24lMjBzb2xhcnxlbnwxfHx8fDE3NTkwMzk0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Feasibility study", "Custom engineering", "Phased installation", "Grid integration", "24/7 monitoring"],
      timeline: "2-8 weeks",
      warranty: "25 years"
    }
  ];

  const installationProcess = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "Free consultation to understand your energy needs and assess feasibility",
      duration: "1 day"
    },
    {
      step: "2",
      title: "Site Survey",
      description: "Detailed technical survey of roof structure, shading analysis, and electrical assessment",
      duration: "1-2 days"
    },
    {
      step: "3",
      title: "System Design",
      description: "Custom system design with 3D modeling and performance simulation",
      duration: "3-5 days"
    },
    {
      step: "4",
      title: "Approvals & Permits",
      description: "Handle all necessary approvals, permits, and documentation",
      duration: "7-15 days"
    },
    {
      step: "5",
      title: "Procurement",
      description: "Source high-quality solar panels, inverters, and mounting systems",
      duration: "5-10 days"
    },
    {
      step: "6",
      title: "Installation",
      description: "Professional installation by certified technicians with safety protocols",
      duration: "1-3 days"
    },
    {
      step: "7",
      title: "Testing & Commissioning",
      description: "System testing, performance verification, and official commissioning",
      duration: "1-2 days"
    },
    {
      step: "8",
      title: "Grid Connection",
      description: "Net meter installation and grid synchronization with utility company",
      duration: "5-10 days"
    }
  ];

  const qualityStandards = [
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Only Tier-1 solar panels and certified components used in all installations"
    },
    {
      icon: Users,
      title: "Certified Technicians",
      description: "All installations performed by trained and certified solar technicians"
    },
    {
      icon: Settings,
      title: "Advanced Tools",
      description: "State-of-the-art installation tools and safety equipment for precision work"
    },
    {
      icon: Clock,
      title: "Timely Completion",
      description: "Project completion within committed timelines with minimal disruption"
    }
  ];

  const safetyMeasures = [
    "Comprehensive safety training for all technicians",
    "Use of safety harnesses and fall protection equipment",
    "Electrical safety protocols and lockout/tagout procedures",
    "Regular safety audits and compliance checks",
    "Insurance coverage for all installation activities",
    "Emergency response procedures and first aid training"
  ];

  const afterSalesSupport = [
    {
      title: "Performance Monitoring",
      description: "24/7 system monitoring with real-time alerts and performance reports",
      included: true
    },
    {
      title: "Maintenance Services",
      description: "Regular cleaning, inspection, and preventive maintenance services",
      included: true
    },
    {
      title: "Technical Support",
      description: "Dedicated helpline for technical queries and troubleshooting",
      included: true
    },
    {
      title: "Warranty Management",
      description: "Comprehensive warranty support for panels, inverters, and workmanship",
      included: true
    },
    {
      title: "System Upgrades",
      description: "Future system expansion and upgrade services as per requirements",
      included: false
    },
    {
      title: "Insurance Claims",
      description: "Assistance with insurance claims for weather damage or accidents",
      included: false
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFA500] via-[#FF8C00] to-[#FFE4B5] text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Professional Solar Installations
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Expert solar installation services with certified technicians, premium components, 
              and comprehensive support. From residential rooftops to large industrial projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <Wrench className="mr-2 w-5 h-5" />
                Schedule Installation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="mr-2 w-5 h-5" />
                Call: 1800-123-SOLAR
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Installation Services</h2>
            <p className="text-xl text-gray-600">
              Comprehensive solar installation solutions for all types of properties
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-gray-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Timeline: {service.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4" />
                          <span>Warranty: {service.warranty}</span>
                        </div>
                      </div>
                      <Button size="sm">
                        Get Quote
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Installation Process</h2>
            <p className="text-xl text-gray-600">
              Our systematic approach ensures smooth and efficient solar installations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {installationProcess.map((step, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.duration}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quality Standards</h2>
            <p className="text-xl text-gray-600">
              Uncompromising quality in every aspect of our installation services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityStandards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{standard.title}</h3>
                    <p className="text-gray-600">{standard.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Measures */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety First Approach</h2>
            <p className="text-xl text-gray-600">
              Comprehensive safety protocols ensure secure installations for our team and your property
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* After-Sales Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">After-Sales Support</h2>
            <p className="text-xl text-gray-600">
              Comprehensive support services to ensure optimal system performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {afterSalesSupport.map((support, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{support.title}</h3>
                    {support.included ? (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        Included
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                        Optional
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{support.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6">
                "Excellent installation service! The team was professional, completed work on time, 
                and the system has been performing perfectly for over a year. Highly recommend their services."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <div className="font-bold text-gray-900">Rajesh Kumar</div>
                  <div className="text-sm text-gray-600">Mumbai • 5 kW Residential</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Professional Solar Installation?</h2>
          <p className="text-xl mb-8">
            Get expert installation with certified technicians and premium components
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MapPin className="mr-2 w-5 h-5" />
              Schedule Site Survey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Phone className="mr-2 w-5 h-5" />
              Call for Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}