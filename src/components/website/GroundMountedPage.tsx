import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  Shield,
  CheckCircle,
  ArrowRight,
  Sun
} from "lucide-react";

interface GroundMountedPageProps {
  onNavigate?: (page: string) => void;
}

export function GroundMountedPage({ onNavigate }: GroundMountedPageProps) {
  const advantages = [
    {
      icon: Sun,
      title: "Maximum Sun Utilization",
      description: "Panels are oriented at optimal tilt angles to capture sunlight from dawn to dusk, ensuring consistent power generation."
    },
    {
      icon: TrendingUp,
      title: "Enhanced Energy Output",
      description: "Well-ventilated ground installations prevent heat buildup and improve efficiency by up to 20% compared to rooftops."
    },
    {
      icon: MapPin,
      title: "Modular & Expandable Design",
      description: "Systems can be easily scaled up to match future power demands or available land expansion."
    },
    {
      icon: Shield,
      title: "Simplified Operations",
      description: "At-ground accessibility allows smooth maintenance, inspections, and upgrades without rooftop constraints."
    }
  ];

  const applications = [
    {
      title: "Utility-Scale Solar Farms",
      capacity: "1 MW - 1000 MW",
      description: "Engineered for grid supply or open-access energy projects that demand high-efficiency solar power generation.",
      features: ["Single or dual-axis tracking", "Centralized inverters", "SCADA integration", "Substation connectivity"]
    },
    {
      title: "Industrial & Commercial Projects",
      capacity: "100 kW - 50 MW",
      description: "Ideal for factories, logistics hubs, and institutions with sufficient land, reducing long-term electricity expenses.",
      features: ["Fixed or adjustable mounting", "String inverters", "Low maintenance design", "Land use optimization"]
    },
    {
      title: "Agrovoltaic (Agri-Solar) Systems",
      capacity: "500 kW - 10 MW",
      description: "Generate solar energy while maintaining agricultural productivity through elevated structures and optimized spacing.",
      features: ["Dual land utilization", "Crop-friendly structures", "Smart irrigation support", "Reduced soil evaporation"]
    }
  ];

  const specifications = [
    { label: "System Efficiency", value: "22%+", description: "Premium-grade mono PERC or bifacial solar modules for better performance." },
    { label: "Land Requirement", value: "4-5 acres", description: "For each megawatt of installed solar capacity, depending on layout." },
    { label: "Annual Generation", value: "1.5-1.8 MU", description: "Average energy production per MW under standard solar conditions." },
    { label: "System Life", value: "25+ years", description: "Designed for long-term reliability with corrosion-resistant materials." }
  ];

  const handleGetQuote = () => {
    if (onNavigate) {
      onNavigate('enquiry');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section 
        className="relative py-16 border-b border-gray-200 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/src/assets/GroundMountedSystems.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px', // Added fixed height
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <div className="bg-white p-1 rounded-lg shadow-lg inline-block"> */}
              <h3 className="text-4xl md:text-5xl mb-2 px-4" style={{ color: 'rgb(255, 167, 3)' }}>
              Ground Mounted Solar Systems
              </h3>
            {/* </div> */}
            <p className="text-lg md:text-xl text-white text-white-200 mt-4 max-w-3xl mx-auto">
              Utilize your land efficiently with high-performing solar power systems — designed for scalability, durability, and maximum energy yield.
            </p>
          </div>
        </div>
      </section>



      {/* Advantages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Advantages of Ground Mounted Solar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ground-mounted systems deliver superior energy output, easy maintenance, and long-term returns for every landowner.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div style={{ backgroundColor: '#FFF7ED' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#FFA500]" />
                    </div>
                    <h3 className="text-xl mb-3">{advantage.title}</h3>
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
            <h2 className="text-4xl text-gray-900 mb-4">Ground Mount Applications</h2>
            <p className="text-xl text-gray-600">
              From utility-scale projects to agri-solar farms, ground-mounted systems adapt to diverse energy goals.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {applications.map((application, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-[#FFA500]" />
                    <Badge variant="outline" className="border-[#FFD580] text-[#FFA500]">
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

      {/* Specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Technical Specifications</h2>
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

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Installation Process</h2>
            <p className="text-xl text-gray-600">
              A streamlined, professional installation process ensures quality and timely completion of every project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Site Analysis", description: "Detailed evaluation of land, soil, and shadow conditions." },
              { step: "2", title: "System Design", description: "Customized engineering layout and regulatory approvals." },
              { step: "3", title: "Foundation Setup", description: "Civil and structural groundwork for panel stability." },
              { step: "4", title: "Installation & Testing", description: "Panel mounting, electrical wiring, and final system checks." }
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

      {/* Ground Mount vs Rooftop */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Ground Mount vs Rooftop</h2>
            <p className="text-xl text-gray-600">
              Understand when ground-mounted systems offer greater efficiency and long-term benefits.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-0 shadow-xl bg-orange-50">
              <CardContent className="pt-0">
                <h3 className="text-2xl text-gray-900 mb-6">Benefits of Ground Mount</h3>
                <ul className="space-y-3">
                  {[
                    "Customizable tilt and orientation",
                    "Simplified maintenance and cleaning",
                    "Improved output due to airflow",
                    "No impact on building structure",
                    "Expandable for future capacity",
                    "Optimized temperature control"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="p-8 border-0 shadow-xl bg-green-50">
              <CardContent className="pt-0">
                <h3 className="text-2xl text-gray-900 mb-6">When to Choose Ground Mount</h3>
                <ul className="space-y-3">
                  {[
                    "Sufficient open land available",
                    "No major shading obstructions",
                    "South-facing exposure preferred",
                    "Stable soil and terrain",
                    "Proximity to grid connection",
                    "Long-term site ownership"
                  ].map((consideration, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
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
      <section className="py-16 bg-[#FEF7ED] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-black mb-4">Have Land? Let's Build Your Solar Future</h2>
          <p className="text-xl text-black/90 mb-8">
            Convert unused land into a sustainable, high-return solar power asset with expert engineering support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#FFA500] hover:bg-gray-100"
              onClick={handleGetQuote}
            >
              Schedule Land Assessment
            </Button>
         
          </div>
        </div>
      </section>
    </div>
  );
}
