import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Plus, Search, Loader, Edit2, X, Download } from "lucide-react";
import { createEstimation, getEstimations, updateEstimation, createInvoice } from "../../api";
import { solarPanelOptions, inverterOptions, structureOptions, gstOptions } from "../../lib/solarOptions";

// Add this type declaration at the top of your file (or in a global .d.ts file)
interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  // add other env variables here if needed
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;

interface Requirement {
  id?: string | number;
  customer_name?: string;
  customerName?: string;
  door_no?: string;
  doorNo?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  mobile?: string;
  capacity_kw?: string | number;
  capacityKw?: string | number;
  amount?: number;
  gst?: number;
  gstPercentage?: number;
  product_description?: string;
  productDescription?: string;
  structure?: string;
  requested_watts?: number | string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  status?: string;
}

export function RequirementsCapture() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateTarget, setGenerateTarget] = useState<Requirement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState<{ amount: number; productDescription: string }>({ amount: 0, productDescription: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [formData, setFormData] = useState<Requirement>({
    customerName: "",
    doorNo: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    mobile: "",
    capacityKw: "",
    amount: 0,
    gstPercentage: 0,
    productDescription: "",
    structure: "",
  });

  // Fetch estimations on component mount
  useEffect(() => {
    const fetchEstimations = async () => {
      try {
        setIsFetching(true);
        const response = await getEstimations();
        
        if (response.ok && response.data) {
          // Convert API response to component format
          const formattedRequirements = Array.isArray(response.data.data) 
            ? response.data.data.map((item: any) => ({
                id: item.id,
                customerName: item.customer_name,
                doorNo: item.door_no,
                area: item.area,
                city: item.city,
                district: item.district,
                state: item.state,
                pincode: item.pincode,
                mobile: item.mobile,
                capacityKw: item.requested_watts,
                amount: parseFloat(item.amount) || 0,
                gstPercentage: parseFloat(item.gst) || 0,
                productDescription: item.product_description,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setRequirements(formattedRequirements);
        } else {
          console.warn("Failed to fetch estimations:", response.error);
        }
      } catch (error) {
        console.error("Error fetching estimations:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEstimations();
  }, []);

  const states = [
    "Andhra Pradesh",
    "Telangana",
    "Karnataka",
    "Tamil Nadu",
    "Maharashtra",
    "Rajasthan",
    "Gujarat",
    "Uttar Pradesh",
    "Others",
  ];

  const districts: { [key: string]: string[] } = {
    "Andhra Pradesh": [
      "Alluri Sitharama Raju",
      "Anakapalli",
      "Anantapur",
      "Annamayya",
      "Bapatla",
      "Chittoor",
      "Dr. B.R. Ambedkar Konaseema",
      "East Godavari",
      "Eluru",
      "Guntur",
      "Kadapa (YSR)",
      "Kakinada",
      "Krishna",
      "Kurnool",
      "Manyam (Parvathipuram)",
      "Nandyal",
      "NTR",
      "Palnadu",
      "Prakasam",
      "Sri Potti Sriramulu Nellore",
      "Sri Sathya Sai",
      "Srikakulam",
      "Tirupati",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
    ],

    Telangana: [
      "Adilabad",
      "Bhadradri Kothagudem",
      "Hanumakonda",
      "Hyderabad",
      "Jagtial",
      "Jangaon",
      "Jayashankar Bhupalpally",
      "Jogulamba Gadwal",
      "Kamareddy",
      "Karimnagar",
      "Khammam",
      "Komaram Bheem Asifabad",
      "Mahabubabad",
      "Mahabubnagar",
      "Mancherial",
      "Medak",
      "Medchal–Malkajgiri",
      "Mulugu",
      "Nagarkurnool",
      "Nalgonda",
      "Narayanpet",
      "Nirmal",
      "Nizamabad",
      "Peddapalli",
      "Rajanna Sircilla",
      "Ranga Reddy",
      "Sangareddy",
      "Siddipet",
      "Suryapet",
      "Vikarabad",
      "Wanaparthy",
      "Warangal",
      "Yadadri Bhuvanagiri",
    ],
    Karnataka: [
      "Bangalore",
      "Belagavi",
      "Hubli-Dharwad",
      "Mysore",
      "Mangalore",
      "Kalaburagi",
      "Bijapur",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Salem",
      "Trichy",
      "Tiruppur",
      "Kanyakumari",
      "Ramanathapuram",
    ],
    Maharashtra: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Aurangabad",
      "Nashik",
      "Kolhapur",
    ],
    Others: ["Other District"],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "gstPercentage"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = (requirement: Requirement) => {
    setEditingId(requirement.id || null);
    setFormData({
      customerName: requirement.customerName || requirement.customer_name || "",
      doorNo: requirement.doorNo || requirement.door_no || "",
      area: requirement.area || "",
      city: requirement.city || "",
      district: requirement.district || "",
      state: requirement.state || "",
      pincode: requirement.pincode || "",
      mobile: requirement.mobile || "",
      capacityKw: requirement.capacityKw || 0,
      amount: requirement.amount || 0,
      gstPercentage: requirement.gstPercentage || requirement.gst || 0,
      productDescription: requirement.productDescription || requirement.product_description || "",
    });
    setIsDialogOpen(true);
  };

  const openGenerateDialog = (requirement: Requirement) => {
    setGenerateTarget(requirement);
    setGenerateForm({ amount: requirement.amount || 0, productDescription: requirement.productDescription || requirement.product_description || '' });
    setIsGenerateDialogOpen(true);
    toast.info(`Prepare to generate invoice for ${requirement.customerName || requirement.customer_name || requirement.id}`);
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateTarget) return;
    setIsGenerating(true);
    try {
      const payload = {
        estimationId: generateTarget.id,
        amount: generateForm.amount,
        product_description: generateForm.productDescription,
      };

      const resp = await createInvoice(payload);
      if (resp.ok) {
        toast.success('Invoice generated successfully');
        // refresh list
        const refreshResponse = await getEstimations();
        if (refreshResponse.ok && refreshResponse.data) {
          const formattedRequirements = Array.isArray(refreshResponse.data.data)
            ? refreshResponse.data.data.map((item: any) => ({
                id: item.id,
                customerName: item.customer_name,
                doorNo: item.door_no,
                area: item.area,
                city: item.city,
                district: item.district,
                state: item.state,
                pincode: item.pincode,
                mobile: item.mobile,
                capacityKw: item.requested_watts,
                amount: parseFloat(item.amount) || 0,
                gstPercentage: parseFloat(item.gst) || 0,
                productDescription: item.product_description,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setRequirements(formattedRequirements);
        }
        setIsGenerateDialogOpen(false);
        setGenerateTarget(null);
      } else {
        toast.error(resp.error || 'Failed to create invoice');
      }
    } catch (err) {
      console.error('Invoice creation error', err);
      toast.error('Failed to create invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      customerName: "",
      doorNo: "",
      area: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      mobile: "",
      capacityKw: "",
      amount: 0,
      gstPercentage: 0,
      productDescription: "",
      structure: "",
    });
    setIsDialogOpen(false);
  };

  const handleDownload = async (requirement: Requirement) => {
    try {
      toast.loading("Downloading requirement...");
      
      const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3200";
      const downloadUrl = `${API_BASE_URL}/api/estimations/${requirement.id}/download`;
      
      console.log("Download URL:", downloadUrl);
      
      // Make API call to download
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf, application/vnd.ms-excel, text/csv',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `Requirement_${requirement.customerName || requirement.customer_name || "Unknown"}_${new Date().getTime()}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Determine file extension from blob type
      let extension = '.pdf';
      if (blob.type.includes('sheet') || blob.type.includes('excel') || blob.type.includes('csv')) {
        extension = '.xlsx';
      } else if (blob.type.includes('text/csv')) {
        extension = '.csv';
      }

      if (!filename.includes('.')) {
        filename = filename + extension;
      }

      // Create URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Requirement downloaded successfully!");
    } catch (error) {
      console.error("Error downloading requirement:", error);
      toast.dismiss();
      toast.error("Failed to download requirement");
    }
  };

  const validateForm = (): boolean => {
    if (!formData.customerName?.trim()) {
      toast.error("Customer name is required");
      return false;
    }
    if (!formData?.mobile?.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.doorNo?.trim()) {
      toast.error("Door No / House No is required");
      return false;
    }
    if (!formData.area?.trim()) {
      toast.error("Area / Street Name is required");
      return false;
    }
    if (!formData.city?.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.district) {
      toast.error("District is required");
      return false;
    }
    if (!formData.state) {
      toast.error("State is required");
      return false;
    }
    if (!formData.pincode?.trim()) {
      toast.error("Pincode is required");
      return false;
    }
    if (!formData.capacityKw || formData.capacityKw.toString().trim() === "") {
      toast.error("Capacity Required (kW) is required");
      return false;
    }
    if (!formData.productDescription?.trim()) {
      toast.error("Product Description is required");
      return false;
    }
    if (!formData.structure?.trim()) {
      toast.error("Structure is required");
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Estimated Amount is required and must be greater than 0");
      return false;
    }
    if (!formData.gstPercentage || formData.gstPercentage < 0 || formData.gstPercentage > 100) {
      toast.error("GST percentage is required and must be between 0 and 100");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (editingId) {
        // EDIT MODE - Update existing requirement
        try {
          console.log("Updating requirement:", editingId, formData);
          
          const apiPayload = {
            customer_name: formData.customerName,
            door_no: formData.doorNo,
            area: formData.area,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            mobile: formData.mobile,
            product_description: formData.productDescription,
            requested_watts: formData.capacityKw,
            gst: formData.gstPercentage,
            amount: formData.amount,
           
          };
          
         

          const response = await updateEstimation(editingId, apiPayload);
          console.log("Update Response:", response);

          if (response.ok) {
            toast.success("Requirement updated successfully!");
            // Refresh the requirements list
            const refreshResponse = await getEstimations();
            if (refreshResponse.ok && refreshResponse.data) {
              const formattedRequirements = Array.isArray(refreshResponse.data.data) 
                ? refreshResponse.data.data.map((item: any) => ({
                    id: item.id,
                    customerName: item.customer_name,
                    doorNo: item.door_no,
                    area: item.area,
                    city: item.city,
                    district: item.district,
                    state: item.state,
                    pincode: item.pincode,
                    mobile: item.mobile,
                    capacityKw: item.requested_watts,
                    amount: parseFloat(item.amount) || 0,
                    gstPercentage: parseFloat(item.gst) || 0,
                    productDescription: item.product_description,
                    createdAt: item.created_at,
                    status: item.status,
                  }))
                : [];
              setRequirements(formattedRequirements);
            }
          } else {
            console.warn("API update warning:", response.error);
            toast.error("Failed to update requirement");
          }
        } catch (apiError) {
          console.error("API error during update:", apiError);
          toast.error("Error updating requirement");
        }
      } else {
        // CREATE MODE - Add new requirement
        // Save to state first
        const newRequirement: Requirement = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        setRequirements((prev) => [newRequirement, ...prev]);
       

        // Try to save to API
        try {
          console.log("Saving requirement to API:", formData);
          
          // Transform data to match API payload format
          const apiPayload = {
            customer_name: formData.customerName,
            door_no: formData.doorNo,
            area: formData.area,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            mobile: formData.mobile,
            product_description: formData.productDescription,
            requested_watts: formData.capacityKw ,
            gst: formData.gstPercentage,
            amount: formData.amount,
             structure: formData.structure,
          };
          
          
          const response = await createEstimation(apiPayload);

          if (response.ok) {
            toast.success("Requirements captured successfully!");
            // Refresh the requirements list
            const refreshResponse = await getEstimations();
            if (refreshResponse.ok && refreshResponse.data) {
              const formattedRequirements = Array.isArray(refreshResponse.data.data) 
                ? refreshResponse.data.data.map((item: any) => ({
                    id: item.id,
                    customerName: item.customer_name,
                    doorNo: item.door_no,
                    area: item.area,
                    city: item.city,
                    district: item.district,
                    state: item.state,
                    pincode: item.pincode,
                    mobile: item.mobile,
                    capacityKw: item.requested_watts ,
                    amount: parseFloat(item.amount) || 0,
                    gstPercentage: parseFloat(item.gst) || 0,
                    productDescription: item.product_description,
                    createdAt: item.created_at,
                    status: item.status,
                  }))
                : [];
              setRequirements(formattedRequirements);
            }
          } else {
            console.warn("API save warning:", response.error);
            toast.success("Requirements captured (local save)");
          }
        } catch (apiError) {
          console.warn("API error, but requirement saved locally:", apiError);
          toast.success("Requirements captured (local save)");
        }
      }

      // Reset form
      setFormData({
        customerName: "",
        doorNo: "",
        area: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        mobile: "",
        capacityKw: "",
        amount: 0,
        gstPercentage: 0,
        productDescription: "",
        structure: "",
      });

      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving requirement:", error);
      toast.error("Failed to save requirement");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequirements = requirements.filter(
    (req) =>
      (req.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.mobile || "").includes(searchTerm) ||
      (req.city || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = filteredRequirements.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Requirements Capture
          </h1>
          <p className="text-muted-foreground mt-2">
            Capture customer solar requirements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
              <Plus className="h-4 w-4" />
              New Requirement
            </Button>
          </DialogTrigger>
          <DialogContent
            style={{
              width: "90vw",
              maxWidth: "90vw",
              minWidth: "90vw",
              maxHeight: "98vh",
              overflowY: "auto",
              margin: "0 auto",
              padding: "16px",
            }}
          >
            <DialogHeader className="pb-1">
              <div className="flex justify-between items-center w-full">
                <div>
                  <DialogTitle>
                    {editingId ? "Edit Requirement" : "Capture Customer Requirements"}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {editingId 
                      ? "Update the customer details and solar capacity requirements"
                      : "Enter the customer details and solar capacity requirements"}
                  </DialogDescription>
                </div>
                {editingId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Customer Information Section */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-blue-600">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="customerName" className="text-xs text-black">Customer Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="mobile" className="text-xs text-black">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-blue-600">
                  Address Information
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="doorNo" className="text-xs text-black">Door No / House No *</Label>
                    <Input
                      id="doorNo"
                      name="doorNo"
                      placeholder="E.g., 45-B"
                      value={formData.doorNo}
                      onChange={handleInputChange}
                      className="h-8"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="area" className="text-xs text-black">Area / Street Name *</Label>
                    <Input
                      id="area"
                      name="area"
                      placeholder="E.g., Lakshmi Nagar"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="h-8"
                      required
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="state" className="text-xs text-black">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => {
                        handleSelectChange("state", value);
                        handleSelectChange("district", "");
                      }}
                    >
                      <SelectTrigger id="state" className="h-8">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="district" className="text-xs text-black">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        handleSelectChange("district", value)
                      }
                      disabled={!formData.state}
                    >
                      <SelectTrigger id="district" className="h-8">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.state &&
                          districts[formData.state]?.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="city" className="text-xs text-black">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="pincode" className="text-xs text-black">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      required
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Solar Capacity Section */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-blue-600">
                  Solar Capacity Requirement
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="capacityKw" className="text-xs text-black">Inverter type *</Label>
                    <Select
                      value={formData.capacityKw?.toString() || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, capacityKw: value }))}
                    >
                      <SelectTrigger id="capacityKw" className="h-8">
                        <SelectValue placeholder="Select inverter type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inverterOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="productDescription" className="text-xs text-black">Product Description (KW) *</Label>
                    <Select
                      value={formData.productDescription || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, productDescription: value }))}
                    >
                      <SelectTrigger id="productDescription" className="h-8">
                        <SelectValue placeholder="Select solar panel product" />
                      </SelectTrigger>
                      <SelectContent>
                        {solarPanelOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="structure" className="text-xs text-black">Structure *</Label>
                    <Select
                      value={formData.structure || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, structure: value }))}
                    >
                      <SelectTrigger id="structure" className="h-8">
                        <SelectValue placeholder="Select structure type" />
                      </SelectTrigger>
                      <SelectContent>
                        {structureOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Amount and GST Section */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-blue-600">
                  Quotation Details
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="amount" className="text-xs text-black">Total Amount (₹) (Inclusive of GST) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Enter total amount inclusive of GST"
                      value={formData.amount || ""}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="gstPercentage" className="text-xs text-black">GST Percentage (%) *</Label>
                    <Select
                      value={formData.gstPercentage?.toString() || ""}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gstPercentage: parseFloat(value) }))}
                    >
                      <SelectTrigger id="gstPercentage" className="h-8">
                        <SelectValue placeholder="Select GST %" />
                      </SelectTrigger>
                      <SelectContent>
                        {gstOptions.map((option) => (
                          <SelectItem key={option} value={option.toString()}>{option}%</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.amount && formData.amount > 0 && formData.gstPercentage && formData.gstPercentage > 0 && (
                    <div className="bg-blue-50 p-2 rounded-md border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900">
                        Total (Inclusive of GST): ₹{formData.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-blue-800">
                        Base Amount: ₹{(formData.amount / (1 + formData.gstPercentage / 100)).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-blue-800 border-t border-blue-200 pt-1 mt-1">
                        GST ({formData.gstPercentage}%): ₹{(formData.amount - (formData.amount / (1 + formData.gstPercentage / 100))).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="h-8 border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="h-8 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer">
                  {isLoading 
                    ? (editingId ? "Updating..." : "Saving...") 
                    : (editingId ? "Update Requirement" : "Save Requirements")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* Generate Invoice Dialog */}
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent style={{ width: 640, maxWidth: '90vw', padding: 16 }}>
            <DialogHeader>
              <DialogTitle>Generate Tax Invoice</DialogTitle>
              <DialogDescription className="text-xs">Verify invoice details and submit</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleGenerateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Customer Name</Label>
                  <Input value={generateTarget?.customerName || generateTarget?.customer_name || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Mobile</Label>
                  <Input value={generateTarget?.mobile || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Door No</Label>
                  <Input value={generateTarget?.doorNo || generateTarget?.door_no || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Area</Label>
                  <Input value={generateTarget?.area || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">City</Label>
                  <Input value={generateTarget?.city || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">District</Label>
                  <Input value={generateTarget?.district || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">State</Label>
                  <Input value={generateTarget?.state || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Pincode</Label>
                  <Input value={generateTarget?.pincode || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Capacity</Label>
                  <Input value={generateTarget?.capacityKw || generateTarget?.requested_watts || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">Structure</Label>
                  <Input value={generateTarget?.structure || ''} readOnly disabled className="h-8" />
                </div>
                <div>
                  <Label className="text-xs">GST %</Label>
                  <Input value={generateTarget?.gstPercentage || generateTarget?.gst || 0} readOnly disabled className="h-8" />
                </div>
              </div>

              <div>
                <Label htmlFor="genAmount" className="text-xs">Amount (₹)</Label>
                <Input id="genAmount" name="amount" type="number" value={generateForm.amount} onChange={(e) => setGenerateForm(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} className="h-8" />
              </div>

              <div>
                <Label htmlFor="genProduct" className="text-xs">Product Description</Label>
                <Textarea id="genProduct" name="productDescription" value={generateForm.productDescription} onChange={(e) => setGenerateForm(p => ({ ...p, productDescription: e.target.value }))} className="h-24" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={() => { setIsGenerateDialogOpen(false); setGenerateTarget(null); }} disabled={isGenerating}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 text-white" disabled={isGenerating}>{isGenerating ? 'Generating...' : 'Generate Invoice'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by customer name, mobile, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon" className="cursor-pointer">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Captured Requirements ({filteredRequirements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <p className="text-muted-foreground">Loading requirements...</p>
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No requirements captured yet</p>
              <p className="text-sm">
                Click "New Requirement" to add customer requirements
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Customer Name</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Address & Location</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Capacity</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Product</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Base Amount (₹)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">GST%</th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Total (₹)</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Tax Invoice</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequirements.map((req, index) => (
                      <tr key={req.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                          <span>{req.customerName || req.customer_name}</span>
                          <span className="block text-xs text-gray-500 mt-1">{req.mobile}</span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          <div className="space-y-1">
                            <p>{(req.doorNo || req.door_no)} {req.area}</p>
                            <p className="text-xs text-muted-foreground">{req.city}, {req.district}, {req.state} - {req.pincode}</p>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-black font-semibold">
                          {req.capacityKw || "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm">
                          {(req.productDescription || req.product_description) ? (
                            <span title={req.productDescription || req.product_description} className="truncate block max-w-xs">
                              {req.productDescription || req.product_description}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          {(req.amount || 0) > 0 ? `₹${((req.amount || 0) / (1 + ((req.gstPercentage || req.gst || 0) / 100))).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-right text-orange-600">
                          {(req.gstPercentage || req.gst) || 0}%
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-right text-purple-600 font-semibold">
                          {(req.amount || 0) > 0 ? `₹${(req.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => openGenerateDialog(req)}
                              className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-black font-medium inline-flex items-center justify-center rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer border border-transparent"
                            >
                              <span className="text-sm">Generate</span>
                            </button>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(req)}
                              className="h-8 w-8 p-0 hover:bg-green-100 cursor-pointer"
                              title="Download"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(req)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                              title="Edit"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4 px-4 py-3 bg-orange-50 rounded border border-orange-200">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredRequirements.length)} of {filteredRequirements.length} requirements
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-orange-300 text-orange-600 hover:bg-orange-100 cursor-pointer"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 cursor-pointer ${currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-orange-300 text-orange-600 hover:bg-orange-100"}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-orange-300 text-orange-600 hover:bg-orange-100 cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
