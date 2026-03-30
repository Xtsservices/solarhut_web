import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { Plus, Search, Loader, Edit2, Download, ChevronDown, Trash2 } from "lucide-react";
import { getEstimations, deleteEstimation, createInvoice, createTaxInvoice, getRunningEstimations, getPendingEstimations, getWaitingApprovalEstimations, getCompletedEstimations, convertEstimationToJob } from "../../api";
import { gstOptions } from "../../lib/solarOptions";

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
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [runningEstimations, setRunningEstimations] = useState<Requirement[]>([]);
  const [pendingEstimations, setPendingEstimations] = useState<Requirement[]>([]);
  const [waitingApprovalEstimations, setWaitingApprovalEstimations] = useState<Requirement[]>([]);
  const [completedEstimations, setCompletedEstimations] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateTarget, setGenerateTarget] = useState<Requirement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState<{ amount: number; productDescription: string }>({ amount: 0, productDescription: '' });
  const [isTaxDialogOpen, setIsTaxDialogOpen] = useState(false);
  const [taxTarget, setTaxTarget] = useState<Requirement | null>(null);
  const [isTaxGenerating, setIsTaxGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedEstimationForConvert, setSelectedEstimationForConvert] = useState<Requirement | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertForm, setConvertForm] = useState<{ job_code_override: string }>({ job_code_override: '' });

  const [taxForm, setTaxForm] = useState<{
    amount: number;
    product_description: string;
    gst_percentage: number;
  }>({
    amount: 0,
    product_description: '',
    gst_percentage: 0,
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
                structure: item.structure,
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

  useEffect(() => {
    const fetchRunningEstimations = async () => {
      try {
        const response = await getRunningEstimations();
        
        if (response.ok && response.data) {
          // Convert API response to component format
          const formattedRunningEstimations = Array.isArray(response.data.data) 
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
                structure: item.structure,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setRunningEstimations(formattedRunningEstimations);
        } else {
          console.warn("Failed to fetch running estimations:", response.error);
        }
      } catch (error) {
        console.error("Error fetching running estimations:", error);
      }
    };

    fetchRunningEstimations();
  }, []);

  useEffect(() => {
    const fetchPendingEstimations = async () => {
      try {
        const response = await getPendingEstimations();
        
        if (response.ok && response.data) {
          // Convert API response to component format
          const formattedPendingEstimations = Array.isArray(response.data.data) 
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
                structure: item.structure,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setPendingEstimations(formattedPendingEstimations);
        } else {
          console.warn("Failed to fetch pending estimations:", response.error);
        }
      } catch (error) {
        console.error("Error fetching pending estimations:", error);
      }
    };

    fetchPendingEstimations();
  }, []);

  useEffect(() => {
    const fetchWaitingApprovalEstimations = async () => {
      try {
        const response = await getWaitingApprovalEstimations();
        
        if (response.ok && response.data) {
          const formattedData = Array.isArray(response.data.data) 
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
                structure: item.structure,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setWaitingApprovalEstimations(formattedData);
        } else {
          console.warn("Failed to fetch waiting approval estimations:", response.error);
        }
      } catch (error) {
        console.error("Error fetching waiting approval estimations:", error);
      }
    };

    fetchWaitingApprovalEstimations();
  }, []);

  useEffect(() => {
    const fetchCompletedEstimations = async () => {
      try {
        const response = await getCompletedEstimations();
        
        if (response.ok && response.data) {
          const formattedData = Array.isArray(response.data.data) 
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
                structure: item.structure,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setCompletedEstimations(formattedData);
        } else {
          console.warn("Failed to fetch completed estimations:", response.error);
        }
      } catch (error) {
        console.error("Error fetching completed estimations:", error);
      }
    };

    fetchCompletedEstimations();
  }, []);


  const openTaxInvoiceDialog = (req: Requirement) => {
    setTaxTarget(req);
    setTaxForm({
      amount: req.amount || 0,
      product_description: req.productDescription || req.product_description || '',
      gst_percentage: req.gstPercentage || req.gst || 0,
    });
    setIsTaxDialogOpen(true);
  };

  const handleConvertToJob = useCallback(async () => {
    if (!selectedEstimationForConvert || !selectedEstimationForConvert.id) return;
    
    try {
      setIsConverting(true);
      const response = await convertEstimationToJob(
        selectedEstimationForConvert.id,
        convertForm.job_code_override || undefined
      );
      
      if (response.ok) {
        toast.success(`Job created successfully! Job ID: ${response.data?.data?.job?.id || 'N/A'}`);
        setIsConvertDialogOpen(false);
        setSelectedEstimationForConvert(null);
        setConvertForm({ job_code_override: '' });
        // Optionally refresh the estimations lists
      } else {
        toast.error(response.error || 'Failed to convert estimation to job');
      }
    } catch (error) {
      console.error('Error converting estimation to job:', error);
      toast.error('Error converting estimation to job');
    } finally {
      setIsConverting(false);
    }
  }, [selectedEstimationForConvert, convertForm]);

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
                structure: item.structure,
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

  const handleTaxInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxTarget) return;
    setIsTaxGenerating(true);
    try {
      const payload = {
        estimationId: taxTarget.id!,
        amount: taxForm.amount,
        product_description: taxForm.product_description,
        gst_percentage: taxForm.gst_percentage,
      };

      const resp = await createTaxInvoice(payload);
      if (resp.ok) {
        toast.success('Tax Invoice generated successfully');
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
                structure: item.structure,
                createdAt: item.created_at,
                status: item.status,
              }))
            : [];
          setRequirements(formattedRequirements);
        }
        setIsTaxDialogOpen(false);
        setTaxTarget(null);
      } else {
        toast.error(resp.error || 'Failed to create tax invoice');
      }
    } catch (err) {
      console.error('Tax invoice creation error', err);
      toast.error('Failed to create tax invoice');
    } finally {
      setIsTaxGenerating(false);
    }
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

  const handleDelete = async (requirement: Requirement) => {
    if (!window.confirm(`Are you sure you want to delete the requirement for ${requirement.customerName || requirement.customer_name}? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteEstimation(requirement.id!);

      if (response.ok) {
        // Remove from state
        setRequirements(prev => prev.filter(req => req.id !== requirement.id));
        toast.success("Requirement deleted successfully!");
        // Reset pagination if needed
        if (currentPage > 1) {
          setCurrentPage(1);
        }
      } else {
        toast.error(response.error || "Failed to delete requirement");
      }
    } catch (error) {
      console.error("Error deleting requirement:", error);
      toast.error("An error occurred while deleting the requirement");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequirements = requirements.filter(
    (req) => {
      // Status filter - only show Active requirements
      const matchesStatus = req.status === 'Active';

      // Text search filter
      const matchesSearch = 
        (req.customerName || req.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.mobile || "").includes(searchTerm) ||
        (req.city || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter - filter by specific date
      let matchesDate = true;
      if (startDate) {
        const reqDate = new Date(req.created_at || req.createdAt || "");
        const filterDate = new Date(startDate + "T00:00:00");
        
        // Compare dates without time
        const reqDateStr = reqDate.toISOString().split('T')[0];
        const filterDateStr = startDate;
        
        matchesDate = reqDateStr === filterDateStr;
      }

      return matchesStatus && matchesSearch && matchesDate;
    }
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequirements = filteredRequirements.slice(startIndex, endIndex);

  // Reset to first page when search term or date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate]);

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
        <Button 
          onClick={() => navigate("/add-requirement")}
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Requirement
        </Button>
        {/* Generate Invoice Dialog */}
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent style={{ width: 640, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: 16 }}>
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
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
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" disabled={isGenerating}>{isGenerating ? 'Generating...' : 'Generate Invoice'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={isTaxDialogOpen} onOpenChange={setIsTaxDialogOpen}>
  <DialogContent style={{ width: 640, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: 16 }}>
    <DialogHeader>
      <DialogTitle>Generate Tax Invoice</DialogTitle>
      <DialogDescription className="text-xs">
        Review and edit tax invoice details
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleTaxInvoiceSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Customer</Label>
          <Input value={taxTarget?.customerName || taxTarget?.customer_name || ''} disabled />
        </div>
        <div>
    <Label className="text-xs">Mobile</Label>
    <Input value={taxTarget?.mobile || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">Door No</Label>
    <Input value={taxTarget?.doorNo || taxTarget?.door_no || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">Area</Label>
    <Input value={taxTarget?.area || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">City</Label>
    <Input value={taxTarget?.city || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">District</Label>
    <Input value={taxTarget?.district || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">State</Label>
    <Input value={taxTarget?.state || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">Pincode</Label>
    <Input value={taxTarget?.pincode || ''} disabled />
  </div>
  <div>
    <Label className="text-xs">Capacity</Label>
    <Input
      value={taxTarget?.capacityKw || taxTarget?.requested_watts || ''}
      disabled
    />
  </div>
  <div>
    <Label className="text-xs">Structure</Label>
    <Input value={taxTarget?.structure || ''} disabled />
  </div>
      </div>

      <div>
        <Label className="text-xs">GST %</Label>
        <Input
          type="number"
          value={taxForm.gst_percentage}
          onChange={(e) =>
            setTaxForm(p => ({ ...p, gst_percentage: Number(e.target.value) || 0 }))
          }
        />
      </div>

      <div>
        <Label className="text-xs">Amount (₹)</Label>
        <Input
          type="number"
          value={taxForm.amount}
          onChange={(e) =>
            setTaxForm(p => ({ ...p, amount: Number(e.target.value) || 0 }))
          }
        />
      </div>

      <div>
        <Label className="text-xs">Product Description</Label>
        <Textarea
          value={taxForm.product_description}
          onChange={(e) =>
            setTaxForm(p => ({ ...p, product_description: e.target.value }))
          }
          className="h-24"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsTaxDialogOpen(false)}
          disabled={isTaxGenerating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isTaxGenerating}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isTaxGenerating ? 'Generating...' : 'Generate Tax Invoice'}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>


      {/* Requirements Tabs */}
      <Tabs defaultValue="running" className="w-full">
        <TabsList className="flex w-full h-auto">
          <TabsTrigger value="running" className="flex-1">Running Estimations</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Pending Estimations</TabsTrigger>
          <TabsTrigger value="waiting" className="flex-1">Waiting for Approval</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">Completed Estimations</TabsTrigger>
        </TabsList>

        {/* Running Estimations Tab */}
        <TabsContent value="running" className="mt-4">
          <Card>
            <CardHeader className="py-3 px-6 flex flex-row items-center justify-between gap-6">
              <CardTitle className="text-lg flex-shrink-0 font-bold">
                Running Estimations ({runningEstimations.length})
              </CardTitle>
              <div className="flex gap-4 items-center flex-1">
                <div className="flex-1 flex gap-2">
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
                <div className="w-48">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                {startDate && (
                  <Button
                    variant="outline"
                    onClick={() => setStartDate("")}
                    className="h-10"
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-muted-foreground">Loading estimations...</p>
                </div>
              ) : runningEstimations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No running estimations</p>
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
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm w-12">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Customer Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Address & Location</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Capacity</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Product</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Base Amount (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">GST%</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Total (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Invoices</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {runningEstimations.map((req, index) => (
                          <tr key={req.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                              {index + 1}
                            </td>
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-black font-medium inline-flex items-center gap-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer border border-transparent">
                                    <span className="text-sm">Generate</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openGenerateDialog(req)} className="cursor-pointer">
                                    Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openTaxInvoiceDialog(req)} className="cursor-pointer">
                                    Tax Invoice
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                                  onClick={() => navigate(`/add-requirement?id=${req.id}`)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                                  title="Edit"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(req)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
                                  title="Delete"
                                  disabled={isLoading}
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  {isLoading ? (
                                    <Loader className="h-4 w-4 text-red-600 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEstimationForConvert(req);
                                    setConvertForm({ job_code_override: '' });
                                    setIsConvertDialogOpen(true);
                                  }}
                                  className="h-8 px-2 hover:bg-purple-100 cursor-pointer text-xs font-semibold text-purple-600"
                                  title="Convert to Job"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  Convert
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
                      Showing {runningEstimations.length} estimations
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Estimations Tab */}
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader className="py-3 px-6 flex flex-row items-center justify-between gap-6">
              <CardTitle className="text-lg flex-shrink-0 font-bold">
                Pending Estimations ({pendingEstimations.length})
              </CardTitle>
              <div className="flex gap-4 items-center flex-1">
                <div className="flex-1 flex gap-2">
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
                <div className="w-48">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                {startDate && (
                  <Button
                    variant="outline"
                    onClick={() => setStartDate("")}
                    className="h-10"
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-muted-foreground">Loading estimations...</p>
                </div>
              ) : pendingEstimations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending estimations</p>
                  <p className="text-sm">
                    Estimations with pending or portal pending status will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm w-12">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Customer Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Address & Location</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Capacity</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Product</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Base Amount (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">GST%</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Total (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Status</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingEstimations.map((req, index) => (
                          <tr key={req.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                              {index + 1}
                            </td>
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
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center font-medium">
                              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                                {req.status || "Pending"}
                              </span>
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
                                  onClick={() => navigate(`/add-requirement?id=${req.id}`)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                                  title="Edit"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(req)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
                                  title="Delete"
                                  disabled={isLoading}
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  {isLoading ? (
                                    <Loader className="h-4 w-4 text-red-600 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEstimationForConvert(req);
                                    setConvertForm({ job_code_override: '' });
                                    setIsConvertDialogOpen(true);
                                  }}
                                  className="h-8 px-2 hover:bg-purple-100 cursor-pointer text-xs font-semibold text-purple-600"
                                  title="Convert to Job"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  Convert
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-4 px-4 py-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="text-sm text-muted-foreground">
                      Showing {pendingEstimations.length} estimations
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waiting for Approval Tab */}
        {/* Waiting for Approval Tab */}
        <TabsContent value="waiting" className="mt-4">
          <Card>
            <CardHeader className="py-3 px-6 flex flex-row items-center justify-between gap-6">
              <CardTitle className="text-lg flex-shrink-0 font-bold">
                Waiting for Approval ({waitingApprovalEstimations.length})
              </CardTitle>
              <div className="flex gap-4 items-center flex-1">
                <div className="flex-1 flex gap-2">
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
                <div className="w-48">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                {startDate && (
                  <Button
                    variant="outline"
                    onClick={() => setStartDate("")}
                    className="h-10"
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-muted-foreground">Loading estimations...</p>
                </div>
              ) : waitingApprovalEstimations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No estimations waiting for approval</p>
                  <p className="text-sm">
                    Estimations pending approval will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm w-12">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Customer Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Address & Location</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Capacity</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Product</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Base Amount (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">GST%</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Total (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Status</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitingApprovalEstimations.map((req, index) => (
                          <tr key={req.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                              {index + 1}
                            </td>
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
                                  onClick={() => navigate(`/add-requirement?id=${req.id}`)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                                  title="Edit"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(req)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
                                  title="Delete"
                                  disabled={isLoading}
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  {isLoading ? (
                                    <Loader className="h-4 w-4 text-red-600 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEstimationForConvert(req);
                                    setConvertForm({ job_code_override: '' });
                                    setIsConvertDialogOpen(true);
                                  }}
                                  className="h-8 px-2 hover:bg-purple-100 cursor-pointer text-xs font-semibold text-purple-600"
                                  title="Convert to Job"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  Convert
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 px-4 py-3 bg-blue-50 rounded border border-blue-200">
                    <div className="text-sm text-muted-foreground">
                      Showing {waitingApprovalEstimations.length} estimations
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Estimations Tab */}
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader className="py-3 px-6 flex flex-row items-center justify-between gap-6">
              <CardTitle className="text-lg flex-shrink-0 font-bold">
                Completed Estimations ({completedEstimations.length})
              </CardTitle>
              <div className="flex gap-4 items-center flex-1">
                <div className="flex-1 flex gap-2">
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
                <div className="w-48">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                {startDate && (
                  <Button
                    variant="outline"
                    onClick={() => setStartDate("")}
                    className="h-10"
                  >
                    Clear Date
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                  <p className="text-muted-foreground">Loading estimations...</p>
                </div>
              ) : completedEstimations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No completed estimations</p>
                  <p className="text-sm">
                    Completed estimations will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm w-12">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Customer Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Address & Location</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Capacity</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">Product</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Base Amount (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">GST%</th>
                          <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-sm">Total (₹)</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Status</th>
                          <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedEstimations.map((req, index) => (
                          <tr key={req.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                              {index + 1}
                            </td>
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
                                  onClick={() => navigate(`/add-requirement?id=${req.id}`)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 cursor-pointer"
                                  title="Edit"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(req)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer"
                                  title="Delete"
                                  disabled={isLoading}
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  {isLoading ? (
                                    <Loader className="h-4 w-4 text-red-600 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedEstimationForConvert(req);
                                    setConvertForm({ job_code_override: '' });
                                    setIsConvertDialogOpen(true);
                                  }}
                                  className="h-8 px-2 hover:bg-purple-100 cursor-pointer text-xs font-semibold text-purple-600"
                                  title="Convert to Job"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  Convert
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 px-4 py-3 bg-green-50 rounded border border-green-200">
                    <div className="text-sm text-muted-foreground">
                      Showing {completedEstimations.length} estimations
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Convert Estimation to Job Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Estimation to Job</DialogTitle>
            <DialogDescription>
              Convert this estimation into a job. Job code is optional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Estimation Details</p>
              <p className="text-sm text-gray-600 mt-1">
                Customer: <span className="font-semibold">{selectedEstimationForConvert?.customerName || 'N/A'}</span>
              </p>
              <p className="text-sm text-gray-600">
                Capacity: <span className="font-semibold">{selectedEstimationForConvert?.capacityKw || 'N/A'}</span>
              </p>
              <p className="text-sm text-gray-600">
                Amount: <span className="font-semibold">₹{(selectedEstimationForConvert?.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </p>
            </div>
            <div>
              <Label htmlFor="jobCodeOverride" className="text-gray-700 font-semibold">Job Code (Optional)</Label>
              <Input
                id="jobCodeOverride"
                placeholder="e.g., JOB-2026-001"
                value={convertForm.job_code_override}
                onChange={(e) => setConvertForm({ ...convertForm, job_code_override: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate a job code</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsConvertDialogOpen(false)}
              disabled={isConverting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConvertToJob}
              disabled={isConverting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isConverting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert to Job'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
