import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Home, 
  Building2, 
  Wrench, 
  Shield, 
  Zap, 
  Leaf,
  Calculator,
  HeadphonesIcon
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Home,
      title: "Residential Solar",
      description: "Complete solar solutions for your home with premium panels and professional installation."
    },
    {
      icon: Building2,
      title: "Commercial Solar",
      description: "Large-scale solar systems for businesses, reducing operational costs and carbon footprint."
    },
    {
      icon: Wrench,
      title: "Installation & Maintenance",
      description: "Expert installation and ongoing maintenance to ensure optimal performance for decades."
    },
    {
      icon: Shield,
      title: "25-Year Warranty",
      description: "Comprehensive warranty coverage on panels, inverters, and workmanship for peace of mind."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Reduce Energy Bills",
      description: "Cut your electricity costs by up to 90% with efficient solar panel systems."
    },
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Reduce your carbon footprint and contribute to a cleaner, sustainable future."
    },
    {
      icon: Calculator,
      title: "Tax Incentives",
      description: "Take advantage of federal and state tax credits to maximize your savings."
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support and monitoring for your solar system."
    }
  ];

  return (
    <section id="services" className="section-features section-padding">
      <div className="section-container">
        {/* Services Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Complete Solar Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From consultation to installation and maintenance, we provide end-to-end solar services 
            tailored to your specific needs and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Solar Energy?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advantages of switching to clean, renewable solar energy for your home or business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}