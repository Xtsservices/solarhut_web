import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Home, 
  Building2, 
  Factory,
  MapPin,
  Droplets,
  ArrowRight,
  CheckCircle,
  Zap,
  DollarSign,
  Shield
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Solutions() {
  const solutions = [
    {
      id: "residential",
      title: "Residential Solar",
      icon: Home,
      description: "Perfect solar solutions for homeowners looking to reduce energy bills and increase property value.",
      image: "https://images.unsplash.com/photo-1559079680-d7d0f01f7cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGJsdWUlMjBza3klMjByZXNpZGVudGlhbHxlbnwxfHx8fDE3NTkwMzc4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "Custom-designed for your roof",
        "Up to 90% reduction in electricity bills",
        "25-year performance warranty",
        "Increase property value by 4%",
        "Net metering capability",
        "Smart monitoring system"
      ],
      savings: "Save $1,500-3,000 annually",
      payback: "6-8 years"
    },
    {
      id: "commercial",
      title: "Commercial Solar",
      icon: Building2,
      description: "Scalable solar solutions for businesses to reduce operational costs and demonstrate environmental responsibility.",
      image: "https://images.unsplash.com/photo-1726866672851-5b99c837603c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzU5MDM3ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "Large-scale installations",
        "Federal tax incentives",
        "Professional project management",
        "Minimal business disruption",
        "Advanced monitoring systems",
        "Maintenance packages available"
      ],
      savings: "Save 20-40% on energy costs",
      payback: "4-6 years"
    },
    {
      id: "industrial",
      title: "Industrial Solar",
      icon: Factory,
      description: "Heavy-duty solar systems designed for manufacturing facilities and large industrial complexes.",
      image: "https://images.unsplash.com/photo-1670519808728-335b1eb2ef52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm0lMjBncmVlbiUyMGVuZXJneXxlbnwxfHx8fDE3NTkwMzc4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "Megawatt-scale capacity",
        "Robust mounting systems",
        "24/7 monitoring and support",
        "Custom engineering solutions",
        "Grid-tie capabilities",
        "Energy storage integration"
      ],
      savings: "Reduce energy costs by 30-50%",
      payback: "3-5 years"
    },
    {
      id: "ground-mounted",
      title: "Ground Mounted Systems",
      icon: MapPin,
      description: "Flexible ground-mounted solar arrays for properties with ample land space.",
      image: "https://images.unsplash.com/photo-1670519808728-335b1eb2ef52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGZhcm0lMjBncmVlbiUyMGVuZXJneXxlbnwxfHx8fDE3NTkwMzc4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "Optimal panel positioning",
        "Easy maintenance access",
        "Scalable design",
        "No roof limitations",
        "Tracking system options",
        "Agricultural compatibility"
      ],
      savings: "Maximum energy production",
      payback: "5-7 years"
    },
    {
      id: "water-heaters",
      title: "Solar Water Heaters",
      icon: Droplets,
      description: "Efficient solar thermal systems for hot water heating, reducing energy consumption by up to 80%.",
      image: "https://images.unsplash.com/photo-1559079680-d7d0f01f7cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGJsdWUlMjBza3klMjByZXNpZGVudGlhbHxlbnwxfHx8fDE3NTkwMzc4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: [
        "80% reduction in water heating costs",
        "Evacuated tube collectors",
        "Backup heating system",
        "Freeze protection",
        "15-year system warranty",
        "Low maintenance requirements"
      ],
      savings: "Save $400-800 annually",
      payback: "3-5 years"
    }
  ];

  return (
    <section id="solutions" className="section-services section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Complete Solar Solutions
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Solar Solutions for Every Need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From residential rooftops to large industrial complexes, we provide customized solar solutions 
            that deliver maximum efficiency and long-term savings.
          </p>
        </div>

        {/* Solutions Tabs */}
        <Tabs defaultValue="residential" className="w-full">
          <TabsList className="grid w-full lg:grid-cols-5 mb-12 h-auto p-1 bg-gray-100">
            {solutions.map((solution) => (
              <TabsTrigger 
                key={solution.id} 
                value={solution.id}
                className="flex items-center space-x-2 py-4 data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                <solution.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{solution.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {solutions.map((solution) => (
            <TabsContent key={solution.id} value={solution.id} className="mt-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <solution.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{solution.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed">{solution.description}</p>
                  </div>

                  {/* Key Benefits */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-accent" />
                      <div>
                        <div className="font-semibold text-gray-900">Savings</div>
                        <div className="text-sm text-gray-600">{solution.savings}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                      <Shield className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-semibold text-gray-900">Payback Period</div>
                        <div className="text-sm text-gray-600">{solution.payback}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Key Features:</h4>
                    <div className="grid gap-2">
                      {solution.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-orange-700 text-white">
                    Get Quote for {solution.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Image */}
                <div className="relative">
                  <ImageWithFallback
                    src={solution.image}
                    alt={`${solution.title} installation`}
                    className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{solution.title}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure which solution is right for you?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our solar experts will assess your property and energy needs to recommend the perfect solar solution for your specific requirements.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-orange-700 text-white">
            Schedule Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}