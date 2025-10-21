// import { ImageWithFallback } from "../components/figma/ImageWithFallback";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { 
//   Factory, 
//   Zap, 
//   TrendingDown, 
//   Shield, 
//   Clock,
//   CheckCircle,
//   ArrowRight,
//   BarChart3,
//   Leaf,
//   DollarSign
// } from "lucide-react";

// export function IndustrialSolutionsPage() {
//   const solutions = [
//     {
//       title: "Rooftop Solar Plants",
//       capacity: "100 kW - 10 MW",
//       description: "Efficient rooftop solar installations for factories and warehouses",
//       features: ["Premium solar panels", "Grid-tied inverters", "Energy monitoring", "Seamless integration"]
//     },
//     {
//       title: "Ground-Mount Solar Farms",
//       capacity: "1 MW - 100 MW",
//       description: "Large-scale ground-mounted solar systems for heavy industries",
//       features: ["Tracking systems", "Centralized inverters", "Weather monitoring", "Substation ready"]
//     },
//     {
//       title: "Hybrid Energy Systems",
//       capacity: "500 kW - 50 MW",
//       description: "Solar plus battery solutions for uninterrupted power supply",
//       features: ["Battery backup", "Load optimization", "Emergency support", "Peak load management"]
//     }
//   ];

//   const benefits = [
//     {
//       icon: TrendingDown,
//       title: "Reduce Energy Costs",
//       description: "Significantly cut electricity bills with industrial solar systems"
//     },
//     {
//       icon: Leaf,
//       title: "Eco-Friendly Operations",
//       description: "Move towards sustainable energy and reduce carbon footprint"
//     },
//     {
//       icon: DollarSign,
//       title: "Fast Payback",
//       description: "Achieve ROI in 3–4 years and long-term savings"
//     },
//     {
//       icon: Shield,
//       title: "Reliable Energy Supply",
//       description: "Ensure consistent power with reduced dependency on the grid"
//     }
//   ];

//   const industries = [
//     "Manufacturing", "Textiles", "Pharmaceuticals", "Food Processing",
//     "Chemicals", "Steel & Metal", "Cement", "Paper & Pulp"
//   ];

