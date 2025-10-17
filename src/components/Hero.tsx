import { Button } from "./ui/button";
import { CheckCircle, ArrowRight, Shield, Zap, Leaf } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section id="home" className="section-hero section-padding-lg">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-[#FFA500]/10 text-[#FFA500] rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Leading Solar Solutions Provider
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Power Your Future with
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Solar Hut Solutions
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                Save up to 90% on your electricity bills with our cyclone-resistant durable systems
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands of satisfied customers who have made the switch to clean, renewable energy. 
                Professional installation with industry-leading warranties and flexible financing options.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid gap-4">
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-accent/20">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Save up to 90% on electricity bills</div>
                  <div className="text-sm text-gray-600">Immediate cost reduction from day one</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-primary/20">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Cyclone-resistant durable systems</div>
                  <div className="text-sm text-gray-600">Built to withstand extreme weather conditions</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-secondary/20">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">25-year performance warranty</div>
                  <div className="text-sm text-gray-600">Long-term protection and peace of mind</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg">
                Get  Solar Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary/5 hover:border-primary/80"
              >
                Calculate Your Savings
              </Button> */}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-600">Homes Powered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">₹5M+</div>
                <div className="text-sm text-gray-600">Customer Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Image */}
            <div className="relative">
            <ImageWithFallback
              src="/src/assets/SolarHutImages/solar4.jpeg"
              alt="Solar panels installed on modern home roof with blue sky"
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[600px] object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 left-4 sm:left-6 md:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-l-4 border-secondary w-56 sm:w-64">
              <div className="text-sm text-gray-600 mb-1">Starting from</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">₹0 Down</div>
              <div className="text-sm text-gray-600">Flexible financing available</div>
            </div>
            
            {/* Award Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#FFA500] text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
              #1 Solar Provider
            </div>
            </div>
        </div>
      </div>
    </section>
  );
}