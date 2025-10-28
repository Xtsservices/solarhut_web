import { useState } from 'react';
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  MapPin, 
  Zap, 
  Calendar,
  Users,
  Building2,
  Factory,
  Home,
  Eye,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface ProjectsPageProps {
  onNavigate?: (page: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Residential Complex - Green Gardens",
      location: "Mumbai, Maharashtra",
      capacity: "500 kW",
      type: "Residential",
      completedDate: "March 2024",
      unitsGenerated: "25,000",
      savings: "₹15 Lakhs/year",
      image: "https://images.unsplash.com/photo-1741233928760-4d3ca277f210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJlc2lkZW50aWFsJTIwc29sYXIlMjBwYW5lbHMlMjByb29mdG9wfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Large-scale residential solar installation covering 200 apartments with individual metering systems.",
      highlights: ["200 apartments covered", "Individual net metering", "25-year warranty", "Smart monitoring system"]
    },
    {
      id: 2,
      title: "Manufacturing Plant - ABC Industries",
      location: "Pune, Maharashtra",
      capacity: "2 MW",
      type: "Industrial",
      completedDate: "January 2024",
      unitsGenerated: "120,000",
      savings: "₹85 Lakhs/year",
      image: "https://images.unsplash.com/photo-1711884272371-cd61f372e2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHNvbGFyJTIwcG93ZXIlMjBwbGFudHxlbnwxfHx8fDE3NjE1NjA1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Industrial rooftop installation for textile manufacturing facility with 75% energy independence.",
      highlights: ["2 MW rooftop system", "75% energy independence", "Grid synchronization", "SCADA monitoring"]
    },
    {
      id: 3,
      title: "Shopping Mall - City Center",
      location: "Bangalore, Karnataka",
      capacity: "1.5 MW",
      type: "Commercial",
      completedDate: "February 2024",
      unitsGenerated: "90,000",
      savings: "₹60 Lakhs/year",
      image: "https://images.unsplash.com/photo-1540698868789-1d58f90db386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMGNvbW1lcmNpYWwlMjBzb2xhciUyMHBhbmVscyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2MTU2MDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Commercial solar installation for large shopping complex with integrated parking canopy system.",
      highlights: ["Parking canopy system", "LED lighting integration", "Peak load management", "Green building certification"]
    },
    {
      id: 4,
      title: "Hospital Complex - LifeCare Medical",
      location: "Chennai, Tamil Nadu",
      capacity: "800 kW",
      type: "Commercial",
      completedDate: "December 2023",
      unitsGenerated: "48,000",
      savings: "₹30 Lakhs/year",
      image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzYxNTYwNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Critical healthcare facility installation with backup power integration and uninterrupted operation.",
      highlights: ["Backup power integration", "Critical load support", "Emergency systems", "24/7 monitoring"]
    },
    {
      id: 5,
      title: "Solar Farm - Green Energy Park",
      location: "Rajasthan",
      capacity: "10 MW",
      type: "Utility",
      completedDate: "November 2023",
      unitsGenerated: "600,000",
      savings: "₹4 Crores/year",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHByb2plY3RzJTIwZ2FsbGVyeSUyMGluc3RhbGxhdGlvbnN8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Large-scale ground-mounted solar farm with single-axis tracking system for maximum efficiency.",
      highlights: ["Single-axis tracking", "Weather monitoring", "Grid substation", "Land optimization"]
    },
    {
      id: 6,
      title: "Educational Campus - Tech University",
      location: "Hyderabad, Telangana",
      capacity: "750 kW",
      type: "Institutional",
      completedDate: "October 2023",
      unitsGenerated: "45,000",
      savings: "₹25 Lakhs/year",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHByb2plY3RzJTIwZ2FsbGVyeSUyMGluc3RhbGxhdGlvbnN8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "University campus installation covering multiple buildings with educational monitoring system.",
      highlights: ["Multiple buildings", "Educational displays", "Student research integration", "Sustainability program"]
    }
  ];

  const stats = [
    { label: "Total Projects", value: "500+", icon: Building2 },
    { label: "Installed Capacity", value: "250 MW+", icon: Zap },
    { label: "Happy Customers", value: "10,000+", icon: Users },
    { label: "Cities Covered", value: "50+", icon: MapPin }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential': return Home;
      case 'Industrial': return Factory;
      case 'Commercial': return Building2;
      case 'Institutional': return Building2;
      default: return Building2;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Residential': return 'bg-orange-100 text-orange-700';
      case 'Industrial': return 'bg-green-100 text-green-700';
      case 'Commercial': return 'bg-yellow-100 text-yellow-700';
      case 'Institutional': return 'bg-purple-100 text-purple-700';
      case 'Utility': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filterProjects = (type: string) => {
    if (type === 'all') return projects;
    return projects.filter(project => project.type === type);
  };

  const handleGetQuote = () => {
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
              Our Solar Projects
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our extensive portfolio of successful solar installations across India. From residential rooftops to utility-scale solar farms.
            </p>
          </div>
        </div>
      </section>

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
                    <div className="text-3xl text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-lg text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600">
              Browse our completed projects across different sectors and scales
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="Residential">Residential</TabsTrigger>
              <TabsTrigger value="Commercial">Commercial</TabsTrigger>
              <TabsTrigger value="Industrial">Industrial</TabsTrigger>
              <TabsTrigger value="Institutional">Institutional</TabsTrigger>
              <TabsTrigger value="Utility">Utility</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid lg:grid-cols-2 gap-8">
                {projects.map((project) => {
                  const TypeIcon = getTypeIcon(project.type);
                  return (
                    <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative h-64">
                        <ImageWithFallback
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getTypeColor(project.type)} border-0`}>
                            {project.type}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-2xl">{project.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Capacity</div>
                            <div className="text-lg text-[#FFA500]">{project.capacity}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Annual Savings</div>
                            <div className="text-lg text-green-600">{project.savings}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Completed</div>
                            <div className="text-lg text-gray-900">{project.completedDate}</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Units/Month</div>
                            <div className="text-lg text-gray-900">{project.unitsGenerated}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm text-gray-600 mb-2">Project Highlights:</h4>
                          <div className="space-y-2">
                            {project.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className="w-full border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Project Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {['Residential', 'Commercial', 'Industrial', 'Institutional', 'Utility'].map((type) => (
              <TabsContent key={type} value={type}>
                <div className="grid lg:grid-cols-2 gap-8">
                  {filterProjects(type).length > 0 ? (
                    filterProjects(type).map((project) => {
                      const TypeIcon = getTypeIcon(project.type);
                      return (
                        <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                          <div className="relative h-64">
                            <ImageWithFallback
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle className="text-2xl">{project.title}</CardTitle>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700 mb-4">{project.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">Capacity</div>
                                <div className="text-lg text-[#FFA500]">{project.capacity}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">Annual Savings</div>
                                <div className="text-lg text-green-600">{project.savings}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">Completed</div>
                                <div className="text-lg text-gray-900">{project.completedDate}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">Units/Month</div>
                                <div className="text-lg text-gray-900">{project.unitsGenerated}</div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <h4 className="text-sm text-gray-600 mb-2">Project Highlights:</h4>
                              <div className="space-y-2">
                                {project.highlights.map((highlight, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button 
                              className="w-full border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Project Details
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-xl text-gray-600">No {type} projects to display yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FFA500] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-4">Ready to Start Your Solar Project?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of satisfied customers who have made the switch to clean, renewable solar energy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Get Your Free Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-[#FFA500] transition-all duration-200"
              onClick={() => onNavigate && onNavigate('contact')}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
