// components/EnquiryForm.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLead } from '../../api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type EnquiryType = 'residential' | 'commercial' | 'industrial';

interface EnquiryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EnquiryData {
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  service_type: string;
  solar_service: string;
  capacity: string;
  message: string;
  location: string;
  property_type: string;
}

const solarServices = [
  { value: 'residential', label: 'Residential Solar' },
  { value: 'commercial', label: 'Commercial Solar' },
  { value: 'industrial', label: 'Industrial Solar' },
];

// Property types for different solar services - using API-accepted values
const propertyTypes = {
  residential: [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Independent House', label: 'Independent House' },
    { value: 'Farmhouse', label: 'Farmhouse' },
  ],
  commercial: [
    { value: 'Office Building', label: 'Office Building' },
    { value: 'Shop', label: 'Shop/Showroom' },
    { value: 'Shopping Mall', label: 'Shopping Mall' },
    { value: 'Hotel', label: 'Hotel/Resort' },
    { value: 'Hospital', label: 'Hospital' },
    { value: 'School', label: 'School/College' },
  ],
  industrial: [
    { value: 'Factory', label: 'Factory' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Manufacturing Unit', label: 'Manufacturing Unit' },
    { value: 'Processing Plant', label: 'Processing Plant' },
  ],
};

const capacities = {
  residential: ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', '10KW+'],
  commercial: ['10KW', '25KW', '50KW', '100KW', '100KW+'],
  industrial: ['10KW', '25KW', '50KW', '100KW', '100KW+'],
};

export function EnquiryFormPopup({ open, onClose, onSuccess }: EnquiryFormProps) {
  const [enquiryData, setEnquiryData] = useState<EnquiryData>({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    service_type: '',
    solar_service: '',
    capacity: '',
    message: '',
    location: '',
    property_type: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!enquiryData.first_name || !enquiryData.last_name || !enquiryData.mobile || !enquiryData.email) {
      toast.error('Please fill all personal details.');
      return;
    }

    // Validate first name format - Allow spaces in UI, will be removed for API
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(enquiryData.first_name.trim())) {
      toast.error('First name must contain only alphabets and spaces, and be between 2-50 characters.');
      return;
    }

    if (!nameRegex.test(enquiryData.last_name.trim())) {
      toast.error('Last name must contain only alphabets and spaces, and be between 2-50 characters.');
      return;
    }

    // Check if names without spaces meet API requirements (2-50 characters)
    const firstNameNoSpaces = enquiryData.first_name.replace(/\s+/g, '');
    const lastNameNoSpaces = enquiryData.last_name.replace(/\s+/g, '');
    
    if (firstNameNoSpaces.length < 2 || firstNameNoSpaces.length > 50) {
      toast.error('First name (without spaces) must be between 2-50 characters.');
      return;
    }
    
    if (lastNameNoSpaces.length < 2 || lastNameNoSpaces.length > 50) {
      toast.error('Last name (without spaces) must be between 2-50 characters.');
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(enquiryData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enquiryData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!enquiryData.service_type || !enquiryData.solar_service || !enquiryData.capacity || !enquiryData.property_type) {
      toast.error('Please fill all installation details.');
      return;
    }

    if (!enquiryData.location) {
      toast.error('Please provide your location.');
      return;
    }

    // Validate message length (API requires at least 5 characters)
    if (enquiryData.message && enquiryData.message.trim().length < 5) {
      toast.error('Message must be at least 5 characters long.');
      return;
    }

    setLoading(true);

    const capitalizeFirst = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    const lowercaseFirst = (str: string) => str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
    const formatCapacity = (str: string) => {
      if (!str) return '';
      // Handle capacity formatting: "100KW" -> "100kW", "100 KW" -> "100kW"
      return str.replace(/([0-9]+)\s*(KW|kw|Kw|kW)(\+)?/i, '$1kW$3').replace(/KW\+/i, 'kW+');
    };

    // Get the full solar service label from the selected value
    const getSolarServiceLabel = (value: string) => {
      const service = solarServices.find(s => s.value === value);
      return service ? service.label : value;
    };

    // Map frontend fields to API expected fields
    const payload = {
      first_name: capitalizeFirst(enquiryData.first_name.replace(/\s+/g, '').trim()), // Remove spaces and capitalize first letter
      last_name: capitalizeFirst(enquiryData.last_name.replace(/\s+/g, '').trim()), // Remove spaces and capitalize first letter
      mobile: enquiryData.mobile.trim(),
      email: enquiryData.email.trim().toLowerCase(),
      service_type: capitalizeFirst(enquiryData.service_type),
      solar_service: getSolarServiceLabel(enquiryData.solar_service), // Send full label "Residential Solar"
      capacity: formatCapacity(enquiryData.capacity),
      message: capitalizeFirst(enquiryData.message.trim()), // Capitalize first letter of message
      location: capitalizeFirst(enquiryData.location.trim()), // Capitalize first letter of location
      property_type: enquiryData.property_type, // Property type values are already properly formatted
    };

    console.log('🚀 Submitting lead:', payload);

    try {
      // Use the centralized API module
      const result = await createLead(payload);
      
      if (result.ok) {
        console.log('✅ Lead created successfully:', result.data);
        setEnquiryData({
          first_name: '', last_name: '', mobile: '', email: '',
          service_type: '', solar_service: '', capacity: '', message: '', location: '', property_type: ''
        });
        onSuccess?.();
        onClose();
      } else {
        console.error('❌ Failed to create lead:', result.error);
        // Error is already handled by the API module with toast notification
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    residential: 'Residential Solar',
    commercial: 'Commercial Solar',
    industrial: 'Industrial Solar',
  };

  const descriptionMap = {
    residential: 'For homes, apartments & villas',
    commercial: 'For offices, shops & buildings',
    industrial: 'For factories & large facilities',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* ensure the modal fits within viewport, stays centered and becomes scrollable if content is tall */}
      <DialogContent className="max-w-2xl w-full mx-4 my-6 sm:my-12 max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="text-2xl">Get Your Free Quote</DialogTitle>
         </DialogHeader>
         
         <form onSubmit={handleSubmit} className="space-y-8">
          {/* pad bottom so submit button is always visible when scrolling */}
          <div className="pb-6">
           {/* Personal Details */}
           <div>
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm">1</div>
               Personal Details
             </h3>
             <div className="grid sm:grid-cols-2 gap-4">
               <div>
                 <Label>First Name *</Label>
                 <Input
                   required
                   value={enquiryData.first_name}
                   onChange={(e) => setEnquiryData({ ...enquiryData, first_name: e.target.value })}
                   placeholder="John or Mary Jane"
                 />
               </div>
               <div>
                 <Label>Last Name *</Label>
                 <Input
                   required
                   value={enquiryData.last_name}
                   onChange={(e) => setEnquiryData({ ...enquiryData, last_name: e.target.value })}
                   placeholder="Doe or Van Der Berg"
                 />
               </div>
               <div>
                 <Label>Mobile *</Label>
                 <Input
                   type="tel"
                   required
                   value={enquiryData.mobile}
                   onChange={(e) => setEnquiryData({ ...enquiryData, mobile: e.target.value })}
                   placeholder="+91 98765 43210"
                 />
               </div>
               <div>
                 <Label>Email *</Label>
                 <Input
                   type="email"
                   required
                   value={enquiryData.email}
                   onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                   placeholder="john@example.com"
                 />
               </div>
             </div>
           </div>
         </div>
 
           {/* Installation Details */}
           <div>
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm">2</div>
               Installation Details
             </h3>
             <div className="grid sm:grid-cols-2 gap-4">
               <div>
                 <Label>Solar Service *</Label>
                 <Select
                   value={enquiryData.solar_service}
                   onValueChange={(v) => {
                     setEnquiryData({ 
                       ...enquiryData, 
                       solar_service: v,
                       property_type: '' // Reset property type when solar service changes
                     });
                   }}
                 >
                   <SelectTrigger><SelectValue placeholder="Select solar service" /></SelectTrigger>
                   <SelectContent>
                     {solarServices.map((service) => (
                       <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
                <div>
                 <Label>Property Type *</Label>
                 <Select
                   value={enquiryData.property_type}
                   onValueChange={(v) => setEnquiryData({ ...enquiryData, property_type: v })}
                   disabled={!enquiryData.solar_service}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder={
                       !enquiryData.solar_service 
                         ? "Select solar service first" 
                         : "Select property type"
                     } />
                   </SelectTrigger>
                   <SelectContent>
                     {enquiryData.solar_service && propertyTypes[enquiryData.solar_service as keyof typeof propertyTypes]?.map((item) => (
                       <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>System Capacity *</Label>
                 <Select
                   value={enquiryData.capacity}
                   onValueChange={(v) => setEnquiryData({ ...enquiryData, capacity: v })}
                   disabled={!enquiryData.solar_service}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder={
                       !enquiryData.solar_service 
                         ? "Select solar service first" 
                         : "Select capacity"
                     } />
                   </SelectTrigger>
                   <SelectContent>
                     {enquiryData.solar_service && capacities[enquiryData.solar_service as keyof typeof capacities]?.map((cap) => (
                       <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Service Type *</Label>
                 <Select
                   value={enquiryData.service_type}
                   onValueChange={(v) => setEnquiryData({ ...enquiryData, service_type: v })}
                 >
                   <SelectTrigger><SelectValue placeholder="Installation or Maintenance" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="installation">Installation</SelectItem>
                     <SelectItem value="maintenance">Maintenance</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </div>
 
           {/* Location */}
           <div>
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm">3</div>
               Location Details
             </h3>
             <Input
               required
               placeholder="Full address with city & pin code"
               value={enquiryData.location}
               onChange={(e) => setEnquiryData({ ...enquiryData, location: e.target.value })}
             />
           </div>
 
           {/* Message */}
           <div>
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm">4</div>
               Additional Information
             </h3>
             <Textarea
               rows={3}
               placeholder="Tell us about your requirements, roof type, current bill, etc. (minimum 5 characters if provided)"
               value={enquiryData.message}
               onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
             />
           </div>
 
           <Button type="submit" size="lg" className="w-full" disabled={loading}>
             {loading ? 'Submitting...' : 'Submit Request'} <ArrowRight className="ml-2" />
           </Button>
         </form>
       </DialogContent>
     </Dialog>
   );
 }