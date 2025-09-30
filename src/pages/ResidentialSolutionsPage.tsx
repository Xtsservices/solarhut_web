import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Home, 
  Zap, 
  Shield, 
  Smartphone, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Sun,
  Battery,
  Wifi
} from "lucide-react";

export function ResidentialSolutionsPage() {
  const packages = [
    {
      name: "Basic Home",
      capacity: "3 kW",
      price: "₹1,80,000",
      originalPrice: "₹2,40,000",
      savings: "Save ₹60,000",
      features: [
        "12 High-efficiency solar panels",
        "3 kW string inverter",
        "Net metering setup",
        "Installation & commissioning",
        "5-year warranty"
      ],
      monthlyGeneration: "360-450 units",
      recommended: false
    },
    {
      name: "Premium Home",
      capacity: "5 kW",
      price: "₹2,85,000",
      originalPrice: "₹3,75,000",
      savings: "Save ₹90,000",
      features: [
        "20 High-efficiency solar panels",
        "5 kW string inverter",
        "Smart monitoring system",
        "Net metering setup",
        "10-year warranty",
        "Free maintenance (2 years)"
      ],
      monthlyGeneration: "600-750 units",
      recommended: true
    },
    {
      name: "Luxury Home",
      capacity: "10 kW",
      price: "₹5,40,000",
      originalPrice: "₹7,20,000",
      savings: "Save ₹1,80,000",
      features: [
        "40 High-efficiency solar panels",
        "10 kW string inverter",
        "Battery storage system",
        "Smart monitoring & control",
        "Net metering setup",
        "25-year warranty",
        "Free maintenance (5 years)"
      ],
      monthlyGeneration: "1200-1500 units",
      recommended: false
    }
  ];

  const features = [
    {
      icon: Sun,
      title: "High-Efficiency Panels",
      description: "Tier 1 monocrystalline panels with 22%+ efficiency rating"
    },
    {
      icon: Shield,
      title: "25-Year Warranty",
      description: "Comprehensive warranty covering panels, inverter, and workmanship"
    },
    {
      icon: Smartphone,
      title: "Smart Monitoring",
      description: "Real-time monitoring through mobile app and web dashboard"
    },
    {
      icon: Zap,
      title: "Net Metering",
      description: "Sell excess power back to the grid and earn credits"
    },
    {
      icon: Battery,
      title: "Battery Ready",
      description: "Easily upgradeable to hybrid system with battery storage"
    },
    {
      icon: Wifi,
      title: "IoT Enabled",
      description: "Smart inverters with WiFi connectivity and remote diagnostics"
    }
  ];

  const benefits = [
    "Reduce electricity bills by up to 90%",
    "Increase property value by 15-20%",
    "Government subsidies up to 40%",
    "Zero maintenance for 25 years",
    "ROI within 3-4 years",
    "Reduce carbon footprint significantly"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Power Your Home with Solar
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Save up to 90% on your electricity bills with our premium residential solar solutions. 
                Clean energy, guaranteed savings, and complete peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Calculate Savings
                  <Calculator className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756542713155-94f62d47d1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXNpZGVudGlhbCUyMHJvb2Z0b3AlMjBzb2xhciUyMHBhbmVscyUyMGhvdXNlfGVufDF8fHx8MTc1OTAzODY3MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Residential Solar Installation"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Home Solar?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of homeowners who are saving money and helping the environment
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

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Solar Package</h2>
            <p className="text-xl text-gray-600">
              Tailored solutions for different home sizes and energy requirements
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl ${pkg.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                {pkg.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-#ffa405-500 text-white text-center py-2">
                    <Badge className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className={pkg.recommended ? 'pt-12' : ''}>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-[#ffa405] mb-1">{pkg.capacity}</div>
                    <div className="text-sm text-gray-600 mb-4">System Capacity</div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                        <div className="text-sm text-green-600">{pkg.savings}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Monthly Generation</div>
                      <div className="font-bold text-green-600">{pkg.monthlyGeneration}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${pkg.recommended ? 'bg-[#ffa405] hover:bg-[#ffa405]/90' : ''}`}>
                    Get This Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-xl text-gray-600">
              Cutting-edge technology for maximum efficiency and performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ffa405' }}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Installation Process</h2>
            <p className="text-xl text-gray-600">
              From consultation to commissioning, we handle everything
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Site Survey", description: "Free technical assessment of your rooftop" },
              { step: "2", title: "Design & Quote", description: "Customized system design with detailed pricing" },
              { step: "3", title: "Installation", description: "Professional installation by certified technicians" },
              { step: "4", title: "Commissioning", description: "System testing and grid connection" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#ffa405' }}>
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
      <section className="py-16 bg-gradient-to-r from-[#ffa500] to-[#FFa500] text-#ffb700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#ffa405' }}>Start Your Solar Journey Today</h2>
          <p className="text-xl mb-8">
            Get a free site survey and personalized quote for your home solar system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#ffa405] hover:bg-gray-100">
              Schedule Free Survey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Call: 1800-123-SOLAR
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}