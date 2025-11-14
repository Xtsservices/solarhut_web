import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Award, Lightbulb, Target } from "lucide-react";

interface AboutPageProps {
  onNavigate?: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
              About Solar Hut Solutions
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Leading India's solar revolution with innovative solutions and unwavering commitment to sustainability
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                Founded with a vision to make clean energy accessible to every home and business, 
                Solar Hut Solutions has emerged as India's premier solar solutions provider. Since our inception, 
                we've been dedicated to delivering cutting-edge solar technology that powers the future.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our journey began with a simple belief: that sustainable energy should be affordable, 
                reliable, and efficient. Today, we've helped thousands of customers reduce their electricity 
                bills by up to 90% while contributing to a cleaner, greener planet.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl text-[#FFA500] mb-2">10,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-[#FFA500] mb-2">500MW+</div>
                  <div className="text-gray-600">Installed Capacity</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="/src/assets/AboutPage.jpg"
                alt="Solar Installation in India"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Solar Hut Solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-[#FFA500]" />
                </div>
                <h3 className="text-xl mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Continuously advancing solar technology to deliver the most efficient solutions
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-3">Quality</h3>
                <p className="text-gray-600">
                  Uncompromising standards in every product and service we deliver
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl mb-3">Customer First</h3>
                <p className="text-gray-600">
                  Putting our customers' needs at the heart of everything we do
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-3">Excellence</h3>
                <p className="text-gray-600">
                  Striving for perfection in every project and interaction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-0 shadow-xl bg-orange-50">
              <CardContent className="pt-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900">Our Mission</h3>
                </div>
                <p className="text-lg text-gray-700">
                  To democratize solar energy by making it accessible, affordable, and efficient for 
                  every home and business in India. We are committed to reducing carbon footprints 
                  while maximizing energy savings for our customers.
                </p>
              </CardContent>
            </Card>
            <Card className="p-8 border-0 shadow-xl bg-green-50">
              <CardContent className="pt-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900">Our Vision</h3>
                </div>
                <p className="text-lg text-gray-700">
                  To be India's leading solar energy company, pioneering sustainable solutions that 
                  power a cleaner future. We envision a world where clean energy is the norm, 
                  not the exception.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Certifications & Awards</h2>
            <p className="text-xl text-gray-600">
              Recognized for excellence in solar energy solutions
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-lg border-orange-200 text-orange-700">
              ISO 9001:2015 Certified
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg border-green-200 text-green-700">
              MNRE Approved
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg border-[#FFA500]/30 text-[#FFA500]">
              Best Solar Company 2024
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg border-blue-200 text-blue-700">
              IEC 61215 Certified
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg border-purple-200 text-purple-700">
              ALMM Listed
            </Badge>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Solar Hut Solutions?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience, expertise, and excellence in every solar installation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl text-[#FFA500] mb-4">15+</div>
                <h4 className="text-xl text-gray-900 mb-2">Years of Experience</h4>
                <p className="text-gray-600">
                  Over a decade of expertise in solar installation and maintenance across India
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl text-[#FFA500] mb-4">98%</div>
                <h4 className="text-xl text-gray-900 mb-2">Customer Satisfaction</h4>
                <p className="text-gray-600">
                  Exceptional service quality that keeps our customers happy and satisfied
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl text-[#FFA500] mb-4">24/7</div>
                <h4 className="text-xl text-gray-900 mb-2">Support Available</h4>
                <p className="text-gray-600">
                  Round-the-clock support to ensure your solar system runs smoothly
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
