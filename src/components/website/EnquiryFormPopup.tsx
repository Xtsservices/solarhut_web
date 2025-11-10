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
import { API_BASE_URL } from './ip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type EnquiryType = 'residential' | 'commercial' | 'industrial';

interface EnquiryFormProps {
  selectedType: EnquiryType;
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
  capacity: string;
  message: string;
  location: string;
  home_type: string;
}

const propertyTypes = {
  residential: [
    { value: 'independent-house', label: 'Independent House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'farmhouse', label: 'Farmhouse' },
  ],
  commercial: [
    { value: 'office', label: 'Office Building' },
    { value: 'shop', label: 'Shop/Showroom' },
    { value: 'mall', label: 'Shopping Mall' },
    { value: 'hotel', label: 'Hotel/Resort' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'school', label: 'School/College' },
  ],
  industrial: [
    { value: 'factory', label: 'Factory' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'manufacturing', label: 'Manufacturing Unit' },
    { value: 'processing', label: 'Processing Plant' },
  ],
};

const capacities = {
  residential: ['1KW', '2KW', '3KW', '4KW', '5KW', '6KW', '7KW', '8KW', '9KW', '10KW', '10KW+'],
  commercial: ['10KW', '25KW', '50KW', '100KW', '100KW+'],
  industrial: ['10KW', '25KW', '50KW', '100KW', '100KW+'],
};

export function EnquiryFormPopup({ selectedType, open, onClose, onSuccess }: EnquiryFormProps) {
  const [enquiryData, setEnquiryData] = useState<EnquiryData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!enquiryData.service_type) {
      toast.error('Please select a service type.');
      return;
    }

    setLoading(true);

    const capitalizeFirst = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    const lowercaseFirst = (str: string) => str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
    const formatCapacity = (str: string) => {
      if (!str) return '';
      return str.replace(/([0-9]+)\s*(KW|kw|Kw|kW)/, '$1kW').replace(/KW\+/i, 'kW+');
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data.message || 'Lead created successfully!');
          setEnquiryData({
            first_name: '', last_name: '', mobile: '', email: '',
            service_type: '', capacity: '', message: '', location: '', home_type: ''
          });
          onSuccess?.();
        } else {
          toast.error(data.message || 'Failed to submit. Please try again.');
        }
      })
      .catch(() => {
        toast.error('Network error. Please try again later.');
      })
      .finally(() => setLoading(false));

    if (onSuccess) {
      onSuccess();
    }
    onClose();
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
                   placeholder="John"
                 />
               </div>
               <div>
                 <Label>Last Name *</Label>
                 <Input
                   required
                   value={enquiryData.last_name}
                   onChange={(e) => setEnquiryData({ ...enquiryData, last_name: e.target.value })}
                   placeholder="Doe"
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
                 <Label>select solar service *</Label>
                 <Select
                   value={enquiryData.home_type}
                   onValueChange={(v) => setEnquiryData({ ...enquiryData, home_type: v })}
                 >
                   <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                   <SelectContent>
                       <SelectItem value="Residential Solar">Residential Solar</SelectItem>
                       <SelectItem value="Commercial Solar">Commercial Solar</SelectItem>
                       <SelectItem value="Industrial Solar">Industrial Solar</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div>
                 <Label>Property Type *</Label>
                 <Select
                   value={enquiryData.home_type}
                   onValueChange={(v) => setEnquiryData({ ...enquiryData, home_type: v })}
                 >
                   <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                   <SelectContent>
                     {propertyTypes[selectedType].map((item) => (
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
                 >
                   <SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger>
                   <SelectContent>
                     {capacities[selectedType].map((cap) => (
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
               placeholder="Tell us about your requirements, roof type, current bill, etc."
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