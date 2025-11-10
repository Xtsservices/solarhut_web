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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // const contactInfo = [
  //   {
  //     title: "Our Office",
  //     icon: MapPin,
  //     details: ["D No: 77-14-13, Ground Floor, Shanthi Nagar, Pypula Road, Ajith Singh Nagar, Vijayawada, India"],
  //   },
  //   {
  //     title: "Phone",
  //     icon: Phone,
  //     details: ["99661 77225"],
  //   },
  //   {
  //     title: "Email",
  //     icon: Mail,
  //     details: ["solarhutsolutions@gmail.com"],
  //   },
  //   {
  //     title: "Business Hours",
  //     icon: Clock,
  //     details: ["Mon–Sat: 9:00 AM – 6:00 PM"],
  //   },
  // ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className="max-w-3xl max-h-[90vh] p-0 bg-white md:rounded-xl border shadow-lg flex flex-col"
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

        {/* Only the Form Section */}
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
            {/* <div>
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
            </div> */}

            <div>
                <Label htmlFor="type">Purpose of Contact *</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select opportunity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Job Opportunity">Job Opportunity</SelectItem>
                        <SelectItem value="Supplier Partnership">Supplier Partnership</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Provide any additional details..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#FFA500] focus:outline-none resize-vertical"
                    rows={4}
                />
            </div>

            {/* <div>
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
            </div> */}

            <Button className="w-full bg-[#FFA500] hover:bg-[#ff8800] text-white mt-4">
              Submit
            </Button>
          </form>
        </div>

        {/* Contact info section removed */}
      </DialogContent>
    </Dialog>
  );
}
