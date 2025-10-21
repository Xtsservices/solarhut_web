import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Home,
  ArrowRight
} from "lucide-react";
import { MapSection } from "../components/MapSection";

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    solutionType: '',
    message: ''
  });

  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Show thank you screen
    setShowThankYou(true);
  };

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
    <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
      <CardContent className="pt-8 pb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Thank You!
        </h3>
        
        <p className="text-gray-600 mb-4">
          Your solar quote request has been submitted successfully. Our team will contact you within 24 hours.
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
          <div className="space-y-2 text-sm text-left">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <span className="text-gray-700">Expert consultation call</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <span className="text-gray-700">Free site assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <span className="text-gray-700">Custom solar proposal</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => {
              setShowThankYou(false);
              setFormData({ name: '', email: '', phone: '', solutionType: '', message: '' });
            }}
            size="lg" 
            className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Submit Another Quote
          </Button>
          <Button 
            onClick={() => navigate('/')}
            size="lg" 
            variant="outline" 
            className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
  <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-16 sm:py-20">

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Ready to start your solar journey? We're here to help you every step of the way. Get a free consultation and personalized quote today.
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
                  Request a Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Solution Type
                    </label>
                    <Select onValueChange={(value) => setFormData({ ...formData, solutionType: value })}>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your requirements..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-[#FFA500]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Offices</h2>
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
          <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-orange-100">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our solar experts are standing by to help you with any questions or concerns
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00]">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now: +91 9876543210
                </Button>
                {/* <Button size="lg" variant="outline" className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Live Chat Support
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Solar Hut Solutions?</h2>
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