import { Button } from "./ui/button";
import { CheckCircle, Award, Users, Clock, Shield, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const stats = [
    { icon: Users, value: "1000+", label: "Happy Customers" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "24/7", label: "Customer Support" }
  ];

  const features = [
    "NABCEP certified solar installers",
    "Premium Tier 1 solar panels and equipment",
    "Comprehensive project management",
    "25-year performance warranties",
    "Post-installation monitoring and support",
    "Licensed, bonded, and insured"
  ];

  const values = [
    {
      icon: Shield,
      title: "Quality & Reliability",
      description: "We use only the highest quality components and proven installation techniques."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Your satisfaction is our priority. We're here to support you every step of the way."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We stay ahead of industry trends to bring you the latest solar technologies."
    }
  ];

  return (
    <section id="about" className="section-about section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            About Solar Hut Solutions
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted Solar Experts Since 2008
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Leading the solar revolution in Texas with premium installations, 
            exceptional service, and a commitment to sustainable energy solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1542336391-ae2936d8efe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGluc3RhbGxhdGlvbiUyMHRlYW0lMjB3b3JrZXJzfGVufDF8fHx8MTc1OTAzNzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Professional solar installation team at work"
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
            />
            
            {/* Stats Overlay */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-[#FFA500]">
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <stat.icon className="w-6 h-6 text-[#FFA500] mx-auto" />
                    <div className="text-lg font-bold bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                At Solar Hut Solutions, we're committed to helping homeowners and businesses transition 
                to clean, renewable energy. With over 15 years of experience, we've installed 
                solar systems for over 1,000 satisfied customers across Texas.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team of NABCEP certified professionals uses only the highest quality Tier 1 equipment 
                and provides comprehensive support from initial consultation through ongoing maintenance.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-[#FFA500]">
              <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-700">
                To make clean, affordable solar energy accessible to everyone while providing 
                exceptional customer service and supporting our local communities in their journey toward energy independence.
              </p>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white">
              Learn More About Our Team
            </Button>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}