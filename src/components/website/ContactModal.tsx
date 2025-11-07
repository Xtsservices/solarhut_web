import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { X } from "lucide-react"; // for close icon
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const contactInfo = [
    {
      title: "Our Office",
      icon: MapPin,
      details: ["123 Solar Street, Mumbai, India"],
    },
    {
      title: "Phone",
      icon: Phone,
      details: ["+91 98765 43210"],
    },
    {
      title: "Email",
      icon: Mail,
      details: ["info@solarco.in"],
    },
    {
      title: "Business Hours",
      icon: Clock,
      details: ["Mon–Sat: 9:00 AM – 6:00 PM"],
    },
  ];

  return (
    <Dialog
      open={open}
      // ✅ Fix: properly handle dialog open/close changes
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className="max-w-6xl max-h-[90vh] p-0 bg-white md:rounded-xl border shadow-lg flex flex-col"
      >
        {/* Close button (top-right corner) */}
        <DialogClose asChild>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </DialogClose>

        {/* Scrollable area for modal content */}
        <div className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
          {/* Left - Form Section */}
          <div className="p-8 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#FFA500] mb-2">Get in Touch</DialogTitle>
              <DialogDescription>
                Fill in your details and we’ll get back to you soon.
              </DialogDescription>
            </DialogHeader>

            <form className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" placeholder="Enter your phone number" />
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
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Job Opportunity">Job Opportunity</SelectItem>
                    <SelectItem value="Supplier Partnership">Supplier Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select>
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

              <Button className="w-full bg-[#FFA500] hover:bg-[#ff8800] text-white mt-4">
                Submit
              </Button>
            </form>
          </div>

          {/* Right - Contact Info Section */}
          <div className="bg-gray-50 p-8 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {info.title}
                          </h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600">
                              {detail}
                            </p>
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
      </DialogContent>
    </Dialog>
  );
}
