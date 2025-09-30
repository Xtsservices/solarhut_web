import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Factory, 
  Zap, 
  TrendingDown, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Leaf,
  DollarSign
} from "lucide-react";

export function IndustrialSolutionsPage() {
  const solutions = [
    {
      title: "Rooftop Solar Systems",
      capacity: "100 kW - 10 MW",
      description: "Large-scale rooftop installations for manufacturing facilities",
      features: ["High-efficiency panels", "String inverters", "SCADA monitoring", "Grid synchronization"]
    },
    {
      title: "Ground Mounted Systems",
      capacity: "1 MW - 100 MW",
      description: "Utility-scale solar farms for heavy industries",
      features: ["Single-axis tracking", "Centralized inverters", "Weather station", "Grid substation"]
    },
    {
      title: "Hybrid Solutions",
      capacity: "500 kW - 50 MW",
      description: "Solar + Battery storage for continuous power supply",
      features: ["Energy storage", "Load management", "Backup power", "Peak shaving"]
    }
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "70-80% Cost Reduction",
      description: "Dramatically reduce your electricity expenses with industrial-scale solar"
    },
    {
      icon: Leaf,
      title: "Carbon Neutral Operations",
      description: "Achieve sustainability goals and reduce environmental impact"
    },
    {
      icon: DollarSign,
      title: "Quick ROI",
      description: "Payback period of 3-4 years with long-term savings"
    },
    {
      icon: Shield,
      title: "Energy Security",
      description: "Reduce dependence on grid power and ensure stable energy supply"
    }
  ];

  const industries = [
    "Manufacturing", "Textiles", "Pharmaceuticals", "Chemicals", 
    "Food Processing", "Steel & Metal", "Cement", "Paper & Pulp"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
     <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Industrial Solar Solutions
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Power your industrial operations with large-scale solar installations. 
                Reduce operational costs, achieve energy independence, and meet sustainability targets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  Get Industrial Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Case Studies
                  <BarChart3 className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMHNvbGFyJTIwcGFuZWxzJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc1OTAzODcyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Industrial Solar Installation"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industrial Solar Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your industrial operations with clean, cost-effective solar energy
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Industrial Solutions</h2>
            <p className="text-xl text-gray-600">
              Scalable solar solutions designed for industrial applications
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Factory className="w-8 h-8 text-blue-600" />
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {solution.capacity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
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

      {/* Industries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600">
              Specialized solar solutions for diverse industrial sectors
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge key={index} variant="outline" className="px-6 py-3 text-lg border-blue-200 text-blue-700 hover:bg-blue-50">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Story</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">ABC Manufacturing Ltd.</h3>
                <p className="text-gray-700 mb-6">
                  "Solar Hut Solutions installed a 2 MW rooftop system for our textile manufacturing facility. 
                  We've seen a 75% reduction in our electricity costs and achieved our carbon neutrality goals 
                  ahead of schedule."
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2 MW</div>
                    <div className="text-sm text-gray-600">Installed Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">75%</div>
                    <div className="text-sm text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">3.2 Years</div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMHNvbGFyJTIwcGFuZWxzJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc1OTAzODcyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Manufacturing Facility with Solar"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">
              End-to-end project management for large-scale solar installations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Site Assessment", description: "Detailed technical and commercial feasibility study" },
              { step: "2", title: "Design & Engineering", description: "Custom system design with performance modeling" },
              { step: "3", title: "Project Execution", description: "Professional installation with minimal downtime" },
              { step: "4", title: "O&M Support", description: "Comprehensive maintenance and monitoring services" }
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Scale Your Operations?</h2>
          <p className="text-xl mb-8">
            Let's discuss how industrial solar can transform your business operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}