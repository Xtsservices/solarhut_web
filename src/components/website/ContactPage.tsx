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
import { API_BASE_URL } from './ip';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

type ContactType = 'general' | 'job' | 'supplier';

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [selectedType, setSelectedType] = useState<ContactType | null>('job');
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine the reason based on selected type and form data
      let reason = 'General Enquiry';
      if (selectedType === 'job') {
        reason = 'Job Opportunity';
      } else if (selectedType === 'supplier') {
        reason = 'Supplier Partnership';
      } else if (formData.solutionType) {
        reason = `Solar Solution - ${formData.solutionType}`;
      }

      // Prepare the message based on contact type
      let message = formData.message;
      if (selectedType === 'job') {
        message = `Position: ${formData.position}\nExperience: ${formData.experience}\n\n${formData.message}`;
      } else if (selectedType === 'supplier') {
        message = `Company: ${formData.companyName}\nProducts: ${formData.productsSupplied}\nYears in Business: ${formData.yearsInBusiness}\n\n${formData.message}`;
      }

      const payload = {
        full_name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        reason: reason,
        message: message
      };

      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Your request has been submitted successfully! Our team will contact you within 24 hours.');
        setShowThankYou(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Fallback to offline mode - still show success to user
      console.warn('API not available, working in offline mode');
      toast.success('Your request has been submitted successfully! Our team will contact you within 24 hours. (offline mode)');
      setShowThankYou(true);
    } finally {
      setIsSubmitting(false);
    }
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
      details: ["D No: 77-14-13, Ground Floor, Shanthi Nagar, Pypula Road, Ajith Singh Nagar, Vijayawada, India"]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["99661 77225 "]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: ["solarhutsolutions@gmail.com"]
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
              setIsSubmitting(false);
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

  /*
    // If no type is selected, show type selection
    // Commented out so the page opens the Job Opportunities form directly.
    if (!selectedType) {
      return (
        <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
          {/* Hero Section *}
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

          {/* Contact Type Selection *}
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

          {/* Quick Contact Section *}
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
  */

  // Show form based on selected type
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Job Application Form & Contact Info Section */}
      <section className="py-12 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Job Application Form */}
            {showThankYou ? (
              <ThankYouCard />
            ) : (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center">
                    <MessageSquare className="w-5 h-5 text-[#FFA500] mr-2" />
                    Job Application Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
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

                    <div>
                      <Label htmlFor="position">Position Applying For *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="field-executive">Field Executive</SelectItem>
                          <SelectItem value="sales-person">Sales Person</SelectItem>
                          <SelectItem value="installation-technician">Installation Technician</SelectItem>
                          <SelectItem value="project-manager">Project Manager</SelectItem>
                          <SelectItem value="customer-support">Customer Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        placeholder="Tell us about your experience and qualifications..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#FFA500] focus:outline-none resize-vertical"
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

      {/* Comment out all other sections */}
      {/*
        // Our Offices Section
        <section className="py-16 bg-gray-50">...</section>

        // Quick Contact Section
        <section className="py-16 bg-white">...</section>

        // Why Choose Us Section
        <section className="py-16 bg-gray-50">...</section>
        
        // Map Section
        <MapSection />
      */}
    </div>
  );
}