//   const caseStudy = {
//     name: "SunPro Manufacturing Ltd.",
//     capacity: "2 MW",
//     costReduction: "70%",
//     payback: "3.5 Years",
//     testimonial: "The solar plant installation has transformed our operations. Energy costs are down and sustainability goals achieved faster than expected."
//   };

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6">
//                 Industrial Solar Power Solutions
//               </h1>
//               <p className="text-xl md:text-2xl mb-8">
//                 Empower your factory or warehouse with sustainable solar energy. Reduce operating costs, secure your energy supply, and build a greener future.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
//                   Request Industrial Quote
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//                 <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#ffa500]-600">
//                   View Case Studies
//                   <BarChart3 className="ml-2 w-5 h-5" />
//                 </Button>
//               </div>
//             </div>
//             <div className="relative">
//               <ImageWithFallback
//                 src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
//                 alt="Industrial Solar Installation"
//                 className="w-full h-96 object-cover rounded-2xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Advantages</h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Industrial solar systems designed to maximize efficiency, savings, and sustainability.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {benefits.map((benefit, index) => {
//               const IconComponent = benefit.icon;
//               return (
//                 <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="w-16 h-16 bg-[#ffa500]-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <IconComponent className="w-8 h-8 text-[#ffa500]-600" />
//                     </div>
//                     <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
//                     <p className="text-gray-600">{benefit.description}</p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Solutions Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Solar Solutions</h2>
//             <p className="text-xl text-gray-600">
//               Scalable and customizable solar solutions for all types of industries.
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {solutions.map((solution, index) => (
//               <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-center justify-between mb-2">
//                     <Factory className="w-8 h-8 text-[#ffa500]-600" />
//                     <Badge variant="outline" className="border-[#ffa500]-200 text-[#ffa500]-700">
//                       {solution.capacity}
//                     </Badge>
//                   </div>
//                   <CardTitle className="text-xl">{solution.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600 mb-4">{solution.description}</p>
//                   <ul className="space-y-2">
//                     {solution.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-center space-x-2">
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
//                         <span className="text-sm text-gray-600">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Industries Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Cater To</h2>
//             <p className="text-xl text-gray-600">
//               Tailored solar solutions for diverse industrial sectors.
//             </p>
//           </div>
//           <div className="flex flex-wrap justify-center gap-4">
//             {industries.map((industry, index) => (
//               <Badge key={index} variant="outline" className="px-6 py-3 text-lg border-[#ffa500]-200 text-[#ffa500]-700 hover:bg-[#ffa500]-50">
//                 {industry}
//               </Badge>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Case Study Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-4xl font-bold text-gray-900 mb-6">Client Success Story</h2>
//               <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h3 className="text-2xl font-bold text-[#ffa500]-600 mb-4">{caseStudy.name}</h3>
//                 <p className="text-gray-700 mb-6">{caseStudy.testimonial}</p>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-green-600">{caseStudy.capacity}</div>
//                     <div className="text-sm text-gray-600">Installed Capacity</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-[#ffa500]-600">{caseStudy.costReduction}</div>
//                     <div className="text-sm text-gray-600">Cost Reduction</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-yellow-600">{caseStudy.payback}</div>
//                     <div className="text-sm text-gray-600">Payback Period</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="relative">
//               <ImageWithFallback
//                 src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
//                 alt="Industrial Solar Facility"
//                 className="w-full h-96 object-cover rounded-2xl shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Process Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Work</h2>
//             <p className="text-xl text-gray-600">
//               Streamlined project execution from planning to operation.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               { step: "1", title: "Site Survey", description: "Detailed technical assessment of your facility" },
//               { step: "2", title: "System Design", description: "Tailored engineering solutions for maximum efficiency" },
//               { step: "3", title: "Installation", description: "Expert execution with minimal downtime" },
//               { step: "4", title: "Monitoring & Maintenance", description: "Continuous support and performance optimization" }
//             ].map((process, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-16 h-16 bg-[#ffa500]-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                   {process.step}
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">{process.title}</h3>
//                 <p className="text-gray-600">{process.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-gradient-to-r from-[#ffa500]-600 to-green-600 text-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold mb-4">Scale Your Industrial Operations with Solar</h2>
//           <p className="text-xl mb-8">
//             Connect with us to explore how solar energy can cut costs and power your growth.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="bg-white text-[#ffa500]-600 hover:bg-gray-100">
//               Schedule Consultation
//             </Button>
//             <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#ffa500]-600">
//               Download Brochure
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  DollarSign
} from "lucide-react";

export function IndustrialSolutionsPage() {
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
      icon: TrendingDown,
      title: "Stable Energy Costs",
      description: "Shield your business from future tariff hikes"
    },
    {
      icon: DollarSign,
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Industrial Solar Rooftops
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Top Industrial Solar Power Rooftop Systems Provider in India. Solar Hut Solutions specializes in cutting-edge grid-tied solar PV systems that seamlessly integrate with your existing power grid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => { window.location.href = '/contact'; }}
                >
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-black-600">
                  Call Now: +91 9812345678
                  <BarChart3 className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
                alt="Industrial Solar Installation"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Solar Hut Solutions for Industrial Solar Power?</h2>
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
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Industrial Solar Solutions</h2>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Industrial Clients</h2>
            <p className="text-xl text-gray-600">
              Trusted by leading industrial players across India.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Badge key={index} variant="outline" className="px-6 py-3 text-lg border-[#ffa500]-200 text-[#ffa500]-700 hover:bg-[#ffa500]-50">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Client Success Story</h2>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#ffa500]-600 mb-4">{caseStudy.name}</h3>
                <p className="text-gray-700 mb-6">{caseStudy.testimonial}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{caseStudy.capacity}</div>
                    <div className="text-sm text-gray-600">Installed Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ffa500]-600">{caseStudy.costReduction}</div>
                    <div className="text-sm text-gray-600">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{caseStudy.payback}</div>
                    <div className="text-sm text-gray-600">Payback Period</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745162451436-2593789f3c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
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
          <div className="bg-[#ffffff] text-black p-8 rounded-xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Flexible Financing Options</h2>
              <p className="text-xl text-black/90 max-w-3xl mx-auto">
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
                  <div className="w-16 h-16 bg-[#FFA500] text-[#ffffff] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{process.title}</h3>
                  <p className="text-white/90">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#ffa500] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">About Solar Hut Solutions</h2>
          <p className="text-x mb-8">
            Founded in 2008, Solar Hut Solutions is a leading manufacturer, trader, and system integrator in the solar industry. With a passion for innovation and sustainability, we deliver world-class solar energy solutions for residential, commercial, and industrial needs. Contact us today: 📞 +91 9812345678 | 📧 info@solarhutsolutions.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#ffa500]-600 hover:bg-gray-100">
              Book Your Solar Hut Plus @ ₹999/-
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-[#ffa500]-600">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}