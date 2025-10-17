// import { ImageWithFallback } from "../components/figma/ImageWithFallback";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { 
//   Building2, 
//   TrendingDown, 
//   Award, 
//   Zap,
//   CheckCircle,
//   ArrowRight,
//   BarChart3,
//   Clock,
//   Shield
// } from "lucide-react";

// export function CommercialSolutionsPage() {
//   const solutions = [
//     {
//       title: "Office Buildings",
//       capacity: "50 kW - 1 MW",
//       description: "Solar solutions for corporate offices and business complexes",
//       image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
//       features: ["Rooftop installation", "Grid tie system", "Remote monitoring", "LEED certification support"]
//     },
//     {
//       title: "Retail & Malls",
//       capacity: "100 kW - 2 MW",
//       description: "Large-scale installations for shopping centers and retail chains",
//       image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
//       features: ["Carport structures", "Energy storage", "Demand management", "Green building credits"]
//     },
//     {
//       title: "Healthcare Facilities",
//       capacity: "200 kW - 1.5 MW",
//       description: "Reliable solar power for hospitals and medical centers",
//       image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
//       features: ["Backup power", "Critical load support", "Emergency systems", "Uninterrupted operation"]
//     }
//   ];

//   const benefits = [
//     "Reduce electricity costs by 60-80%",
//     "Improve corporate sustainability profile",
//     "Accelerated depreciation benefits",
//     "Enhance property value",
//     "Achieve net-zero carbon goals",
//     "Attract environmentally conscious customers"
//   ];

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
//       {/* Hero Section */}
//    <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6">
//                 Commercial Solar Solutions
//               </h1>
//               <p className="text-xl md:text-2xl mb-8">
//                 Transform your business with sustainable solar energy. 
//                 Reduce operational costs, enhance your brand image, and contribute to a greener future.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
//                   Get Commercial Quote
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </Button>
//                 <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
//                   ROI Calculator
//                   <BarChart3 className="ml-2 w-5 h-5" />
//                 </Button>
//               </div>
//             </div>
//             <div className="relative">
//               <ImageWithFallback
//                 src="https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
//                 alt="Commercial Solar Installation"
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
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Commercial Solar Benefits</h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Discover how solar energy can benefit your business operations and bottom line
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {benefits.map((benefit, index) => (
//               <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
//                 <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
//                 <span className="text-lg text-gray-700">{benefit}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Solutions Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Commercial Applications</h2>
//             <p className="text-xl text-gray-600">
//               Tailored solar solutions for different commercial sectors
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {solutions.map((solution, index) => (
//               <Card key={index} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
//                 <div className="relative h-48 overflow-hidden">
//                   <ImageWithFallback
//                     src={solution.image}
//                     alt={solution.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div className="absolute top-4 right-4">
//                     <Badge className="bg-blue-600 text-white">
//                       {solution.capacity}
//                     </Badge>
//                   </div>
//                 </div>
//                 <CardHeader>
//                   <CardTitle className="text-xl flex items-center">
//                     <Building2 className="w-6 h-6 text-blue-600 mr-2" />
//                     {solution.title}
//                   </CardTitle>
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

//       {/* Key Features */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Commercial Solar?</h2>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: TrendingDown,
//                 title: "Cost Savings",
//                 description: "Reduce electricity bills by up to 80% with commercial solar"
//               },
//               {
//                 icon: Award,
//                 title: "Tax Benefits",
//                 description: "Accelerated depreciation and other tax incentives available"
//               },
//               {
//                 icon: Clock,
//                 title: "Quick ROI",
//                 description: "Payback period of 3-5 years with 25-year performance guarantee"
//               },
//               {
//                 icon: Shield,
//                 title: "Energy Security",
//                 description: "Hedge against rising electricity costs with fixed solar rates"
//               }
//             ].map((feature, index) => {
//               const IconComponent = feature.icon;
//               return (
//                 <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <IconComponent className="w-8 h-8 text-blue-600" />
//                     </div>
//                     <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//                     <p className="text-gray-600">{feature.description}</p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Financing Options */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Flexible Financing Options</h2>
//             <p className="text-xl text-gray-600">
//               Choose the financing model that works best for your business
//             </p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "CAPEX Model",
//                 description: "Own the system outright and maximize tax benefits",
//                 features: ["100% ownership", "Maximum tax benefits", "Highest long-term savings", "Asset on balance sheet"]
//               },
//               {
//                 title: "OPEX/PPA Model",
//                 description: "Pay per unit of solar power consumed with zero upfront cost",
//                 features: ["Zero upfront investment", "Fixed tariff rates", "O&M included", "Immediate savings"]
//               },
//               {
//                 title: "Lease Model",
//                 description: "Lease the solar system with fixed monthly payments",
//                 features: ["Predictable costs", "Tax advantages", "Flexible terms", "Upgrade options"]
//               }
//             ].map((option, index) => (
//               <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
//                 <CardHeader>
//                   <CardTitle className="text-xl text-center">{option.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600 mb-4 text-center">{option.description}</p>
//                   <ul className="space-y-2">
//                     {option.features.map((feature, idx) => (
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

//       {/* CTA Section */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold mb-4">Transform Your Business with Solar</h2>
//           <p className="text-xl mb-8">
//             Join hundreds of businesses that have already made the smart switch to solar energy
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
//               Get Commercial Quote
//             </Button>
//             <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
//               Schedule Site Visit
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
  Building2, 
  TrendingDown, 
  Award, 
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Clock,
  Shield
} from "lucide-react";

export function CommercialSolutionsPage() {
  const solutions = [
    {
      title: "Office Buildings",
      capacity: "50 kW - 1 MW",
      description: "Solar solutions for corporate offices and business complexes",
      image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Rooftop installation", "Grid tie system", "Remote monitoring", "LEED certification support"]
    },
    {
      title: "Retail & Malls",
      capacity: "100 kW - 2 MW",
      description: "Large-scale installations for shopping centers and retail chains",
      image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Carport structures", "Energy storage", "Demand management", "Green building credits"]
    },
    {
      title: "Healthcare Facilities",
      capacity: "200 kW - 1.5 MW",
      description: "Reliable solar power for hospitals and medical centers",
      image: "https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Backup power", "Critical load support", "Emergency systems", "Uninterrupted operation"]
    }
  ];

  const benefits = [
    "Cost Savings, Higher Profits: Reduce expenses and increase profitability.",
    "Maximize Rooftop Space: Transform unused areas into solar power hubs.",
    "Stable Energy Costs: Protect your business from unpredictable tariffs.",
    "Reliable Systems, Lasting Benefits: Depend on high-performance solar technology.",
    "Eco-Friendly Branding: Adopt clean energy to enhance your company’s reputation.",
    "Quick ROI: Achieve payback in 3-4 years with long-term savings."
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                SolarHut Solutions – Your Trusted Solar Partner!
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Transform your business with sustainable solar energy. 
                Book your SolarHut Plus plan for just ₹999/- and receive a 10g silver coin as a bonus!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-[#ffa500]-600">
                  Download Brochure
                  <BarChart3 className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1745242655016-ee4136634674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBvZmZpY2UlMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTkwMzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Commercial Solar Installation"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits of SolarHut Commercial Rooftop Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how SolarHut’s solar energy solutions can benefit your business operations and bottom line
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Commercial Applications</h2>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SolarHut Commercial Solar?</h2>
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
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Flexible Financing Options</h2>
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

      {/* CTA Section */}
      <section className="py-16 bg-[#FEF7ED] text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4 text-blue-900">Join the SolarHut Revolution</h2>
            <p className="text-2xl mb-8 text-blue-900">
              Partner with SolarHut Solutions to power your business sustainably. Call now at +91 98123 45678!
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#000000]-600 hover:bg-gray-100">
              Request a Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-[#000000] hover:bg-white hover:text-[#000000]-600">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}