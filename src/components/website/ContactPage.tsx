import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Home,
  ArrowRight,
  Briefcase,
  Package
} from "lucide-react";
import { MapSection } from "./MapSection";
import { toast } from 'sonner';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

type ContactType = 'general' | 'job' | 'supplier';

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [selectedType, setSelectedType] = useState<ContactType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    solutionType: '',
    message: '',
    // Job-specific fields
    position: '',
    experience: '',
    resume: '',
    // Supplier-specific fields
    companyName: '',
    productsSupplied: '',
    yearsInBusiness: '',
  });

  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    toast.success('Your request has been submitted successfully! Our team will contact you within 24 hours.');
    // Show thank you screen
    setShowThankYou(true);
  };

  const handleReturnHome = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  const contactTypes = [
    {
      id: 'general' as ContactType,
      icon: MessageSquare,
      title: 'General Enquiry',
      description: 'Get a quote or ask questions',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'job' as ContactType,
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Join our installation team',
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'supplier' as ContactType,
      icon: Package,
      title: 'Supplier Partnership',
      description: 'Supply solar components',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["123 Solar Street, Green City", "Mumbai, Maharashtra 400001"]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["Sales: +91 98123 45678", "Support: +91 91234 56789"]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: ["sales@solarhutsolutions.com", "support@solarhutsolutions.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"]
    }
  ];

  const offices = [
    {
      city: "Mumbai",
      address: "123 Solar Street, Green City, Mumbai 400001",
      phone: "+91 98111 22334",
      email: "mumbai@solarhutsolutions.com"
    },
    {
      city: "Delhi",
      address: "456 Energy Avenue, New Delhi 110001",
      phone: "+91 91234 56780",
      email: "delhi@solarhutsolutions.com"
    },
    {
      city: "Bangalore",
      address: "789 Tech Park Road, Bangalore 560001",
      phone: "+91 98765 43210",
      email: "bangalore@solarhutsolutions.com"
    },
    {
      city: "Chennai",
      address: "321 Solar Plaza, Chennai 600001",
      phone: "+91 99887 76655",
      email: "chennai@solarhutsolutions.com"
    }
  ];

  // Thank You Card Component
  const ThankYouCard = () => (
    <Card className="text-center bg-orange-50 border-orange-200">
      <CardContent className="pt-8 pb-8">
        <div className="w-16 h-16 bg-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl text-gray-900 mb-3">
          Thank You!
        </h3>
        
        <p className="text-gray-600 mb-4">
          Your solar quote request has been submitted successfully. Our team will contact you within 24 hours.
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h4 className="text-gray-900 mb-3">What's Next?</h4>
          <div className="space-y-2 text-sm text-left">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</div>
              <span className="text-gray-700">Expert consultation call</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</div>
              <span className="text-gray-700">Free site assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</div>
              <span className="text-gray-700">Custom solar proposal</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => {
              setShowThankYou(false);
              setSelectedType(null);
              setFormData({ 
                name: '', 
                email: '', 
                phone: '', 
                solutionType: '', 
                message: '',
                position: '',
                experience: '',
                resume: '',
                companyName: '',
                productsSupplied: '',
                yearsInBusiness: '',
              });
            }}
            size="lg" 
            className="bg-[#FFA500] hover:bg-[#FF8C00] text-white w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Submit Another Request
          </Button>
          <Button 
            onClick={handleReturnHome}
            size="lg" 
            variant="outline" 
            className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200 w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // If no type is selected, show type selection
  if (!selectedType) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
        {/* Hero Section */}
        <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to start your solar journey? We're here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Type Selection */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <p className="text-xl text-gray-600">
                Select the option that best fits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {contactTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-[#FFA500] group"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-8 h-8 ${type.iconColor}`} />
                      </div>
                      <h3 className="text-xl text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-gray-600">{type.description}</p>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FFA500] mx-auto mt-4 transform group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-xl bg-orange-50">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl text-gray-900 mb-4">Need Immediate Assistance?</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our solar experts are standing by to help you with any questions or concerns
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-[#FFA500] hover:bg-[#FF8C00]"
                    onClick={() => window.open('tel:+919876543210', '_self')}
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Call Now: +91 9876543210
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <MapSection />
      </div>
    );
  }

  // Show form based on selected type
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Breadcrumb Header */}
      <section className="bg-[#FEF7ED] border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedType(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rotate-180 flex-shrink-0" />
            <span>Back to options</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
              {selectedType === 'job' ? 'Job Opportunities' :
               selectedType === 'supplier' ? 'Supplier Partnership' :
               'Get in Touch'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedType === 'job' ? 'Join our team and build a career in renewable energy' :
               selectedType === 'supplier' ? 'Partner with us to supply quality solar components' :
               'Ready to start your solar journey? We\'re here to help you every step of the way.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-12 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            {showThankYou ? (
              <ThankYouCard />
            ) : (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center">
                    <MessageSquare className="w-5 h-5 text-[#FFA500] mr-2" />
                    {selectedType === 'job' ? 'Job Application Form' :
                     selectedType === 'supplier' ? 'Supplier Registration Form' :
                     'Request a Quote'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Personal Details - Common for all types */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">
                          {selectedType === 'supplier' ? 'Contact Person Name *' : 'Full Name *'}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    {/* General Contact - Solution Type */}
                    {selectedType === 'general' && (
                      <div>
                        <Label htmlFor="solutionType">Solution Type</Label>
                        <Select onValueChange={(value: string) => setFormData({ ...formData, solutionType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select solution type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential Solar</SelectItem>
                            <SelectItem value="commercial">Commercial Solar</SelectItem>
                            <SelectItem value="industrial">Industrial Solar</SelectItem>
                            <SelectItem value="ground-mounted">Ground Mounted</SelectItem>
                            <SelectItem value="water-heaters">Solar Water Heaters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Job Application - Specific Fields */}
                    {selectedType === 'job' && (
                      <>
                        <div>
                          <Label htmlFor="position">Position Applying For *</Label>
                          <Select onValueChange={(value: string) => setFormData({ ...formData, position: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="field-executive">Field Executive</SelectItem>
                              <SelectItem value="sales-person">Sales Person</SelectItem>
                              <SelectItem value="installation-technician">Installation Technician</SelectItem>
                              <SelectItem value="project-manager">Project Manager</SelectItem>
                              <SelectItem value="customer-support">Customer Support</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Select onValueChange={(value: string) => setFormData({ ...formData, experience: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {/* Supplier Partnership - Specific Fields */}
                    {selectedType === 'supplier' && (
                      <>
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="productsSupplied">Products You Supply *</Label>
                          <Input
                            id="productsSupplied"
                            type="text"
                            value={formData.productsSupplied}
                            onChange={(e) => setFormData({ ...formData, productsSupplied: e.target.value })}
                            placeholder="e.g., Solar Panels, Inverters, Batteries"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                          <Select onValueChange={(value: string) => setFormData({ ...formData, yearsInBusiness: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select years" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">0-2 years</SelectItem>
                              <SelectItem value="2-5">2-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="message">
                        {selectedType === 'job' ? 'Cover Letter / Additional Information' :
                         selectedType === 'supplier' ? 'Additional Details' :
                         'Message'}
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          selectedType === 'job' ? 'Tell us about yourself and why you want to join our team...' :
                          selectedType === 'supplier' ? 'Tell us about your products and services...' :
                          'Tell us about your requirements...'
                        }
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" size="lg">
                      {selectedType === 'job' ? 'Submit Application' :
                       selectedType === 'supplier' ? 'Submit Partnership Request' :
                       'Send Message'}
                      <Send className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg text-gray-900 mb-2">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offices Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Offices</h2>
            <p className="text-xl text-gray-600">
              Visit us at any of our offices across India
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-[#FFA500]">{office.city}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-600">{office.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{office.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{office.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl bg-orange-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl text-gray-900 mb-4">Need Immediate Assistance?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our solar experts are standing by to help you with any questions or concerns
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#FFA500] hover:bg-[#FF8C00]"
                  onClick={() => window.open('tel:+919876543210', '_self')}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now: +91 9876543210
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Solar Hut Solutions?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Free site assessment and consultation",
              "Customized solutions for your needs",
              "Professional installation team",
              "25-year comprehensive warranty",
              "24/7 monitoring and support",
              "Government subsidy assistance"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow">
                <CheckCircle className="w-6 h-6 text-[#FFA500] flex-shrink-0" />
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <MapSection />
    </div>
  );
}
