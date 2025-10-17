import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function MapSection() {
  const handleDirections = () => {
    // Open Google Maps with directions to the company location
    const address = "RAM SVR, Plot No 4/2, Sector 1, Madhapur, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=₹{encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+91 9876543210', '_self');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Location",
      content: "HITEC City, Hyderabad, Telangana",
      action: handleDirections,
      actionText: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 9876543210",
      action: handlePhoneClick,
      actionText: "Call Now"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
      action: null,
      actionText: null
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@solarhutsolutions.com",
      action: () => window.open('mailto:info@solarhutsolutions.com', '_self'),
      actionText: "Send Email"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Visit Our Location & Service Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Proudly serving Hyderabad and surrounding areas with premium solar solutions. 
            Find us, contact us, or schedule a visit to our office in HITEC City.
          </p>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-[#FFA500]/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-[#FFA500]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {info.content}
                          </p>
                          {info.action && (
                            <button
                              onClick={info.action}
                              className="text-[#FFA500] hover:text-[#FF8C00] font-medium text-sm transition-colors"
                            >
                              {info.actionText}
                            </button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Service Areas */}
            <Card className="bg-gradient-to-r from-[#FFA500]/5 to-[#FF8C00]/5 border-[#FFA500]/20">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 text-[#FFA500] mr-2" />
                  Our Service Areas
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Primary Areas:</p>
                    <ul className="space-y-1">
                      <li>• Hyderabad</li>
                      <li>• Secunderabad</li>
                      <li>• Cyberabad</li>
                      <li>• HITEC City</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Extended Areas:</p>
                    <ul className="space-y-1">
                      <li>• Gachibowli</li>
                      <li>• Kondapur</li>
                      <li>• Kukatpally</li>
                      <li>• Kompally</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Embedded Map */}
          <div className="relative">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-lg overflow-hidden">
                {/* Embedded Google Map */}
                <iframe
                  src="https://maps.google.com/maps?q=RAM+SVR,+Plot+No+4/2,+Sector+1,+Madhapur,+HUDA+Techno+Enclave,+HITEC+City,+Hyderabad,+Telangana+500081&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Solar Hut Solutions Location"
                  className="rounded-lg"
                ></iframe>
              </div>
              
              {/* Map overlay with company info */}
              <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg max-w-xs sm:max-w-xs z-20">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-3 h-3 bg-[#FFA500] rounded-full animate-pulse"></div>
                  <h4 className="font-bold text-gray-900">Solar Hut Solutions</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Hyderabad's Premier Solar Installation Company
                </p>
                <button
                  onClick={handleDirections}
                  className="text-[#FFA500] hover:text-[#FF8C00] font-medium text-sm flex items-center transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}