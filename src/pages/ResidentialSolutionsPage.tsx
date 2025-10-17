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
      name: "Starter Home",
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
      name: "Advanced Home",
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
      name: "Premium Home",
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
      description: "Tier 1 monocrystalline panels delivering 22%+ efficiency"
    },
    {
      icon: Shield,
      title: "25-Year Warranty",
      description: "Covers panels, inverter, and professional installation"
    },
    {
      icon: Smartphone,
      title: "Smart Monitoring",
      description: "Track your energy production in real-time via mobile app"
    },
    {
      icon: Zap,
      title: "Net Metering",
      description: "Sell excess energy back to the grid and earn credits"
    },
    {
      icon: Battery,
      title: "Battery Ready",
      description: "Upgrade to hybrid systems with battery storage easily"
    },
    {
      icon: Wifi,
      title: "IoT Enabled",
      description: "Smart inverters with WiFi and remote diagnostics"
    }
  ];

  const benefits = [
    "Slash monthly electricity bills",
    "Increase property value by 15-20%",
    "Government incentives up to 40%",
    "Maintenance-free for 25 years",
    "ROI within 3-4 years",
    "Contribute to a cleaner planet"
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Harness Solar Power for Your Home
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Cut your electricity bills drastically with our reliable residential solar systems. 
                Eco-friendly, cost-effective, and fully hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5 text-white" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-[#ffa500]-600">
                  Estimate Your Savings
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Homeowners Choose Solar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why thousands of homeowners trust solar for energy independence and sustainability.
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solar Packages for Every Home</h2>
            <p className="text-xl text-gray-600">
              Customized plans designed for small to large homes to meet your energy needs
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl ₹{pkg.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                {pkg.recommended && (
                  <div className="absolute top-0 left-0 right-0 text-center py-2">
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
                  {/* <Button className={`w-full ₹{pkg.recommended ? 'bg-[#ffa405] hover:bg-[#ffa405]/90' : ''}`}>
                    Get This Package
                  </Button> */}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Solar Features</h2>
            <p className="text-xl text-gray-600">
              Innovative technology for maximum energy efficiency
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Installation Process</h2>
            <p className="text-xl text-gray-600">
              We take care of everything, from consultation to commissioning
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Rooftop Survey", description: "Free technical inspection of your roof" },
              { step: "2", title: "Design & Quote", description: "Tailored system and transparent pricing" },
              { step: "3", title: "Installation", description: "Professional installation by certified experts" },
              { step: "4", title: "Commissioning", description: "Final testing and grid connection" }
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
      <section className="py-16 bg-gradient-to-r from-[#ffa500] to-[#FFa500]" style={{ color: '#ffb700' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Begin Your Solar Journey</h2>
            <p className="text-xl mb-8" style={{ color: '#000000' }}>
            Book a free site assessment and get a personalized solar solution for your home
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Schedule Free Survey
            </Button> */}
            <Button
              size="lg"
              variant="outline"
              className="border border-[#ffa405] text-black hover:bg-white hover:text-[#000000]-600"
            >
              Call: 1800-123-SOLAR
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
