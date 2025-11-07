import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { API_BASE_URL } from './ip';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Sun, 
  Zap, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Users,
  Award,
  Shield,
  TrendingUp,
  Home,
  Building2,
  Factory,
  Briefcase,
  Package,
  ArrowRight,
  IndianRupee,
  Leaf
} from 'lucide-react';

interface EnquiryPageProps {
  onNavigate?: (page: string) => void;
}

type EnquiryType = 'residential' | 'commercial' | 'industrial' | 'job' | 'supplier';

export function EnquiryPage({ onNavigate }: EnquiryPageProps) {
  const [selectedType, setSelectedType] = useState<EnquiryType | null>(null);
  const [enquiryData, setEnquiryData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    service_type: '',
    capacity: '',
    message: '',
    location: '',
    home_type: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validation for service_type
    if (!enquiryData.service_type || enquiryData.service_type.trim() === '') {
      toast.error('Please select a service_type.');
      return;
    }
    setLoading(true);
    // Capitalize first letter for service_type, message, format kW for capacity, lowercase for home_type, first_name, location
    const capitalizeFirst = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    const lowercaseFirst = (str: string) => str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
    const formatCapacity = (str: string) => {
      if (!str) return '';
      // Replace any variant of KW/kW/Kw/kw with kW
      return str.replace(/([0-9]+)\s*(KW|kw|Kw|kW)/, (match, p1) => `${p1}kW`).replace(/KW\+/i, 'kW+');
    };
    const payload = {
      ...enquiryData,
      first_name: lowercaseFirst(enquiryData.first_name),
      location: lowercaseFirst(enquiryData.location),
      message: capitalizeFirst(enquiryData.message),
      service_type: capitalizeFirst(enquiryData.service_type),
      home_type: lowercaseFirst(enquiryData.home_type),
      capacity: formatCapacity(enquiryData.capacity),
    };
    fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        setLoading(false);
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data.message || 'Lead created successfully');
          setEnquiryData({
            first_name: '',
            last_name: '',
            mobile: '',
            email: '',
            service_type: '',
            capacity: '',
            message: '',
            location: '',
            home_type: '',
          });
          setTimeout(() => {
            setSelectedType(null);
          }, 2000);
        } else {
          toast.error(data.message || 'Failed to submit your request. Please try again.');
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error('Network error. Please try again later.');
      });
  };

  const enquiryTypes = [
    {
      id: 'residential' as EnquiryType,
      icon: Home,
      title: 'Residential Solar',
      description: 'For homes, apartments & villas',
      features: ['Up to 10 KW', 'Rooftop Installation', 'Net Metering', 'Subsidy Available']
    },
    {
      id: 'commercial' as EnquiryType,
      icon: Building2,
      title: 'Commercial Solar',
      description: 'For offices, shops & buildings',
      features: ['10 KW - 100 KW', 'Custom Design', 'Tax Benefits', 'Fast ROI']
    },
    {
      id: 'industrial' as EnquiryType,
      icon: Factory,
      title: 'Industrial Solar',
      description: 'For factories & large facilities',
      features: ['100 KW+', 'Ground/Rooftop', 'Energy Audit', 'O&M Support']
    },
  ];

  const whyChooseUs = [
    { icon: Award, text: '500+ Successful Installations' },
    { icon: Users, text: '1000+ Happy Customers' },
    { icon: Shield, text: '25-Year Warranty' },
    { icon: TrendingUp, text: 'Up to 90% Savings' },
  ];

  const processSteps = [
    { number: '1', title: 'Submit Details', desc: 'Fill the quick form' },
    { number: '2', title: 'Site Survey', desc: 'Free assessment' },
    { number: '3', title: 'Get Quote', desc: 'Custom proposal' },
    { number: '4', title: 'Installation', desc: 'Professional setup' },
  ];

  if (!selectedType) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
        {/* Hero Section */}
        <section className="relative bg-[#FEF7ED] py-16 border-b border-gray-200">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
                Get Your Free Solar Quote
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of Indians saving up to ₹50,000 annually on electricity bills
              </p>
            </div>
          </div>
        </section>

        {/* Enquiry Type Selection */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
                What Are You Looking For?
              </h2>
              <p className="text-xl text-gray-600">
                Select the option that best fits your needs
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
              {enquiryTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-[#FFA500] group h-full"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-[#FFA500] transition-colors flex-shrink-0">
                          <IconComponent className="w-7 h-7 text-[#FFA500] group-hover:text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FFA500] transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                      <h3 className="text-xl text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{type.description}</p>
                      <div className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Process Steps */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl text-gray-900 text-center mb-10">
                Our Simple 4-Step Process
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center relative">
                    <div className="w-16 h-16 bg-[#FFA500] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                      {step.number}
                    </div>
                    <h4 className="text-base md:text-lg text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600">{step.desc}</p>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-32px)] h-0.5 bg-[#FFA500]/30"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-gray-900 mb-2">Eco-Friendly</h3>
                  <p className="text-sm md:text-base text-gray-600">Reduce carbon footprint by 80%</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="w-8 h-8 text-[#FFA500]" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-gray-900 mb-2">Great Savings</h3>
                  <p className="text-sm md:text-base text-gray-600">Save ₹40,000-₹50,000 per year</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-gray-900 mb-2">Fast Installation</h3>
                  <p className="text-sm md:text-base text-gray-600">Complete setup in 3-5 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Contact */}
        <section className="py-12 sm:py-16 bg-[#FFA500] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl md:text-3xl mb-3 sm:mb-4">Need Help Choosing?</h3>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
              Our solar experts are here to guide you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto">
              <Button 
                size="lg" 
                className="bg-white text-[#FFA500] hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => window.open('tel:+919876543210', '_self')}
              >
                <Phone className="mr-2 w-5 h-5 flex-shrink-0" />
                <span>Call: +91 98765 43210</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
                onClick={() => window.open('mailto:info@solarhutsolutions.com', '_self')}
              >
                <Mail className="mr-2 w-5 h-5 flex-shrink-0" />
                <span>Email Us</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Form View
  const currentType = enquiryTypes.find(t => t.id === selectedType);
  const IconComponent = currentType?.icon || Sun;

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
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFA500]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-1 sm:mb-2">{currentType?.title}</h1>
              <p className="text-sm sm:text-base text-gray-600">{currentType?.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl md:text-2xl">
                    {selectedType === 'job' ? 'Job Application Form' :
                     selectedType === 'supplier' ? 'Supplier Registration Form' :
                     'Get Your Free Quote'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {/* Personal Details */}
                    <div>
                      <h3 className="text-base md:text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</div>
                        <span>Personal Details</span>
                      </h3>
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                              id="first_name"
                              placeholder="Enter your first name"
                              value={enquiryData.first_name}
                              onChange={(e) => setEnquiryData({ ...enquiryData, first_name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                              id="last_name"
                              placeholder="Enter your last name"
                              value={enquiryData.last_name}
                              onChange={(e) => setEnquiryData({ ...enquiryData, last_name: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="mobile">Mobile Number *</Label>
                            <Input
                              id="mobile"
                              type="tel"
                              placeholder="Enter your mobile number"
                              value={enquiryData.mobile}
                              onChange={(e) => setEnquiryData({ ...enquiryData, mobile: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={enquiryData.email}
                              onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Installation/Business Details */}
                    {(selectedType === 'residential' || selectedType === 'commercial' || selectedType === 'industrial') && (
                      <div>
                        <h3 className="text-base md:text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</div>
                          <span>Installation Details</span>
                        </h3>
                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="home_type">Property Type *</Label>
                              <Select
                                value={enquiryData.home_type}
                                onValueChange={(value: string) => setEnquiryData({ ...enquiryData, home_type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Property Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedType === 'residential' && (
                                    <>
                                      <SelectItem value="independent-house">Independent House</SelectItem>
                                      <SelectItem value="apartment">Apartment</SelectItem>
                                      <SelectItem value="villa">Villa</SelectItem>
                                      <SelectItem value="farmhouse">Farmhouse</SelectItem>
                                    </>
                                  )}
                                  {selectedType === 'commercial' && (
                                    <>
                                      <SelectItem value="office">Office Building</SelectItem>
                                      <SelectItem value="shop">Shop/Showroom</SelectItem>
                                      <SelectItem value="mall">Shopping Mall</SelectItem>
                                      <SelectItem value="hotel">Hotel/Resort</SelectItem>
                                      <SelectItem value="hospital">Hospital</SelectItem>
                                      <SelectItem value="school">School/College</SelectItem>
                                    </>
                                  )}
                                  {selectedType === 'industrial' && (
                                    <>
                                      <SelectItem value="factory">Factory</SelectItem>
                                      <SelectItem value="warehouse">Warehouse</SelectItem>
                                      <SelectItem value="manufacturing">Manufacturing Unit</SelectItem>
                                      <SelectItem value="processing">Processing Plant</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="capacity">System Capacity *</Label>
                              <Select
                                value={enquiryData.capacity}
                                onValueChange={(value: string) => setEnquiryData({ ...enquiryData, capacity: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select System Capacity" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedType === 'residential' && (
                                    <>
                                      <SelectItem value="1KW">1 KW</SelectItem>
                                      <SelectItem value="2KW">2 KW</SelectItem>
                                      <SelectItem value="3KW">3 KW</SelectItem>
                                      <SelectItem value="4KW">4 KW</SelectItem>
                                      <SelectItem value="5KW">5 KW</SelectItem>
                                      <SelectItem value="6KW">6 KW</SelectItem>
                                      <SelectItem value="7KW">7 KW</SelectItem>
                                      <SelectItem value="8KW">8 KW</SelectItem>
                                      <SelectItem value="9KW">9 KW</SelectItem>
                                      <SelectItem value="10KW">10 KW</SelectItem>
                                      <SelectItem value="10KW+">10 KW+</SelectItem>
                                    </>
                                  )}
                                  {(selectedType === 'commercial' || selectedType === 'industrial') && (
                                    <>
                                      <SelectItem value="10KW">10 KW</SelectItem>
                                      <SelectItem value="25KW">25 KW</SelectItem>
                                      <SelectItem value="50KW">50 KW</SelectItem>
                                      <SelectItem value="100KW">100 KW</SelectItem>
                                      <SelectItem value="100KW+">100 KW+</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="service_type">Service Type *</Label>
                              <Select
                                value={enquiryData.service_type}
                                onValueChange={(value: string) => setEnquiryData({ ...enquiryData, service_type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Service Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="installation">Installation</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Details */}
                    <div>
                      <h3 className="text-base md:text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {(selectedType === 'residential' || selectedType === 'commercial' || selectedType === 'industrial') ? '3' : '2'}
                        </div>
                        <span>Location Details</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="location">Address*</Label>
                          <Input
                            id="location"
                            placeholder="Enter your address"
                            value={enquiryData.location}
                            onChange={(e) => setEnquiryData({ ...enquiryData, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h3 className="text-base md:text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {(selectedType === 'residential' || selectedType === 'commercial' || selectedType === 'industrial') ? '4' : '3'}
                        </div>
                        <span>Additional Information</span>
                      </h3>
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          placeholder="Enter your message"
                          value={enquiryData.message}
                          onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-[#FFA500]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Submit Request
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      By submitting, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Card */}
              <Card className="border-0 shadow-lg bg-orange-50">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-base md:text-lg text-gray-900 mb-4">Need Assistance?</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open('tel:+919876543210', '_self')}
                      className="flex items-center gap-3 w-full p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-[#FFA500] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Call Us</p>
                        <p className="text-sm text-gray-900">+91 98765 43210</p>
                      </div>
                    </button>
                    <button
                      onClick={() => window.open('mailto:info@solarhutsolutions.com', '_self')}
                      className="flex items-center gap-3 w-full p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-[#FFA500] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Email Us</p>
                        <p className="text-sm text-gray-900">info@solarhut.com</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-[#FFA500] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600">Working Hours</p>
                        <p className="text-sm text-gray-900">Mon-Sat: 9AM-7PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-base md:text-lg text-gray-900 mb-4">What You Get</h3>
                  <div className="space-y-3">
                    {[
                      'Free site assessment',
                      'Custom solar design',
                      'Subsidy assistance',
                      'Professional installation',
                      '25-year warranty',
                      'Lifetime support'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Badge */}
              <Card className="border-0 bg-[#FFA500] text-white shadow-lg">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-2xl mb-1">24 Hours</p>
                  <p className="text-sm text-white/90">Response Time</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
