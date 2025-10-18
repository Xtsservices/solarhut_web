import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { 
  DollarSign, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Users,
  Building2,
  Factory,
  Calculator,
  Download,
  Clock
} from "lucide-react";

export function SubsidyPage() {
  const subsidySchemes = [
    {
      title: "Central Financial Assistance (CFA)",
      type: "Residential",
      subsidy: "Up to 40%",
      maxAmount: "₹78,000",
      capacity: "Up to 3 kW",
      icon: Users,
      description: "Central government subsidy for residential rooftop solar installations",
      eligibility: ["Individual house owners", "Residential complexes", "RWAs", "Group housing societies"],
      documents: ["Identity proof", "Address proof", "Electricity bill", "Bank account details"],
      timeline: "30-45 days"
    },
    {
      title: "State Government Incentives",
      type: "Residential",
      subsidy: "Up to 30%",
      maxAmount: "₹50,000",
      capacity: "Up to 10 kW",
      icon: Users,
      description: "Additional state-level incentives available in select states",
      eligibility: ["State residents", "Property ownership", "Regular electricity connection"],
      documents: ["Property documents", "State domicile certificate", "NOC from electricity board"],
      timeline: "45-60 days"
    },
    {
      title: "MNRE Grid-Connected Scheme",
      type: "Commercial",
      subsidy: "Up to 20%",
      maxAmount: "₹2,00,000",
      capacity: "Up to 100 kW",
      icon: Building2,
      description: "Ministry support for commercial and institutional solar installations",
      eligibility: ["Commercial establishments", "Educational institutions", "Healthcare facilities"],
      documents: ["Business registration", "GST certificate", "Electrical safety certificate"],
      timeline: "60-90 days"
    },
    {
      title: "Industrial Solar Incentives",
      type: "Industrial",
      subsidy: "Accelerated Depreciation",
      maxAmount: "40% in Year 1",
      capacity: "Above 100 kW",
      icon: Factory,
      description: "Tax benefits and accelerated depreciation for industrial solar projects",
      eligibility: ["Manufacturing units", "Industrial complexes", "Large enterprises"],
      documents: ["Industrial license", "Environmental clearance", "Project report"],
      timeline: "90-120 days"
    }
  ];

  const applicationProcess = [
    {
      step: "1",
      title: "Eligibility Check",
      description: "Verify eligibility criteria and gather required documents",
      duration: "1-2 days"
    },
    {
      step: "2",
      title: "Empaneled Vendor Selection",
      description: "Choose MNRE empaneled solar installer like Truzon Solar",
      duration: "1 day"
    },
    {
      step: "3",
      title: "Online Application",
      description: "Submit application through SOLAROOFTOP portal or state portal",
      duration: "1 day"
    },
    {
      step: "4",
      title: "Technical Feasibility",
      description: "Site inspection and technical approval from DISCOM",
      duration: "7-15 days"
    },
    {
      step: "5",
      title: "Installation",
      description: "Solar system installation by approved vendor",
      duration: "1-3 days"
    },
    {
      step: "6",
      title: "Commissioning",
      description: "System testing, commissioning, and net meter installation",
      duration: "7-10 days"
    },
    {
      step: "7",
      title: "Subsidy Disbursement",
      description: "Direct bank transfer of subsidy amount",
      duration: "30-60 days"
    }
  ];

  const benefits = [
    {
      title: "Residential Solar Benefits",
      items: [
        "Up to 40% central subsidy",
        "Additional state incentives",
        "Net metering facility",
        "25-year system warranty",
        "Quick payback period"
      ]
    },
    {
      title: "Commercial Solar Benefits",
      items: [
        "Reduced electricity costs",
        "Tax benefits and depreciation",
        "Corporate sustainability goals",
        "Improved cash flow",
        "Green building certification"
      ]
    },
    {
      title: "Industrial Solar Benefits",
      items: [
        "40% accelerated depreciation",
        "Input tax credit on GST",
        "Reduced operational costs",
        "Energy security",
        "Environmental compliance"
      ]
    }
  ];

  const stateIncentives = [
    { state: "Gujarat", incentive: "Generation-based incentive + Net metering" },
    { state: "Rajasthan", incentive: "Capital subsidy + Accelerated depreciation" },
    { state: "Maharashtra", incentive: "State subsidy + Banking facility" },
    { state: "Karnataka", incentive: "Capital subsidy + Net metering" },
    { state: "Tamil Nadu", incentive: "Generation incentive + Third-party sale" },
    { state: "Haryana", incentive: "State subsidy + Net metering" }
  ];

  const faqs = [
    {
      question: "What is the maximum subsidy I can get for residential solar?",
      answer: "For residential installations, you can get up to 40% central subsidy (maximum ₹78,000 for systems up to 3 kW) plus additional state incentives where available."
    },
    {
      question: "How long does the subsidy application process take?",
      answer: "The complete process from application to subsidy disbursement typically takes 2-4 months, depending on state procedures and documentation completeness."
    },
    {
      question: "Can I apply for subsidy after installing solar panels?",
      answer: "No, you must apply for subsidy before installation and use only MNRE empaneled vendors to be eligible for central government subsidies."
    },
    {
      question: "What documents are required for subsidy application?",
      answer: "Basic documents include identity proof, address proof, electricity bills, bank account details, and property ownership documents. Specific requirements may vary by state."
    },
    {
      question: "Are there any tax benefits for solar installations?",
      answer: "Yes, commercial and industrial installations can claim accelerated depreciation up to 40% in the first year, along with input tax credit on GST paid."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
  <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Solar Subsidies & Offers
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Maximize your solar savings with government subsidies and tax benefits. 
              Get up to 40% subsidy on residential installations and attractive incentives for commercial projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                <Calculator className="mr-2 w-5 h-5" />
                Calculate My Subsidy
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Download className="mr-2 w-5 h-5" />
                Download Subsidy Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Schemes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Subsidy Schemes</h2>
            <p className="text-xl text-gray-600">
              Comprehensive overview of central and state government solar subsidies
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {subsidySchemes.map((scheme, index) => {
              const IconComponent = scheme.icon;
              return (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {scheme.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{scheme.title}</CardTitle>
                    <p className="text-gray-600">{scheme.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{scheme.subsidy}</div>
                        <div className="text-sm text-gray-600">Subsidy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{scheme.maxAmount}</div>
                        <div className="text-sm text-gray-600">Max Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{scheme.capacity}</div>
                        <div className="text-sm text-gray-600">Capacity</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Eligibility:</h4>
                        <ul className="space-y-1">
                          {scheme.eligibility.map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Processing: {scheme.timeline}</span>
                        </div>
                        <Button size="sm">
                          Apply Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Subsidy Application Process</h2>
            <p className="text-xl text-gray-600">
              Step-by-step guide to apply for solar subsidies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {applicationProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <Badge variant="outline" className="text-xs">
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solar Benefits by Category</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* State Incentives */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">State-wise Solar Incentives</h2>
            <p className="text-xl text-gray-600">
              Additional benefits available in different states
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateIncentives.map((state, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{state.state}</h3>
                  <p className="text-gray-600">{state.incentive}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <Card className="border-0 shadow-xl">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-₹{index}`} className="border-b border-gray-200 last:border-b-0">
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Claim Your Solar Subsidy?</h2>
          <p className="text-xl mb-8">
            Our experts will help you navigate the subsidy process and maximize your benefits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <FileText className="mr-2 w-5 h-5" />
              Start Application
            </Button>
            {/* <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <DollarSign className="mr-2 w-5 h-5" />
              Calculate Savings
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
}