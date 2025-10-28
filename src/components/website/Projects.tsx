import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  MapPin, 
  Calendar, 
  Zap, 
  IndianRupee,
  ArrowRight,
  Home,
  Building2,
  Factory
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ProjectsProps {
  onNavigate?: (page: string) => void;
}

export function Projects({ onNavigate }: ProjectsProps) {
  const handleStartProject = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const handleViewAllProjects = () => {
    if (onNavigate) {
      onNavigate('projects');
    }
  };

  const handleViewGallery = () => {
    if (onNavigate) {
      onNavigate('gallery');
    }
  };

  const projects = [
    {
      id: 1,
      title: "Sunrise Residential Complex",
      type: "Residential",
      location: "Mumbai, Maharashtra",
      capacity: "2.5 MW",
      date: "2024",
      savings: "₹45,00,000 annually",
      image: "https://images.unsplash.com/photo-1741233928760-4d3ca277f210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJlc2lkZW50aWFsJTIwc29sYXIlMjBwYW5lbHMlMjByb29mdG9wfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "150-home solar installation providing clean energy to entire residential community.",
      icon: Home,
      featured: true
    },
    {
      id: 2,
      title: "Tech Campus Solar Array",
      type: "Commercial",
      location: "Bangalore, Karnataka",
      capacity: "1.8 MW",
      date: "2024",
      savings: "₹32,00,000 annually",
      image: "https://images.unsplash.com/photo-1540698868789-1d58f90db386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGNvbW1lcmNpYWwlMjBzb2xhciUyMHBhbmVscyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Large-scale commercial installation powering corporate headquarters.",
      icon: Building2,
      featured: true
    },
    {
      id: 3,
      title: "Green Manufacturing Plant",
      type: "Industrial",
      location: "Pune, Maharashtra",
      capacity: "5.2 MW",
      date: "2023",
      savings: "₹89,00,000 annually",
      image: "https://images.unsplash.com/photo-1711884272371-cd61f372e2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNvbGFyJTIwcG93ZXIlMjBwbGFudHxlbnwxfHx8fDE3NjE1NjA1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Massive industrial solar installation reducing carbon footprint by 80%.",
      icon: Factory,
      featured: true
    },
    {
      id: 4,
      title: "Eco-Friendly Retail Center",
      type: "Commercial",
      location: "Delhi NCR",
      capacity: "850 kW",
      date: "2023",
      savings: "₹18,00,000 annually",
      image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzYxNTYwNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Shopping center installation with integrated energy storage system.",
      icon: Building2,
      featured: false
    },
    {
      id: 5,
      title: "Luxury Home Solar System",
      type: "Residential",
      location: "Hyderabad, Telangana",
      capacity: "45 kW",
      date: "2023",
      savings: "₹1,20,000 annually",
      image: "https://images.unsplash.com/photo-1674606071893-2a9023075f70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGJsdWUlMjBza3l8ZW58MXx8fHwxNzYxNDg1NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Premium residential installation with smart home integration.",
      icon: Home,
      featured: false
    },
    {
      id: 6,
      title: "Agricultural Solar Farm",
      type: "Ground Mounted",
      location: "Chennai, Tamil Nadu",
      capacity: "3.5 MW",
      date: "2022",
      savings: "₹62,00,000 annually",
      image: "https://images.unsplash.com/photo-1719256383688-305c0c00d179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNvbGFyJTIwZmFybSUyMGVuZXJneXxlbnwxfHx8fDE3NjE1NjA1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Large ground-mounted array supporting sustainable farming practices.",
      icon: MapPin,
      featured: false
    }
  ];

  const stats = [
    { label: "Total Projects", value: "500+", icon: MapPin },
    { label: "Megawatts Installed", value: "50+ MW", icon: Zap },
    { label: "Customer Savings", value: "₹5 Crore+", icon: IndianRupee },
    { label: "Years Experience", value: "15+", icon: Calendar }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Residential": return "bg-orange-100 text-orange-800";
      case "Commercial": return "bg-amber-100 text-amber-800";
      case "Industrial": return "bg-yellow-100 text-yellow-800";
      case "Ground Mounted": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section id="projects" className="section-projects section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Our Success Stories
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-4">
            Projects That Power Communities
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore our portfolio of successful solar installations across India. 
            From residential homes to large industrial complexes, see how we're transforming energy landscapes.
          </p>
        </div>

        {/* Stats - Scrollable on Mobile */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFA500] rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Mobile Horizontal Scroll */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg bg-white flex-shrink-0 w-[160px]" style={{ scrollSnapAlign: 'start' }}>
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-[#FFA500] rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Projects - HIDDEN */}
        {/* <div className="mb-16">
          <h3 className="text-2xl text-gray-900 mb-8">Featured Projects</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {projects.filter(project => project.featured).map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <Badge className={getTypeColor(project.type)}>
                      <project.icon className="w-3 h-3 mr-1" />
                      {project.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {project.date}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </span>
                      <span className="text-[#FFA500]">{project.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Annual Savings</span>
                      <span className="text-[#FFA500]">{project.savings}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200">
                    View Project Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Recent Projects - HIDDEN */}
        {/* <div className="mb-12">
          <h3 className="text-2xl text-gray-900 mb-8">Recent Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(project => !project.featured).map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-0">
                <div className="relative">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${getTypeColor(project.type)}`}>
                    <project.icon className="w-3 h-3 mr-1" />
                    {project.type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h5 className="text-gray-900 mb-1">{project.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {project.location}
                    </span>
                    <span>{project.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-2xl">
          <h3 className="text-2xl text-gray-900 mb-4">
            Ready to Start Your Solar Project?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our growing list of satisfied customers. Let's discuss how we can help you achieve your energy goals with a custom solar solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white transition-all duration-200"
              onClick={handleStartProject}
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200"
              onClick={handleViewAllProjects}
            >
              View All Projects
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200"
              onClick={handleViewGallery}
            >
              View Gallery
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
