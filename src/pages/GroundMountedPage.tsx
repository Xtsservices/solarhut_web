import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Leaf,
  Sun
} from "lucide-react";

export function GroundMountedPage() {
  const advantages = [
    {
      icon: Sun,
      title: "Optimal Sun Exposure",
      description: "Ground-mounted systems can be positioned for maximum solar exposure throughout the day"
    },
    {
      icon: TrendingUp,
      title: "Higher Efficiency",
      description: "Better ventilation and optimal tilt angles result in 15-20% higher efficiency"
    },
    {
      icon: MapPin,
      title: "Scalable Design",
      description: "Easy to expand system capacity as your energy needs grow"
    },
    {
      icon: Shield,
      title: "Easy Maintenance",
      description: "Ground-level access makes cleaning and maintenance simple and cost-effective"
    }
  ];

  const applications = [
    {
      title: "Solar Farms",
      capacity: "1 MW - 1000 MW",
      description: "Large-scale utility solar installations for grid power generation",
      features: ["Single/dual-axis tracking", "Centralized inverters", "Grid substation", "SCADA monitoring"]
    },
    {
      title: "Industrial Ground Systems",
      capacity: "100 kW - 50 MW",
      description: "Ground-mounted solar for industries with available land",
      features: ["Fixed tilt structures", "String inverters", "Land optimization", "Perimeter fencing"]
    },
    {
      title: "Agri-Solar (Agrovoltaics)",
      capacity: "500 kW - 10 MW",
      description: "Combined solar and agriculture for dual land use",
      features: ["Elevated structures", "Crop compatibility", "Water management", "Shade optimization"]
    }
  ];

  const specifications = [
    { label: "System Efficiency", value: "22%+", description: "High-efficiency mono-crystalline panels" },
    { label: "Land Requirement", value: "4-5 acres", description: "Per MW of installed capacity" },
    { label: "Annual Generation", value: "1.5-1.8 MU", description: "Per MW in optimal conditions" },
    { label: "System Life", value: "25+ years", description: "With comprehensive warranty" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Ground Mounted Solar Systems
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Maximize your solar investment with ground-mounted systems. 
                Perfect for large-scale installations, solar farms, and properties with ample land space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  Get Ground Mount Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Land Assessment
                  <MapPin className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHByb2plY3RzJTIwZ2FsbGVyeSUyMGluc3RhbGxhdGlvbnN8ZW58MXx8fHwxNzU5MDM4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Ground Mounted Solar Farm"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advantages of Ground Mounted Solar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why ground-mounted solar systems offer superior performance and flexibility
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ground Mount Applications</h2>
            <p className="text-xl text-gray-600">
              Versatile solutions for different ground-mounted solar requirements
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {applications.map((application, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-blue-600" />
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {application.capacity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{application.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{application.description}</p>
                  <ul className="space-y-2">
                    {application.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specifications.map((spec, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{spec.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{spec.label}</div>
                  <div className="text-sm text-gray-600">{spec.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Installation Process</h2>
            <p className="text-xl text-gray-600">
              Professional installation process for ground-mounted solar systems
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Site Survey", description: "Comprehensive land assessment and soil analysis" },
              { step: "2", title: "Design & Permits", description: "System design and regulatory approvals" },
              { step: "3", title: "Civil Work", description: "Foundation work and infrastructure development" },
              { step: "4", title: "Installation", description: "Panel mounting and electrical connections" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits vs Rooftop */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ground Mount vs Rooftop</h2>
            <p className="text-xl text-gray-600">
              Compare the advantages of ground-mounted systems
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ground Mounted Benefits</h3>
                <ul className="space-y-3">
                  {[
                    "Optimal tilt and orientation",
                    "Easy maintenance and cleaning",
                    "Higher energy production",
                    "No roof structural concerns",
                    "Expandable system design",
                    "Better ventilation and cooling"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">When to Choose Ground Mount</h3>
                <ul className="space-y-3">
                  {[
                    "Available land space (4-5 acres per MW)",
                    "South-facing open area preferred",
                    "No shading from trees or buildings",
                    "Stable soil conditions",
                    "Grid connectivity available",
                    "Long-term land availability"
                  ].map((consideration, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Have Land? Let's Build Your Solar Farm</h2>
          <p className="text-xl mb-8">
            Transform your unused land into a revenue-generating solar power plant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Land Assessment
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Get Feasibility Study
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}