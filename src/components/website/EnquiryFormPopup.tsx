// components/EnquiryForm.tsx
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLead } from '../../api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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

interface FieldErrors {
  first_name?: string;
  last_name?: string;
  mobile?: string;
  email?: string;
  service_type?: string;
  solar_service?: string;
  capacity?: string;
  property_type?: string;
  location?: string;
  message?: string;
}

const solarServices = [
  { value: 'residential', label: 'Residential Solar' },
  { value: 'commercial', label: 'Commercial Solar' },
  { value: 'industrial', label: 'Industrial Solar' },
];

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

export function EnquiryFormPopup({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
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

  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Real-time validation
  const validateField = (name: keyof EnquiryData, value: string): string | undefined => {
    switch (name) {
      case 'first_name':
      case 'last_name':
        const trimmed = value.trim();
        if (!trimmed) return 'This field is required.';
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        if (!nameRegex.test(trimmed)) return 'Only alphabets and spaces allowed (2–50 chars).';
        const noSpaces = trimmed.replace(/\s+/g, '');
        if (noSpaces.length < 2 || noSpaces.length > 50) return 'After removing spaces, must be 2–50 characters.';
        return undefined;

      case 'mobile':
        if (!value) return 'Mobile number is required.';
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(value)) return 'Enter valid 10-digit Indian mobile number.';
        return undefined;

      case 'email':
        if (!value) return 'Email is required.';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|co|net|org|edu|gov|biz|info|io|ai|tech|app)$/i;
        if (!emailRegex.test(value)) return 'Enter a valid email address (e.g., user@example.com).';
        // Disallow consecutive dots and leading/trailing dots in local part
        const local = value.split('@')[0] || '';
        if (/^\.|\.$|\.\./.test(local)) return 'Email local part cannot start/end with a dot or have consecutive dots.';
        return undefined;

      case 'location':
        if (!value.trim()) return 'Location is required.';
        if (value.trim().length < 10) return 'Please enter full address with city & pin code.';
        return undefined;

      case 'service_type':
        if (!value) return 'Please select service type.';
        return undefined;

      case 'solar_service':
        if (!value) return 'Please select solar service.';
        return undefined;

      case 'capacity':
        if (!value) return 'Please select system capacity.';
        return undefined;

      case 'property_type':
        if (!value) return 'Please select property type.';
        return undefined;

      case 'message':
        if (value && value.trim().length > 0 && value.trim().length < 5) {
          return 'Message must be at least 5 characters if provided.';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof EnquiryData, value: string) => {
    let sanitized = value;

    // Sanitize mobile: only digits, max 10
    if (name === 'mobile') {
      sanitized = value.replace(/\D/g, '').slice(0, 10);
    }

    setEnquiryData(prev => ({ ...prev, [name]: sanitized }));
    const error = validateField(name, sanitized);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {};

    // Personal
    newErrors.first_name = validateField('first_name', enquiryData.first_name);
    newErrors.last_name = validateField('last_name', enquiryData.last_name);
    newErrors.mobile = validateField('mobile', enquiryData.mobile);
    newErrors.email = validateField('email', enquiryData.email);

    // Installation
    newErrors.solar_service = validateField('solar_service', enquiryData.solar_service);
    newErrors.property_type = validateField('property_type', enquiryData.property_type);
    newErrors.capacity = validateField('capacity', enquiryData.capacity);
    newErrors.service_type = validateField('service_type', enquiryData.service_type);

    // Location & Message
    newErrors.location = validateField('location', enquiryData.location);
    newErrors.message = validateField('message', enquiryData.message);

    setErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields and show inline errors under each field
    if (!validateAll()) {
      // validateAll sets `errors` state, so just return to show inline messages
      return;
    }
    setLoading(true);

    const capitalizeFirst = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    const formatCapacity = (str: string) => {
      if (!str) return '';
      return str.replace(/([0-9]+)\s*(KW|kw|Kw|kW)(\+)?/i, '$1kW$3').replace(/KW\+/i, 'kW+');
    };

    const getSolarServiceLabel = (value: string) => {
      const service = solarServices.find(s => s.value === value);
      return service ? service.label : value;
    };

    const payload = {
      first_name: capitalizeFirst(enquiryData.first_name.replace(/\s+/g, '').trim()),
      last_name: capitalizeFirst(enquiryData.last_name.replace(/\s+/g, '').trim()),
      mobile: enquiryData.mobile.trim(),
      email: enquiryData.email.trim().toLowerCase(),
      service_type: capitalizeFirst(enquiryData.service_type),
      solar_service: getSolarServiceLabel(enquiryData.solar_service),
      capacity: formatCapacity(enquiryData.capacity),
      message: enquiryData.message.trim() ? capitalizeFirst(enquiryData.message.trim()) : '',
      location: capitalizeFirst(enquiryData.location.trim()),
      property_type: enquiryData.property_type,
    };

    console.log('Submitting lead:', payload);

    try {
      const result = await createLead(payload);

      if (result.ok) {
        toast.success('Thank you! Your enquiry has been submitted.');
        setEnquiryData({
          first_name: '', last_name: '', mobile: '', email: '',
          service_type: '', solar_service: '', capacity: '', message: '', location: '', property_type: ''
        });
        setErrors({});
        onSuccess?.();
        onClose();
      } else {
        // Try to parse error as object if possible
        let errorObj: any = {};
        if (typeof result.error === 'string') {
          try {
            errorObj = JSON.parse(result.error);
          } catch {
            errorObj = {};
          }
        } else if (typeof result.error === 'object') {
          errorObj = result.error;
        }
        if (errorObj.errors && Array.isArray(errorObj.errors)) {
          const emailError = errorObj.errors.find((err: any) => err.field === 'email');
          if (emailError) {
            toast.error(emailError.message);
            return;
          }
        }
        toast.error(errorObj.message || result.error || 'Failed to create lead.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full mx-4 my-6 sm:my-12 rounded-2xl overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto p-6 py-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center sm:text-left">Get Your Free Quote</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="pb-6 space-y-8">

            {/* 1. Personal Details */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Personal Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(['first_name', 'last_name'] as const).map((field) => (
                  <div key={field}>
                    <Label>{field === 'first_name' ? 'First Name' : 'Last Name'} *</Label>
                    <Input
                      value={enquiryData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={field === 'first_name' ? 'Enter your first name' : 'Enter your last name'}
                      className={`mt-2 rounded-lg ${errors[field] ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors[field] && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                        <AlertCircle className="w-3 h-3" /> {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <Label>Mobile *</Label>
                  <Input
                    type="tel"
                    value={enquiryData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength={10}
                    className={`mt-2 rounded-lg ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.mobile && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={enquiryData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className={`mt-2 rounded-lg ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Installation Details */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                Installation Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">

                <div>
                  <Label>Solar Service *</Label>
                  <Select
                    value={enquiryData.solar_service}
                    onValueChange={(v) => {
                      setEnquiryData({ ...enquiryData, solar_service: v, property_type: '', capacity: '' });
                      setErrors(prev => ({ ...prev, solar_service: undefined, property_type: undefined, capacity: undefined }));
                    }}
                  >
                    <SelectTrigger className={`mt-2 rounded-lg ${errors.solar_service ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select solar service" />
                    </SelectTrigger>
                    <SelectContent>
                      {solarServices.map((service) => (
                        <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.solar_service && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.solar_service}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Property Type *</Label>
                  <Select
                    value={enquiryData.property_type}
                    onValueChange={(v) => handleInputChange('property_type', v)}
                    disabled={!enquiryData.solar_service}
                  >
                    <SelectTrigger className={`mt-2 rounded-lg ${errors.property_type ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={!enquiryData.solar_service ? "Select solar service first" : "Select property type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {enquiryData.solar_service && propertyTypes[enquiryData.solar_service as keyof typeof propertyTypes]?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.property_type && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.property_type}
                    </p>
                  )}
                </div>

                <div>
                  <Label>System Capacity *</Label>
                  <Select
                    value={enquiryData.capacity}
                    onValueChange={(v) => handleInputChange('capacity', v)}
                    disabled={!enquiryData.solar_service}
                  >
                    <SelectTrigger className={`mt-2 rounded-lg ${errors.capacity ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={!enquiryData.solar_service ? "Select solar service first" : "Select capacity"} />
                    </SelectTrigger>
                    <SelectContent>
                      {enquiryData.solar_service && capacities[enquiryData.solar_service as keyof typeof capacities]?.map((cap) => (
                        <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.capacity && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.capacity}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Service Type *</Label>
                  <Select
                    value={enquiryData.service_type}
                    onValueChange={(v) => handleInputChange('service_type', v)}
                  >
                    <SelectTrigger className={`mt-2 rounded-lg ${errors.service_type ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Installation or Maintenance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.service_type && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {errors.service_type}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                Location Details *
              </h3>
              <Input
                placeholder="Full address with city & pin code (min 10 chars)"
                value={enquiryData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`rounded-lg ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.location && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.location}
                </p>
              )}
            </div>

            {/* 4. Message */}
            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFA500] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                Additional Information (Optional)
              </h3>
              <Textarea
                rows={3}
                placeholder="Roof type, current bill, special needs... (min 5 chars if provided)"
                value={enquiryData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`rounded-lg ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.message && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1" style={{ color: '#dc2626' }}>
                  <AlertCircle className="w-3 h-3" /> {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl text-lg font-medium bg-[#FFA500] hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}