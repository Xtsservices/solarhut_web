import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { useNavigate } from "react-router-dom";

export function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [showThankYou, setShowThankYou] = useState(false);

  const handlePhoneClick = (phoneNumber: string) => {
    window.open(`tel:₹{phoneNumber}`, '_self');
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
      details: ["Greater Austin Area", "Central Texas Region"]
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 9878965431", "+91 9876543210"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@solarhutsolutions.com", "support@solarhutsolutions.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 8AM-6PM", "Sat: 9AM-4PM"]
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
              <span className="text-gray-700">Free property assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FFA500] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
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
          className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 w-full"
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
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
                      placeholder="Enter your phone number"
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
                    <Button type="submit" size="lg" className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white flex-1">
                      Get Free Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button 
                      type="button" 
                      size="lg" 
                      variant="outline" 
                      className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50"
                      onClick={handleCalculatorClick}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Savings
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

           
          </div>
            </div>
      </div>
    </section>
  );
}