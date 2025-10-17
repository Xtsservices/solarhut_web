import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  HelpCircle, 
  Zap, 
  DollarSign, 
  Shield, 
  MessageSquare,
  Phone
} from "lucide-react";

export function FAQPage() {
  const faqCategories = [
    {
      title: "General Questions",
      icon: HelpCircle,
      faqs: [
        {
          question: "What is solar energy and how does it work?",
          answer: "Solar energy is electricity generated from sunlight using photovoltaic (PV) panels. When sunlight hits the solar panels, it creates an electric field that generates direct current (DC) electricity. An inverter then converts this DC electricity into alternating current (AC) electricity that can be used in your home or business."
        },
        {
          question: "How much can I save with solar panels?",
          answer: "Most customers save 60-90% on their electricity bills with solar. The exact savings depend on your current electricity usage, roof size, and local electricity rates. Our free assessment will provide you with a personalized savings estimate."
        },
        {
          question: "How long do solar panels last?",
          answer: "Solar panels are designed to last 25-30 years or more. Our panels come with a 25-year performance warranty and are built to withstand harsh weather conditions. Most systems continue producing electricity well beyond their warranty period."
        },
        {
          question: "Do solar panels work on cloudy days?",
          answer: "Yes, solar panels still generate electricity on cloudy days, though at reduced efficiency (typically 10-25% of peak output). Modern solar panels are designed to capture both direct and diffuse sunlight."
        }
      ]
    },
    {
      title: "Installation & Technical",
      icon: Zap,
      faqs: [
        {
          question: "How long does the installation process take?",
          answer: "Residential installations typically take 1-3 days, while commercial installations may take 1-4 weeks depending on system size. The entire process from consultation to commissioning usually takes 4-8 weeks, including permits and approvals."
        },
        {
          question: "What is net metering?",
          answer: "Net metering allows you to send excess solar electricity back to the grid and receive credits on your electricity bill. During sunny periods, your system may produce more electricity than you use, and these credits can offset your usage during non-sunny periods."
        },
        {
          question: "Do I need battery storage with my solar system?",
          answer: "Battery storage is optional for grid-tied systems. While not required, batteries provide backup power during outages and can increase your energy independence. We offer both grid-tied and hybrid (with battery) systems."
        },
        {
          question: "What maintenance do solar panels require?",
          answer: "Solar panels require minimal maintenance. Regular cleaning (2-4 times per year) and annual professional inspections are recommended. Our monitoring systems alert us to any performance issues, and we provide comprehensive maintenance services."
        }
      ]
    },
    {
      title: "Financial & Incentives",
      icon: DollarSign,
      faqs: [
        {
          question: "What financing options are available?",
          answer: "We offer multiple financing options including cash purchase, solar loans, leasing, and Power Purchase Agreements (PPA). Each option has different benefits, and our team will help you choose the best option for your situation."
        },
        {
          question: "Are there government subsidies for solar?",
          answer: "Yes, the government offers subsidies up to 40% for residential systems and various incentives for commercial installations. We assist with all subsidy applications and ensure you receive maximum benefits."
        },
        {
          question: "What is the payback period for solar?",
          answer: "Most residential systems pay for themselves within 3-5 years, while commercial systems typically have a 3-4 year payback period. After payback, you enjoy free electricity for the remaining 20+ years of system life."
        },
        {
          question: "Can I get tax benefits from solar installation?",
          answer: "Yes, businesses can claim accelerated depreciation (up to 40% in the first year) and other tax benefits. Residential customers may also be eligible for certain tax incentives. Consult with your tax advisor for specific benefits."
        }
      ]
    },
    {
      title: "Warranty & Support",
      icon: Shield,
      faqs: [
        {
          question: "What warranty do you provide?",
          answer: "We provide a comprehensive 25-year performance warranty on solar panels, 10-year warranty on inverters, and 5-year warranty on installation workmanship. Extended warranties are also available."
        },
        {
          question: "What happens if my solar panels are damaged?",
          answer: "Our warranty covers manufacturing defects and performance issues. For physical damage due to weather or accidents, most homeowner's insurance policies cover solar panels. We assist with insurance claims and repairs."
        },
        {
          question: "Do you provide monitoring services?",
          answer: "Yes, all our systems include smart monitoring that tracks performance in real-time. You can monitor your system through our mobile app, and our team receives alerts if any issues arise."
        },
        {
          question: "What kind of support do you provide after installation?",
          answer: "We provide 24/7 monitoring, annual maintenance services, performance guarantees, and technical support throughout the system's lifetime. Our customer service team is always available to help with any questions or concerns."
        }
      ]
    }
  ];

  const quickFacts = [
    { label: "Installation Time", value: "1-3 Days", description: "For residential systems" },
    { label: "Warranty Period", value: "25 Years", description: "Performance guarantee" },
    { label: "Average Savings", value: "60-90%", description: "On electricity bills" },
    { label: "Payback Period", value: "3-5 Years", description: "Return on investment" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Get answers to the most common questions about solar energy, installation, 
              financing, and more
            </p>
          </div>
        </div>
      </section>

      {/* Quick Facts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Facts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickFacts.map((fact, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#FFA500] mb-2">{fact.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{fact.label}</div>
                  <div className="text-sm text-gray-600">{fact.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-[#FFA500]" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`₹{categoryIndex}-₹{faqIndex}`} className="border-b border-gray-200 last:border-b-0">
                            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50">
                              <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Topics</h2>
            <p className="text-xl text-gray-600">
              Most searched questions about solar energy
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Solar panel cost",
              "Government subsidies",
              "Net metering",
              "Installation time",
              "Maintenance requirements",
              "Battery storage",
              "Warranty coverage",
              "Financing options",
              "ROI calculation",
              "System monitoring"
            ].map((topic, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-base border-orange-200 text-orange-700 hover:bg-orange-50 cursor-pointer">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8">
            Our solar experts are here to help you with personalized answers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#FFA500] hover:bg-gray-100">
              <Phone className="mr-2 w-5 h-5" />
              Call: +91 98123 45678
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#FFA500]">
              <MessageSquare className="mr-2 w-5 h-5" />
              Live Chat Support
            </Button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Helpful Resources</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Solar Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Calculate your potential savings and system size with our online calculator
                </p>
                <Button className="w-full">Use Calculator</Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Subsidy Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete guide to government subsidies and incentives available
                </p>
                <Button className="w-full">Download Guide</Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Installation Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Step-by-step guide to the solar installation process
                </p>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}