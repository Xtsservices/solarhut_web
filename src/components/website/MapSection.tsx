import React from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface MapSectionProps {
  onNavigate?: (page: string) => void;
}

export function MapSection({ onNavigate }: MapSectionProps) {
  const handleDirections = () => {
    const address = "RAM SVR, Plot No 4/2, Sector 1, Madhapur, HUDA Techno Enclave, HITEC City, Hyderabad, Telangana 500081";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, "_blank");
  };

  const handlePhoneClick = () => {
    window.open("tel:+919876543210", "_self");
  };

  const handleEmailClick = () => {
    window.open("mailto:info@solarhutsolutions.com", "_self");
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Location",
      content: "D No: 77-14-13, Ground Floor, Shanthi Nagar, Pypula Road, Ajith Singh Nagar, Vijayawada, India",
      action: handleDirections,
      actionText: "Get Directions",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "99661 77225",
      action: handlePhoneClick,
      actionText: "Call Now",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-7PM, Sat: 10AM-5PM",
      action: null,
      actionText: null,
    },
    {
      icon: Mail,
      title: "Email",
      content: "solarhutsolutions@gmail.com",
      action: handleEmailClick,
      actionText: "Send Email",
    },
  ];

  return (
    <section className="section-padding bg-gray-50 border-t border-gray-200">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
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
            <h3 className="text-2xl text-gray-900 mb-6">
              Get in Touch
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-[#FFA500] rounded-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 mb-1">
                            {info.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {info.content}
                          </p>
                          {info.action && (
                            <button
                              onClick={info.action}
                              className="text-[#FFA500] hover:text-[#FF8C00] text-sm transition-colors"
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
                <h4 className="text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 text-[#FFA500] mr-2" />
                    Our Service Areas
                </h4>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="text-gray-900 mb-1">Andhra Pradesh:</p>
                      <ul className="space-y-1">
                        <li>• Rajahmundry</li>
                        <li>• Eluru</li>
                        <li>• Vijayawada</li>
                        <li>• Guntur</li>
                        <li>• Kakinada</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">Telangana:</p>
                      <ul className="space-y-1">
                        <li>• Hyderabad</li>
                        <li>• Khammam</li>
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
                {/* Embedded Google Map (non-interactive) */}
                <iframe
                  src="https://maps.google.com/maps?q=RAM+SVR,+Plot+No+4/2,+Sector+1,+Madhapur,+HUDA+Techno+Enclave,+HITEC+City,+Hyderabad,+Telangana+500081&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Solar Hut Solutions Location"
                  className="rounded-lg absolute inset-0 z-0"
                ></iframe>

                {/* Interaction overlay:
                  - blocks clicks (so pins/info windows cannot be opened)
                  - allows drag/pan when pointer moves (hand-scroll)
                */}
                {/* Overlay that blocks clicks but allows drag-to-pan: */}
                <div
                  aria-hidden="true"
                  title="Map interaction (drag to pan)"
                  className="absolute inset-0 z-10"
                  style={{ touchAction: 'none', cursor: 'grab' }}
                  onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
                    const el = e.currentTarget as HTMLDivElement;
                    // track start coordinates in closure
                    const startX = e.clientX;
                    const startY = e.clientY;
                    let moved = false;

                    const onMove = (ev: PointerEvent) => {
                      const dx = Math.abs(ev.clientX - startX);
                      const dy = Math.abs(ev.clientY - startY);
                      if (!moved && (dx > 6 || dy > 6)) {
                        moved = true;
                        // allow iframe to receive pointer events so user can pan/drag
                        el.style.pointerEvents = 'none';
                        // change cursor to grabbing on body for UX
                        document.body.style.cursor = 'grabbing';
                        // remove move listener (we don't need to track further)
                        window.removeEventListener('pointermove', onMove);
                      }
                    };

                    const onUp = () => {
                      // restore overlay after short delay so click doesn't pass through
                      setTimeout(() => {
                        el.style.pointerEvents = 'auto';
                        document.body.style.cursor = '';
                      }, 200);
                      window.removeEventListener('pointermove', onMove);
                      window.removeEventListener('pointerup', onUp);
                    };

                    window.addEventListener('pointermove', onMove);
                    window.addEventListener('pointerup', onUp);
                  }}
                  onClick={(e) => {
                    // Block direct clicks that would open map UI — keep iframe inert for clicks
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onWheel={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.pointerEvents = 'none';
                    // re-enable after short delay so user can continue interacting with page
                    window.setTimeout(() => {
                      el.style.pointerEvents = 'auto';
                    }, 250);
                  }}
                />

                {/* Map overlay with company info */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg max-w-xs sm:max-w-xs z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-[#FFA500] rounded-full animate-pulse"></div>
                    <h4 className="text-gray-900">Solar Hut Solutions</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Hyderabad's Premier Solar Installation Company
                  </p>
                  <button
                    onClick={handleDirections}
                    className="text-[#FFA500] hover:text-[#FF8C00] text-sm flex items-center transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
