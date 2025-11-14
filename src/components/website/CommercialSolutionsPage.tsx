import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Building2, 
  TrendingDown, 
  Award, 
  CheckCircle,
  ArrowRight,
  BarChart3,
  Clock,
  Shield
} from "lucide-react";

interface CommercialSolutionsPageProps {
  onNavigate?: (page: string) => void;
}

export function CommercialSolutionsPage({ onNavigate }: CommercialSolutionsPageProps) {
  const solutions = [
    {
      title: "Office Buildings",
      capacity: "50 kW - 1 MW",
      description: "Solar solutions for corporate offices and business complexes",
      image: "/src/assets/officeBuildings.jpg",
      features: ["Rooftop installation", "Grid tie system", "Remote monitoring", "LEED certification support"]
    },
    {
      title: "Retail & Malls",
      capacity: "100 kW - 2 MW",
      description: "Large-scale installations for shopping centers and retail chains",
      image: "/src/assets/malls.jpg",
      features: ["Carport structures", "Energy storage", "Demand management", "Green building credits"]
    },
    {
      title: "Healthcare Facilities",
      capacity: "200 kW - 1.5 MW",
      description: "Reliable solar power for hospitals and medical centers",
      image: "/src/assets/healthcare.jpg",
      features: ["Backup power", "Critical load support", "Emergency systems", "Uninterrupted operation"]
    }
  ];

  const benefits = [
    "Cost Savings, Higher Profits: Reduce expenses and increase profitability.",
    "Maximize Rooftop Space: Transform unused areas into solar power hubs.",
    "Stable Energy Costs: Protect your business from unpredictable tariffs.",
    "Reliable Systems, Lasting Benefits: Depend on high-performance solar technology.",
    "Eco-Friendly Branding: Adopt clean energy to enhance your company's reputation.",
    "Quick ROI: Achieve payback in 3-4 years with long-term savings."
  ];

  const handleGetQuote = () => {
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  const handleContact = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200"
       style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/src/assets/Commercial-Solar.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px', // Added fixed height
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
           <div className="">
              <h3 className="text-4xl md:text-5xl mb-2 px-4" style={{ color: 'rgb(255, 167, 3)' }}>
              Commercial Solar Solutions
            </h3>
            </div>
            <p className="text-lg md:text-xl text-white text-white-200 mt-4 max-w-3xl mx-auto">
              Transform your business with sustainable solar energy. Book your SolarHut Plus plan for just ₹999/- and receive a 10g silver coin as a bonus!
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Benefits of Commercial Solar Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how solar energy can benefit your business operations and bottom line
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#FFA500] flex-shrink-0" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Commercial Applications</h2>
            <p className="text-xl text-gray-600">
              Tailored solar solutions for different commercial sectors
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge style={{ backgroundColor: '#FFF7ED', color: '#FFA500', border: '1px solid #FFD580' }}>
                      {solution.capacity}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Building2 className="w-6 h-6 text-[#FFA500] mr-2" />
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
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

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Commercial Solar?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingDown,
                title: "Cost Savings",
                description: "Reduce electricity bills by up to 80% with commercial solar"
              },
              {
                icon: Award,
                title: "Tax Benefits",
                description: "Accelerated depreciation and other tax incentives available"
              },
              {
                icon: Clock,
                title: "Quick ROI",
                description: "Payback period of 3-4 years with long-term savings"
              },
              {
                icon: Shield,
                title: "Energy Security",
                description: "Protect your business from unpredictable tariffs"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div style={{ backgroundColor: '#FFF7ED' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#FFA500]" />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Flexible Financing Options</h2>
            <p className="text-xl text-gray-600">
              Choose the financing model that works best for your business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "CAPEX Model",
                description: "Own the system outright and maximize tax benefits",
                features: ["100% ownership", "Maximum tax benefits", "Highest long-term savings", "Asset on balance sheet"]
              },
              {
                title: "OPEX/PPA Model",
                description: "Pay per unit of solar power consumed with zero upfront cost",
                features: ["Zero upfront investment", "Fixed tariff rates", "O&M included", "Immediate savings"]
              },
              {
                title: "Lease Model",
                description: "Lease the solar system with fixed monthly payments",
                features: ["Predictable costs", "Tax advantages", "Flexible terms", "Upgrade options"]
              }
            ].map((option, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-center">{option.description}</p>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
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

      {/* Case Study Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">
              See how businesses across India are benefiting from solar energy
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-orange-50 p-8 rounded-2xl">
                <h3 className="text-2xl text-gray-900 mb-4">Tech Park, Hyderabad</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">System Size</span>
                    <span className="text-xl text-[#FFA500]">500 kW</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Annual Savings</span>
                    <span className="text-xl text-green-600">₹35 Lakhs</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Payback Period</span>
                    <span className="text-xl text-[#FFA500]">3.5 Years</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">CO₂ Reduction</span>
                    <span className="text-xl text-green-600">450 Tonnes/Year</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="/src/assets/SuccessStories.jpg.jpg"
                alt="Commercial solar success story"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">Join the Solar Revolution</h2>
          <p className="text-2xl text-black/90 mb-8">
            Partner with Solar Hut Solutions to power your business sustainably. Call now at +99661 77225!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Request a Quote
            </Button>
           
          </div>
        </div>
      </section>
    </div>
  );
}
