import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Calculator,
  ArrowRight,
  CheckCircle,
  Home
} from "lucide-react";
import { useState } from "react";

interface ContactProps {
  onNavigate?: (page: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [showThankYou, setShowThankYou] = useState(false);

  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleCalculatorClick = () => {
    // For now, scroll to top or can navigate to a calculator page later
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Show thank you screen
    setShowThankYou(true);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Service Area",
      details: ["D No: 77-14-13, Ground Floor, Shanthi Nagar, Pypula Road, Ajith Singh Nagar, Vijayawada, India"]
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["99661 77225 "],
      clickable: true
    },
    {
      icon: Mail,
      title: "Email",
      details: ["solarhutsolutions@gmail.com"],
      clickable: true
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM-7PM", "Sat: 10AM-5PM"]
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
              <span className="text-gray-700">Free property assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</div>
              <span className="text-gray-700">Personalized solar proposal</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => {
            setShowThankYou(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
          }}
          size="lg" 
          variant="outline" 
          className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200 w-full"
        >
          <Home className="w-4 h-4 mr-2" />
          Submit Another Quote
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="contact" className="section-contact section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            Ready to Go Solar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your free solar consultation today. Our experts will assess your property 
            and provide a customized solution for your energy needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {showThankYou ? (
              <ThankYouCard />
            ) : (
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-[#FFA500]" />
                  <span>Get Your Free Solar Quote</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-2">Full Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-2">Phone Number</label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2">Message</label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your energy needs, property details, or any questions you have..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white flex-1">
                      Get Free Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {/* <Button 
                      type="button" 
                      size="lg" 
                      variant="outline" 
                      className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50"
                      onClick={handleCalculatorClick}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Savings
                    </Button> */}
                  </div>
                </form>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#FFA500] rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        info.clickable && info.icon === Phone ? (
                          <button
                            key={idx}
                            onClick={() => handlePhoneClick(detail)}
                            className="block text-gray-600 text-sm hover:text-[#FFA500] transition-colors"
                          >
                            {detail}
                          </button>
                        ) : info.clickable && info.icon === Mail ? (
                          <a
                            key={idx}
                            href={`mailto:${detail}`}
                            className="block text-gray-600 text-sm hover:text-[#FFA500] transition-colors"
                          >
                            {detail}
                          </a>
                        ) : (
                          <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-[#FFA500]">24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Free Consultation</span>
                    <span className="text-[#FFA500]">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Locations</span>
                    <span className="text-[#FFA500] text-right" >Andhra Pradesh and Telangana</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
