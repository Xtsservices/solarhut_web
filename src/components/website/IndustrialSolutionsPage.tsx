import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
  IndianRupee
} from "lucide-react";

interface IndustrialSolutionsPageProps {
  onNavigate?: (page: string) => void;
}

export function IndustrialSolutionsPage({ onNavigate }: IndustrialSolutionsPageProps) {
  const solutions = [
    {
      title: "Rooftop Solar Plants",
      capacity: "100 kW - 10 MW",
      description: "Efficient rooftop solar installations for factories and warehouses",
      features: ["Premium solar panels", "Grid-tied inverters", "Energy monitoring", "Seamless integration"]
    },
    {
      title: "Ground-Mount Solar Farms",
      capacity: "1 MW - 100 MW",
      description: "Large-scale ground-mounted solar systems for heavy industries",
      features: ["Tracking systems", "Centralized inverters", "Weather monitoring", "Substation ready"]
    },
    {
      title: "Hybrid Energy Systems",
      capacity: "500 kW - 50 MW",
      description: "Solar plus battery solutions for uninterrupted power supply",
      features: ["Battery backup", "Load optimization", "Emergency support", "Peak load management"]
    }
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "High ROI",
      description: "Enjoy a return on investment in less than 2 years"
    },
    {
      icon: Clock,
      title: "Low Maintenance",
      description: "Reduce operational costs and focus on core business"
    },
    {
      icon: Shield,
      title: "Stable Energy Costs",
      description: "Shield your business from future tariff hikes"
    },
    {
      icon: IndianRupee,
      title: "Value-Added Investment",
      description: "Increase property value and attract buyers"
    },
    {
      icon: Shield,
      title: "Tax Benefits",
      description: "Avail 40% depreciation and tax credits annually"
    },
    {
      icon: Leaf,
      title: "Green Commitment",
      description: "Strengthen your brand with sustainable energy"
    },
    {
      icon: Zap,
      title: "Heat Reduction",
      description: "Solar panels reduce internal shed temperature by up to 4°C"
    },
    {
      icon: Shield,
      title: "Extended Roof Life",
      description: "Protects RCC and shed structures from direct exposure"
    }
  ];

  const industries = [
    "Cold Storage", "Pipe Industries", "Tyres", "Rubber", "PVC", "Aluminium Profiles"
  ];

  const caseStudy = {
    name: "Gubba Cold Storage Pvt Ltd",
    capacity: "3 MW",
    costReduction: "70%",
    payback: "Less than 2 Years",
    testimonial: "Solar Hut Solutions delivered a 3 MW industrial solar rooftop system that has transformed our energy management. The high ROI and low maintenance have exceeded our expectations."
  };

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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/src/assets/IndustrialSolar.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px', // Added fixed height
          display: 'flex',
          alignItems: 'center'
        }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="">
              <h3 className="text-4xl md:text-5xl mb-2 px-4" style={{ color: 'rgb(255, 167, 3)' }}>
              Industrial Solar Rooftops
            </h3>
            </div>
            <p className="text-lg md:text-xl text-white text-white-200 mt-4 max-w-3xl mx-auto">
              Top Industrial Solar Power Rooftop Systems Provider in India. Solar Hut Solutions specializes in cutting-edge grid-tied solar PV systems that seamlessly integrate with your existing power grid.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Solar Hut Solutions for Industrial Solar Power?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our grid-tied solar PV systems are eco-friendly, cost-effective, and designed to significantly reduce electricity bills while providing energy independence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div style={{ backgroundColor: '#FFF7ED' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#FFA500]" />
                    </div>
                    <h3 className="text-xl mb-3">{benefit.title}</h3>
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
            <h2 className="text-4xl text-gray-900 mb-4">Our Industrial Solar Solutions</h2>
            <p className="text-xl text-gray-600">
              With advanced inverters and optimized energy production, we ensure minimal power wastage and maximum performance.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Factory className="w-8 h-8 text-[#FFA500]" />
                    <Badge variant="outline" style={{ backgroundColor: '#FFF7ED', color: '#FFA500', border: '1px solid #FFD580' }}>
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

      {/* Industries Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Industrial Clients</h2>
            <p className="text-xl text-gray-600">
              Trusted by leading industrial players across India.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-6 py-3 text-lg"
                style={{ backgroundColor: '#FFF7ED', color: '#FFA500', border: '1px solid #FFD580' }}
              >
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
              <h2 className="text-4xl text-gray-900 mb-6">Client Success Story</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl text-[#FFA500] mb-4">{caseStudy.name}</h3>
                <p className="text-gray-700 mb-6">{caseStudy.testimonial}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl text-green-600">{caseStudy.capacity}</div>
                    <div className="text-sm text-gray-600">Installed Capacity</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl text-[#FFA500]">{caseStudy.costReduction}</div>
                    <div className="text-sm text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl text-green-600">{caseStudy.payback}</div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="/src/assets/SuccessStories2.jpg"
                alt="Industrial Solar Facility"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFA500] text-white p-8 rounded-xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl text-white mb-4">Flexible Financing Options</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Convert your lifetime electricity bills into short-term EMIs with Solar Hut Solutions. Enjoy clean, renewable energy while saving on monthly expenses.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Consultation", description: "Get expert suggestions and customized plans" },
                { step: "2", title: "Financing", description: "Tailored EMI options for easy transition" },
                { step: "3", title: "Installation", description: "Professional setup with minimal disruption" },
                { step: "4", title: "Support", description: "Ongoing maintenance and performance monitoring" }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white text-[#FFA500] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl text-white mb-2">{process.title}</h3>
                  <p className="text-white/90">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">Calculate Your Industrial Savings</h2>
              <p className="text-xl text-gray-600 mb-8">
                See how much your industry can save with solar energy. Our typical industrial customer saves 
                ₹50 Lakhs - ₹2 Crores annually on electricity bills.
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Average Monthly Bill</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-gray-900" />
                      <span className="text-2xl text-gray-900">10,00,000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Solar Savings (70%)</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="text-2xl text-green-600">7,00,000/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Annual Savings</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="text-2xl text-green-600">84 Lakhs/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="/src/assets/calculating.jpg"
                alt="Industrial ROI calculator"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">About Solar Hut Solutions</h2>
          <p className="text-xl text-black/90 mb-8">
            Founded in 2008, Solar Hut Solutions is a leading manufacturer, trader, and system integrator in the solar industry. With a passion for innovation and sustainability, we deliver world-class solar energy solutions for residential, commercial, and industrial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Book Your Solar Hut Plus @ ₹999/-
            </Button>
          
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-white/90">
            <span>📞 +91 98123 45678</span>
            <span>📧 info@solarhutsolutions.com</span>
          </div>
        </div>
      </section>
    </div>
  );
}
