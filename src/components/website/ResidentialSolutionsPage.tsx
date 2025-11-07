import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
  Wifi,
  IndianRupee
} from "lucide-react";
import { getPackages } from "../../lib/packagesData";

interface ResidentialSolutionsPageProps {
  onNavigate?: (page: string) => void;
}

export function ResidentialSolutionsPage({ onNavigate }: ResidentialSolutionsPageProps) {
  const [packages, setPackages] = useState(getPackages());

  // Listen for storage changes to update packages in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setPackages(getPackages());
    };

    // Listen for custom event when packages are updated
    window.addEventListener('packagesUpdated', handleStorageChange);
    
    // Also listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('packagesUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200"  style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/src/assets/Residentialsolar1.png)`
        }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center">
          <div className="bg-white p-1 rounded-lg shadow-lg inline-block">
              <h3 className="text-4xl md:text-5xl mb-2 px-4" style={{ color: 'rgb(255, 167, 3)' }}>
              Harness Solar Power for Your Home
            </h3>
            </div>
           <p className="text-lg md:text-xl text-white text-white-200 mt-4 max-w-3xl mx-auto">
              Cut your electricity bills drastically with our reliable residential solar systems. Eco-friendly, cost-effective, and fully hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Homeowners Choose Solar</h2>
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
            <h2 className="text-4xl text-gray-900 mb-4">Solar Packages for Every Home</h2>
            <p className="text-xl text-gray-600">
              Customized plans designed for small to large homes to meet your energy needs
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 shadow-xl ${pkg.recommended ? 'ring-2 ring-[#FFA500]' : ''}`}>
                {pkg.recommended && (
                  <div className="absolute top-0 left-0 right-0 text-center py-2 bg-[#FFA500]">
                    <Badge className="bg-white text-[#FFA500]">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className={pkg.recommended ? 'pt-12' : ''}>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl text-[#FFA500] mb-1">{pkg.capacity}</div>
                    <div className="text-sm text-gray-600 mb-4">System Capacity</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex items-center">
                        <IndianRupee className="w-6 h-6 text-gray-900" />
                        <span className="text-3xl text-gray-900">{pkg.price}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500 line-through">
                          <IndianRupee className="w-3 h-3" />
                          <span>{pkg.originalPrice}</span>
                        </div>
                        <div className="text-sm text-green-600">{pkg.savings}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Monthly Generation</div>
                      <div className="text-green-600">{pkg.monthlyGeneration}</div>
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
                  <Button 
                    className={`w-full ${pkg.recommended ? 'bg-[#FFA500] hover:bg-[#FF8C00]' : ''}`}
                    onClick={handleGetQuote}
                  >
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
            <h2 className="text-4xl text-gray-900 mb-4">Advanced Solar Features</h2>
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
                    <div className="w-16 h-16 bg-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
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

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Seamless Installation Process</h2>
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
                <div className="w-16 h-16 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">Calculate Your Savings</h2>
              <p className="text-xl text-gray-600 mb-8">
                See how much you can save with solar energy. Our typical residential customer saves 
                ₹15,000-30,000 annually on electricity bills.
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Average Monthly Bill</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-gray-900" />
                      <span className="text-2xl text-gray-900">3,000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Solar Savings (80%)</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="text-2xl text-green-600">2,400/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Annual Savings</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="text-2xl text-green-600">28,800/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Solar savings calculator"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">Begin Your Solar Journey</h2>
          <p className="text-xl text-black/90 mb-8">
            Book a free site assessment and get a personalized solar solution for your home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Schedule Free Survey
            </Button>
         
          </div>
        </div>
      </section>
    </div>
  );
}
