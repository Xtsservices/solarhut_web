import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Home, 
  Building2, 
  Factory,
  MapPin,
  Droplets,
  ArrowRight,
  CheckCircle,
  Zap,
  IndianRupee,
  Shield
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from 'react';


interface SolutionsProps {
  onNavigate?: (page: string) => void;
}

export function Solutions({ onNavigate }: SolutionsProps) {
  const [activeTab, setActiveTab] = useState<string>('residential');

  const handleGetQuote = (solutionId: string) => {
    // Navigate to enquiry page with solution context
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  const handleScheduleConsultation = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const solutions = [
    {
      id: "residential",
      title: "Residential Solar",
      icon: Home,
      description: "Perfect solar solutions for homeowners looking to reduce energy bills and increase property value.",
  image: "/src/assets/Residential solar.jpeg",
      features: [
        "Custom-designed for your roof",
        "Up to 90% reduction in electricity bills",
        "25-year performance warranty",
        "Increase property value by 4%",
        "Net metering capability",
        "Smart monitoring system"
      ],
      savings: "Save ₹15,000-30,000 annually",
      payback: "6-8 years"
    },
    {
      id: "commercial",
      title: "Commercial Solar",
      icon: Building2,
      description: "Scalable solar solutions for businesses to reduce operational costs and demonstrate environmental responsibility.",
  image: "/src/assets/Commercial Solar.png",
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
  image: "/src/assets/Industrial Solar.png",
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
  image: "/src/assets/Ground Mounted Systems.png",
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
      id: "solar-water-heaters",
      title: "Solar Water Heaters",
      icon: Droplets,
      description: "Efficient solar thermal systems for hot water heating, reducing energy consumption by up to 80%.",
      // Use a full URL to avoid build/runtime issues with relative asset paths
  image: "/src/assets/Solar Water Heaters.png",
      features: [
        "80% reduction in water heating costs",
        "Evacuated tube collectors",
        "Backup heating system",
        "Freeze protection",
        "15-year system warranty",
        "Low maintenance requirements"
      ],
      savings: "Save ₹4,000-8,000 annually",
      payback: "3-5 years"
    }
  ];

  return (
    <section id="solutions" className="section-services section-padding">
      <div className="section-container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Complete Solar Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4 lg:mb-6 px-4">
            Solar Solutions for Every Need
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            From residential rooftops to large industrial complexes, we provide customized solar solutions 
            that deliver maximum efficiency and long-term savings.
          </p>
        </div>

       
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop/Tablet Grid */}
          <TabsList className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 w-full gap-2 mb-6 lg:mb-12 p-2 bg-gray-100 h-auto">
            {solutions.map((solution) => (
              <TabsTrigger 
                key={solution.id} 
                value={solution.id}
                className="flex flex-row items-center justify-center gap-2 py-4 px-3 h-auto data-[state=active]:bg-white data-[state=active]:text-[#FFA500] data-[state=active]:shadow-sm transition-all"
              >
                <solution.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-center whitespace-normal leading-tight">{solution.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Horizontal Scroll */}
          <div className="sm:hidden mb-6 -mx-4 px-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                  {solutions.map((solution) => (
                    <button
                      key={solution.id}
                      onClick={() => setActiveTab(solution.id)}
                      className={`flex items-center gap-2 py-3 px-4 rounded-md whitespace-nowrap transition-all ${
                        activeTab === solution.id
                          ? 'bg-white text-[#FFA500] shadow-sm'
                          : 'bg-transparent text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <solution.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{solution.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {solutions.map((solution) => (
            <TabsContent key={solution.id} value={solution.id} className="mt-6 sm:mt-8 lg:mt-12">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                {/* Content */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFA500] rounded-lg flex items-center justify-center flex-shrink-0">
                        <solution.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl text-gray-900">{solution.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">{solution.description}</p>
                  </div>

                  {/* Key Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg">
                      <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA500] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base text-gray-900 font-medium">Savings</div>
                        <div className="text-xs sm:text-sm text-gray-600 truncate">{solution.savings}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-amber-50 rounded-lg">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base text-gray-900 font-medium">Payback Period</div>
                        <div className="text-xs sm:text-sm text-gray-600 truncate">{solution.payback}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-base sm:text-lg text-gray-900 font-medium">Key Features:</h4>
                    <div className="grid gap-2">
                      {solution.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <Button 
                      size="lg" 
                      className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-sm sm:text-base w-full sm:w-auto"
                      onClick={() => handleGetQuote(solution.id)}
                    >
                      <span className="truncate">Get Quote</span>
                      <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                    {(solution.id === 'residential' || solution.id === 'commercial' || solution.id === 'industrial' || solution.id === 'solar-water-heaters' || solution.id === 'ground-mounted') && onNavigate && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-white transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                        onClick={() => onNavigate(solution.id)}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image */}
                <div className="relative order-first lg:order-last">
                  <ImageWithFallback
                    src={solution.image}
                    alt={`${solution.title} installation`}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium">{solution.title}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg sm:rounded-xl lg:rounded-2xl">
          <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-900 mb-3 sm:mb-4 px-2">
            Not sure which solution is right for you?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            Our solar experts will assess your property and energy needs to recommend the perfect solar solution for your specific requirements.
          </p>
          <Button 
            size="lg" 
            className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-sm sm:text-base w-full sm:w-auto"
            onClick={handleScheduleConsultation}
          >
            Schedule Free Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
