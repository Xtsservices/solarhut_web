import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Droplets, 
  Thermometer, 
  IndianRupee, 
  Leaf,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Home,
  Building2
} from "lucide-react";

interface SolarWaterHeatersPageProps {
  onNavigate?: (page: string) => void;
}

export function SolarWaterHeatersPage({ onNavigate }: SolarWaterHeatersPageProps) {
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

  const products = [
    {
      title: "Residential ETC System",
      capacity: "100-300 Liters",
      type: "Evacuated Tube Collector",
      price: "₹15,000 - ₹35,000",
      image: "/src/assets/solar.jpg",
      features: ["High efficiency in cold weather", "Frost resistant", "5-year warranty", "Pressurized system"],
      applications: ["Homes", "Small families", "Apartments"]
    },
    {
      title: "Commercial FPC System",
      capacity: "500-2000 Liters",
      type: "Flat Plate Collector",
      price: "₹40,000 - ₹1,50,000",
      image: "https://images.unsplash.com/photo-1727637598483-0c139a8fb48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHdhdGVyJTIwaGVhdGVyJTIwaW5zdGFsbGF0aW9uJTIwcm9vZnxlbnwxfHx8fDE3NTkwMzkwNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["High durability", "Low maintenance", "Integrated backup", "Thermostatic control"],
      applications: ["Hotels", "Hospitals", "Offices", "Gyms"]
    },
    {
      title: "Industrial Heat Pump",
      capacity: "2000-10000 Liters",
      type: "Solar Heat Pump",
      price: "₹2,00,000 - ₹8,00,000",
      image: "/src/assets/commercial.jpg",
      features: ["COP up to 4.0", "All weather operation", "Remote monitoring", "Energy efficient"],
      applications: ["Industries", "Large complexes", "Process heating", "Swimming pools"]
    }
  ];

  const benefits = [
    {
      icon: IndianRupee,
      title: "80% Cost Savings",
      description: "Reduce water heating costs by up to 80% compared to electric geysers"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Zero emissions and reduced carbon footprint for sustainable living"
    },
    {
      icon: Clock,
      title: "Long Lifespan",
      description: "15-20 years of reliable operation with minimal maintenance"
    },
    {
      icon: Shield,
      title: "5-Year Warranty",
      description: "Comprehensive warranty covering collectors, tank, and accessories"
    }
  ];

  const specifications = [
    { label: "Daily Hot Water", value: "150-300L", description: "Per 100L system capacity" },
    { label: "Water Temperature", value: "60-80°C", description: "On sunny days" },
    { label: "Energy Savings", value: "1500 Units", description: "Per year for 100L system" },
    { label: "Payback Period", value: "2-3 Years", description: "Return on investment" }
  ];

  const types = [
    {
      name: "Evacuated Tube Collector (ETC)",
      efficiency: "65-70%",
      advantages: ["Works in cold weather", "Higher efficiency", "Frost resistant", "Better insulation"],
      applications: ["Hill stations", "Cold regions", "High-rise buildings"]
    },
    {
      name: "Flat Plate Collector (FPC)",
      efficiency: "50-60%",
      advantages: ["Lower cost", "Easy maintenance", "Durable design", "Good for sunny regions"],
      applications: ["Coastal areas", "Plains", "Moderate climate zones"]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3efeb7b' }}>
      {/* Hero Section */}
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/SolarWaterHeaters.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px', // Added fixed height
          display: 'flex',
          alignItems: 'center'
        }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
        <div className="">
          <h3 className="text-4xl md:text-5xl mb-2 px-4" style={{ color: 'rgb(255, 167, 3)' }}>
            Solar Water Heaters
          </h3>
        </div>
        <p className="text-lg md:text-xl text-white mt-4 max-w-3xl mx-auto">
          Enjoy unlimited hot water with zero electricity bills. Our solar water heating systems provide reliable, eco-friendly hot water for homes and businesses.
        </p>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Solar Water Heaters?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of clean, cost-effective water heating technology
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

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Solar Water Heater Range</h2>
            <p className="text-xl text-gray-600">
              Choose from our comprehensive range of solar water heating solutions
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#FFA500] text-white border-0">
                      {product.capacity}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <div className="text-sm text-gray-600">{product.type}</div>
                  <div className="text-lg text-green-600">{product.price}</div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#FFA500] flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.applications.map((app, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleGetQuote}>
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Types Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Types of Solar Water Heaters</h2>
            <p className="text-xl text-gray-600">
              Choose the right technology for your climate and requirements
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {types.map((type, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl">
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl text-gray-900">{type.name}</h3>
                    <Badge className="bg-[#FFA500] text-white border-0">
                      {type.efficiency} Efficiency
                    </Badge>
                  </div>
                  <div className="mb-6">
                    <h4 className="mb-3">Advantages:</h4>
                    <ul className="space-y-2">
                      {type.advantages.map((advantage, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2">Best For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {type.applications.map((app, idx) => (
                        <Badge key={idx} variant="outline" className="border-orange-200 text-orange-700">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Performance Specifications</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specifications.map((spec, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl text-[#FFA500] mb-2">{spec.value}</div>
                  <div className="text-lg text-gray-900 mb-1">{spec.label}</div>
                  <div className="text-sm text-gray-600">{spec.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Installation Process</h2>
            <p className="text-xl text-gray-600">
              Professional installation in just one day
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Site Survey", description: "Assess roof structure and water connection points" },
              { step: "2", title: "System Design", description: "Customize system size based on family requirements" },
              { step: "3", title: "Installation", description: "Mount collectors and install storage tank" },
              { step: "4", title: "Commissioning", description: "Test system and provide user training" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div style={{ backgroundColor: '#FFF7ED', color: '#FFA500' }} className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sizing Guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Solar Water Heater Sizing Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Home className="w-8 h-8 text-[#FFA500] mx-auto mb-2" />
                  <h3 className="mb-2">Small Family (2-3 people)</h3>
                  <div className="text-2xl text-[#FFA500] mb-1">100L</div>
                  <div className="text-sm text-gray-600">Daily hot water requirement</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Home className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="mb-2">Medium Family (4-6 people)</h3>
                  <div className="text-2xl text-green-600 mb-1">200L</div>
                  <div className="text-sm text-gray-600">Daily hot water requirement</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Building2 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="mb-2">Large Family (6+ people)</h3>
                  <div className="text-2xl text-yellow-600 mb-1">300L+</div>
                  <div className="text-sm text-gray-600">Daily hot water requirement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">Start Saving on Water Heating Today</h2>
          <p className="text-xl text-black/90 mb-8">
            Get a free assessment and personalized recommendation for your solar water heater
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Get Free Assessment
            </Button>
          
          </div>
        </div>
      </section>
    </div>
  );
}
