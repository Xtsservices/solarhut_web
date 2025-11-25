"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import { Textarea } from "../ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "../../api/commonApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Job = {
  id: number;
  customer: {
    first_name: string;
    last_name: string;
    mobile: string;
    email?: string;
    customer_type: "Individual" | "Business" | "Corporate";
    company_name?: string;
    lead_source?: string;
  };
  location: {
    location_type: "Home" | "Office" | "Billing" | "Installation" | "Other";
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district_id: number;
    state_id: number;
    country_id: number;
    pincode: string;
    landmark?: string;
    is_primary: boolean;
  };
  service_type: "Installation" | "Maintenance" | "Repair";
  solar_service: string;
  package_id: number;
  job_priority: "Low" | "Medium" | "High";
  scheduled_date: string;
  job_description: string;
  special_instructions?: string;
  status:
    | "Pending"
    | "Assigned"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Created";
  created_at: string;
  capacity?: string;
  estimated_cost?: number;
  package_name?: string;
};

type Employee = {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  roles: { id: number; role_name: string }[];
};

type Country = { id: number; name: string };
type State = { id: number; name: string; country_id: number };
type District = { id: number; name: string; state_id: number };
type Package = { id: number; name: string; capacity: string; cost: number };

interface JobStats {
  total_jobs: number;
  active_jobs: number;
  closed_jobs: number;
  completion_rate: number;
}

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<JobStats | null>(null);

  // Reference Data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filtered States & Districts
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  // Pagination – SERVER SIDE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 10;

  // Form Data
  const initialForm = {
    customer: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      customer_type: "Individual" as const,
      company_name: "",
      lead_source: "",
    },
    location: {
      location_type: "Installation" as const,
      address_line_1: "",
      address_line_2: "",
      city: "",
      district_id: 0,
      state_id: 0,
      country_id: 0,
      pincode: "",
      landmark: "",
      is_primary: true,
    },
    service_type: "Installation" as const,
    solar_service: "Residential Solar",
    package_id: 0,
    job_priority: "Medium" as const,
    scheduled_date: "",
    job_description: "",
    special_instructions: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // -------------------------------------------------
  // Reference Data
  // -------------------------------------------------
  useEffect(() => {
    const fetchReferenceData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [countryRes, stateRes, districtRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/countries/allCountries`, { headers }),
          fetch(`${API_BASE_URL}/api/states/allStates`, { headers }),
          fetch(`${API_BASE_URL}/api/districts/allDistricts`, { headers }),
        ]);

        const countries = countryRes.ok ? (await countryRes.json()).data || [] : [];
        const states = stateRes.ok ? (await stateRes.json()).data || [] : [];
        const districts = districtRes.ok ? (await districtRes.json()).data || [] : [];

        setCountries(
          countries.map((c: any) => ({
            id: c.id,
            name: c.alias_name || c.name,
          }))
        );
        setStates(
          states.map((s: any) => ({
            id: s.id,
            name: s.alias_name || s.name,
            country_id: s.country_id,
          }))
        );
        setDistricts(
          districts.map((d: any) => ({
            id: d.id,
            name: d.alias_name || d.name,
            state_id: d.state_id,
          }))
        );
      } catch {
        toast.error("Failed to load location data");
      }
    };
    fetchReferenceData();
  }, []);

  // -------------------------------------------------
  // Filter States / Districts
  // -------------------------------------------------
  useEffect(() => {
    if (formData.location.country_id) {
      const filtered = states.filter((s) => s.country_id === formData.location.country_id);
      setFilteredStates(filtered);
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, state_id: 0, district_id: 0 },
      }));
      setFilteredDistricts([]);
    } else {
      setFilteredStates([]);
      setFilteredDistricts([]);
    }
  }, [formData.location.country_id, states]);

  useEffect(() => {
    if (formData.location.state_id) {
      const filtered = districts.filter((d) => d.state_id === formData.location.state_id);
      setFilteredDistricts(filtered);
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, district_id: 0 },
      }));
    } else {
      setFilteredDistricts([]);
    }
  }, [formData.location.state_id, districts]);

  // -------------------------------------------------
  // Packages
  // -------------------------------------------------
  const loadPackages = async () => {
    try {
      const result = await apiGet("/packages");
      if (result?.data?.success && Array.isArray(result?.data?.data)) {
        const pkgs = result.data.data.map((p: any) => ({
          id: Number(p.id),
          name: p.name || "Unnamed",
          capacity: p.capacity || "",
          cost: Number(p.cost || p.price || 0),
        }));
        setPackages(pkgs);
      } else {
        setPackages([]);
      }
    } catch {
      toast.error("Failed to load packages");
      setPackages([]);
    }
  };

  // -------------------------------------------------
  // Employees
  // -------------------------------------------------
  const fetchEmployees = async () => {
    try {
      const response = await apiGet("/employees");
      if (response.status === 200 && Array.isArray(response.data.data)) {
        const mapped = response.data.data.map((e: any) => ({
          id: e.id,
          user_id: e.user_id,
          first_name: e.first_name,
          last_name: e.last_name,
          mobile: e.mobile,
          email: e.email,
          roles: e.roles || [],
        }));
        setEmployees(mapped);
      } else {
        setEmployees([]);
      }
    } catch {
      toast.error("Failed to load employees");
      setEmployees([]);
    }
  };

 // -------------------------------------------------
// Jobs – SERVER SIDE pagination (UPDATED FOR NEW API)
// -------------------------------------------------
const fetchJobs = async (page = currentPage) => {
  try {
    setIsLoading(true);
    const response = await apiGet(`/jobs/allJobs?page=${page}&limit=${jobsPerPage}`);

    if (response.status !== 200 || !response.data?.data) {
      setJobs([]);
      setTotalJobs(0);
      return;
    }

    const payload = response.data;
    const rawJobs = payload.data; // <-- Direct array now

    const mappedJobs: Job[] = (Array.isArray(rawJobs) ? rawJobs : []).map((item: any) => {
      const j = item.job_info;
      const c = item.customer_info;
      const l = item.location_info;
      const p = item.package_info;

      // Split customer name if available, fallback to empty
      const [first_name = "", last_name = ""] = (c.customer_name || "").trim().split(" ");

      // Find matching IDs from pre-loaded reference data
      const country = countries.find(
        (ct) => ct.name?.toLowerCase() === l.country_name?.toLowerCase()
      );
      const state = states.find(
        (st) => st.name?.toLowerCase() === l.state_name?.toLowerCase()
      );
      const district = districts.find(
        (dt) => dt.name?.toLowerCase() === l.district_name?.toLowerCase()
      );

      return {
        id: j.id,
        customer: {
          first_name,
          last_name,
          mobile: c.customer_mobile,
          email: c.customer_email || "",
          customer_type: c.customer_type,
          company_name: c.company_name || "",
          lead_source: "",
        },
        location: {
          location_type: l.location_type,
          address_line_1: l.address_line_1,
          address_line_2: l.address_line_2 || "",
          city: l.city,
          district_id: district?.id || 0,
          state_id: state?.id || 0,
          country_id: country?.id || 0,
          pincode: l.pincode,
          landmark: l.landmark || "",
          is_primary: true,
        },
        service_type: j.service_type,
        solar_service: j.solar_service,
        package_id: p.package_id,
        job_priority: j.job_priority,
        scheduled_date: j.scheduled_date.split("T")[0],
        job_description: j.job_description,
        special_instructions: j.special_instructions || "",
        status: j.status,
        created_at: j.created_at,
        capacity: p.package_capacity || j.capacity || "-",
        estimated_cost: Number(j.estimated_cost || p.package_price || 0),
        package_name: p.package_name || "Unknown",
      };
    });

    setJobs(mappedJobs);
    setTotalJobs(payload.pagination.total_items); // <-- Updated field
    setCurrentPage(payload.pagination.current_page); // Optional: sync UI
  } catch (error) {
    console.error(error);
    toast.error("Failed to load jobs");
    setJobs([]);
    setTotalJobs(0);
  } finally {
    setIsLoading(false);
  }
};

  // -------------------------------------------------
  // Stats
  // -------------------------------------------------
  const getstats = async () => {
    try {
      const resp = await apiGet("/jobs/counts");
      if (resp.data.success) {
        setStats(resp.data.data.overall_statistics);
      }
    } catch {}
  };

  // -------------------------------------------------
  // Initial loads
  // -------------------------------------------------
  useEffect(() => {
    loadPackages();
    fetchEmployees();
    getstats();
  }, []);

  useEffect(() => {
    if (countries.length && states.length && districts.length) {
      fetchJobs(1);
      setCurrentPage(1);
    }
  }, [countries, states, districts]);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  // -------------------------------------------------
  // Validation
  // -------------------------------------------------
  const validateField = (field: string, value: any) => {
    const errors: Record<string, string> = {};
    switch (field) {
      case "first_name":
        if (!value) errors.first_name = "First name is required";
        else if (!/^[A-Za-z\s]+$/.test(value))
          errors.first_name = "Only alphabets and spaces";
        else if (value.trim().length < 2)
          errors.first_name = "Min 2 characters";
        break;
      case "last_name":
        if (!value) errors.last_name = "Last name is required";
        else if (!/^[A-Za-z]+$/.test(value))
          errors.last_name = "Only alphabets";
        break;
      case "mobile":
        if (!value) errors.mobile = "Mobile is required";
        else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, "")))
          errors.mobile = "10 digits only";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errors.email = "Invalid email format";
        break;
      case "address_line_1":
        if (!value) errors.address_line_1 = "Address is required";
        else if (value.length < 5) errors.address_line_1 = "Min 5 characters";
        break;
      case "city":
        if (!value) errors.city = "City is required";
        break;
      case "pincode":
        if (!value) errors.pincode = "Pincode is required";
        else if (!/^[0-9]{6}$/.test(value)) errors.pincode = "6 digits only";
        break;
      case "scheduled_date":
        if (!value) errors.scheduled_date = "Date is required";
        else if (new Date(value) < new Date(new Date().setHours(0, 0, 0, 0)))
          errors.scheduled_date = "Cannot be in the past";
        break;
      case "job_description":
        if (!value) errors.job_description = "Description is required";
        break;
    }
    return errors;
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    const updated = { ...formData };
    if (section === "customer")
      updated.customer = { ...updated.customer, [field]: value };
    else if (section === "location")
      updated.location = { ...updated.location, [field]: value };
    else (updated as any)[field] = value;

    setFormData(updated);

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    const fieldErrors = validateField(field, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    ["first_name", "last_name", "mobile"].forEach((f) =>
      Object.assign(errors, validateField(f, (formData.customer as any)[f]))
    );
    if (formData.customer.email)
      Object.assign(errors, validateField("email", formData.customer.email));
    ["address_line_1", "city", "pincode"].forEach((f) =>
      Object.assign(errors, validateField(f, (formData.location as any)[f]))
    );

    if (!formData.location.country_id) errors.country_id = "Country is required";
    if (!formData.location.state_id) errors.state_id = "State is required";
    if (!formData.location.district_id) errors.district_id = "District is required";
    if (!formData.package_id) errors.package_id = "Package is required";
    if (!formData.scheduled_date) errors.scheduled_date = "Scheduled date is required";
    if (!formData.job_description) errors.job_description = "Description is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------
  // Create Job
  // -------------------------------------------------
  const handleSubmit = async () => {
    if (!validateForm()) return toast.error("Please fix the errors");

    setIsSubmitting(true);
    try {
      const payload = JSON.stringify(formData);
      const response = await apiPost("/jobs/create", payload);
      if (response?.data?.success) {
        toast.success("Job created");
        await fetchJobs(currentPage);
        closeDialog();
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to save job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFormData(initialForm);
    setValidationErrors({});
  };

  // -------------------------------------------------
  // Assign Job
  // -------------------------------------------------
  const openAssignModal = (jobId: number) => {
    setSelectedJobId(jobId);
    setSelectedEmployeeId("");
    setAssignDialogOpen(true);
  };

  const closeAssignModal = () => {
    setAssignDialogOpen(false);
    setSelectedJobId(null);
    setSelectedEmployeeId("");
  };

  const handleAssignSubmit = async () => {
    if (!selectedJobId || !selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        job_id: selectedJobId,
        employee_id: Number(selectedEmployeeId),
      };
      const response = await apiPost("/jobs/assignment/create", JSON.stringify(payload));
      if (response?.data.success) {
        toast.success("Job assigned successfully");
        await fetchJobs(currentPage);
        closeAssignModal();
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to assign job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------
  // Helpers
  // -------------------------------------------------
  const getSelectedPackageLabel = () => {
    if (!formData.package_id) return "Select Package";
    const pkg = packages.find((p) => p.id === formData.package_id);
    return pkg
      ? `${pkg.name} - ${pkg.capacity} (₹${pkg.cost.toLocaleString("en-IN")})`
      : "Select Package";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-700",
      Created: "bg-yellow-100 text-yellow-700",
      Assigned: "bg-blue-100 text-blue-700",
      "In Progress": "bg-purple-100 text-purple-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return <Badge className={colors[status] || "bg-gray-100"}>{status}</Badge>;
  };

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header + Add Job Dialog */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage solar installation and service jobs</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[85vw] sm:max-w-[85vw] md:w-[75vw] md:max-w-[75vw] lg:w-[70vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader className="pb-6">
              <DialogTitle className="text-xl mb-3">Create New Job</DialogTitle>
              <DialogDescription className="text-base">
                Enter complete job information including customer and location
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-6">
              {/* Customer Section */}
              <div className="space-y-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-4">Customer Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      First Name <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter first name "
                      value={formData.customer.first_name}
                      onChange={(e) =>
                        handleFieldChange("customer", "first_name", e.target.value)
                      }
                      className={validationErrors.first_name ? "border-red-500" : ""}
                    />
                    {validationErrors.first_name && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.first_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Last Name <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter last name (e.g., Kumar)"
                      value={formData.customer.last_name}
                      onChange={(e) =>
                        handleFieldChange("customer", "last_name", e.target.value)
                      }
                      className={validationErrors.last_name ? "border-red-500" : ""}
                    />
                    {validationErrors.last_name && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.last_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Mobile <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter 10-digit mobile number"
                      value={formData.customer.mobile}
                      onChange={(e) =>
                        handleFieldChange("customer", "mobile", e.target.value)
                      }
                      className={validationErrors.mobile ? "border-red-500" : ""}
                    />
                    {validationErrors.mobile && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.mobile}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email (Optional)</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.customer.email}
                      onChange={(e) =>
                        handleFieldChange("customer", "email", e.target.value)
                      }
                      className={validationErrors.email ? "border-red-500" : ""}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Customer Type <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Select
                      value={formData.customer.customer_type}
                      onValueChange={(v) =>
                        handleFieldChange("customer", "customer_type", v as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.customer.customer_type !== "Individual" && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Company Name</Label>
                      <Input
                        placeholder="Enter company name (e.g., ABC Solar Pvt Ltd)"
                        value={formData.customer.company_name}
                        onChange={(e) =>
                          handleFieldChange("customer", "company_name", e.target.value)
                        }
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Lead Source</Label>
                    <Input
                      placeholder="Enter lead source"
                      value={formData.customer.lead_source}
                      onChange={(e) =>
                        handleFieldChange("customer", "lead_source", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-4">Location Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Location Type</Label>
                    <Select
                      value={formData.location.location_type}
                      onValueChange={(v) =>
                        handleFieldChange("location", "location_type", v as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Installation">Installation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Address Line 1 <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter complete address"
                      value={formData.location.address_line_1}
                      onChange={(e) =>
                        handleFieldChange("location", "address_line_1", e.target.value)
                      }
                      className={validationErrors.address_line_1 ? "border-red-500" : ""}
                    />
                    {validationErrors.address_line_1 && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.address_line_1}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Address Line 2</Label>
                    <Input
                      placeholder="Enter additional address details"
                      value={formData.location.address_line_2}
                      onChange={(e) =>
                        handleFieldChange("location", "address_line_2", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      City <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter city name (e.g., Mumbai)"
                      value={formData.location.city}
                      onChange={(e) =>
                        handleFieldChange("location", "city", e.target.value)
                      }
                      className={validationErrors.city ? "border-red-500" : ""}
                    />
                    {validationErrors.city && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Country <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Select
                      value={formData.location.country_id.toString()}
                      onValueChange={(v) =>
                        handleFieldChange("location", "country_id", parseInt(v))
                      }
                    >
                      <SelectTrigger className={validationErrors.country_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Choose country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.country_id && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.country_id}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      State <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Select
                      value={formData.location.state_id.toString()}
                      disabled={!formData.location.country_id}
                      onValueChange={(v) =>
                        handleFieldChange("location", "state_id", parseInt(v))
                      }
                    >
                      <SelectTrigger className={validationErrors.state_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Choose state" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStates.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.state_id && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.state_id}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      District <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Select
                      value={formData.location.district_id.toString()}
                      disabled={!formData.location.state_id}
                      onValueChange={(v) =>
                        handleFieldChange("location", "district_id", parseInt(v))
                      }
                    >
                      <SelectTrigger className={validationErrors.district_id ? "border-red-500" : ""}>
                        <SelectValue placeholder="Choose district" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDistricts.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.district_id && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.district_id}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Pincode <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      placeholder="Enter 6-digit pincode"
                      value={formData.location.pincode}
                      onChange={(e) =>
                        handleFieldChange("location", "pincode", e.target.value)
                      }
                      className={validationErrors.pincode ? "border-red-500" : ""}
                    />
                    {validationErrors.pincode && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.pincode}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Landmark</Label>
                    <Input
                      placeholder="Enter nearby landmark"
                      value={formData.location.landmark}
                      onChange={(e) =>
                        handleFieldChange("location", "landmark", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-4">Job Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Service Type</Label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(v) => handleFieldChange("", "service_type", v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Installation">Installation</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Solar Service</Label>
                    <Select
                      value={formData.solar_service}
                      onValueChange={(v) => handleFieldChange("", "solar_service", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose solar service category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential Solar">Residential Solar</SelectItem>
                        <SelectItem value="Commercial Solar">Commercial Solar</SelectItem>
                        <SelectItem value="Industrial Solar">Industrial Solar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Package <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Select
                      value={formData.package_id ? String(formData.package_id) : undefined}
                      onValueChange={(v) => handleFieldChange("", "package_id", Number(v))}
                    >
                      <SelectTrigger className={validationErrors.package_id ? "border-red-500" : ""}>
                        <SelectValue>{getSelectedPackageLabel()}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {packages.length === 0 ? (
                          <SelectItem value="0" disabled>Loading packages...</SelectItem>
                        ) : (
                          packages.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} - {p.capacity} (₹{p.cost.toLocaleString("en-IN")})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {validationErrors.package_id && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.package_id}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select
                      value={formData.job_priority}
                      onValueChange={(v) => handleFieldChange("", "job_priority", v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Scheduled Date <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.scheduled_date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => handleFieldChange("", "scheduled_date", e.target.value)}
                      className={validationErrors.scheduled_date ? "border-red-500" : ""}
                    />
                    {validationErrors.scheduled_date && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.scheduled_date}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2 space-y-2">
                    <Label className="text-sm font-medium">
                      Description <span className="text-red-600 font-bold">*</span>
                    </Label>
                    <Textarea
                      placeholder="Enter detailed job description"
                      value={formData.job_description}
                      rows={3}
                      onChange={(e) => handleFieldChange("", "job_description", e.target.value)}
                      className={validationErrors.job_description ? "border-red-500" : ""}
                    />
                    {validationErrors.job_description && (
                      <p className="text-red-600 font-medium text-xs mt-1">{validationErrors.job_description}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2 space-y-2">
                    <Label className="text-sm font-medium">Special Instructions</Label>
                    <Textarea
                      placeholder="Enter any special instructions or preferences"
                      value={formData.special_instructions}
                      rows={2}
                      onChange={(e) => handleFieldChange("", "special_instructions", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-8 border-t border-gray-200">
                <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                >
                  {isSubmitting ? "Saving..." : "Create Job"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assign Employee Modal */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[80vw] sm:max-w-[80vw] md:w-[60vw] md:max-w-[60vw] lg:w-[45vw] lg:max-w-[45vw] max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Assign Job to Employee</DialogTitle>
            <DialogDescription>
              Select an employee to assign this job (ID: {selectedJobId})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>
                Select Employee <span className="text-red-600 font-bold">*</span>
              </Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length === 0 ? (
                    <SelectItem value="0" disabled>Loading employees...</SelectItem>
                  ) : (
                    employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.first_name} {emp.last_name} ({emp.user_id}) - {emp.mobile} -{" "}
                        {emp.roles.map((r) => r.role_name).join(", ")}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={closeAssignModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              disabled={isSubmitting || !selectedEmployeeId}
            >
              {isSubmitting ? "Assigning..." : "Assign Job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600">Total Jobs</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.total_jobs || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600">Active Jobs</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats?.active_jobs || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600">Closed Jobs</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats?.closed_jobs || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : (
            <>
              {/* Mobile Card List View */}
              <div className="block md:hidden">
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 px-4">
                    No jobs found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <div key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
                        {/* Job Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">#{job.id}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900">
                                {job.customer.first_name} {job.customer.last_name}
                              </p>
                              <p className="text-xs text-gray-500">{job.customer.mobile}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {getStatusBadge(job.status)}
                            <Badge
                              variant={
                                job.job_priority === "High"
                                  ? "destructive"
                                  : job.job_priority === "Medium"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {job.job_priority}
                            </Badge>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                              <p className="text-sm font-medium text-gray-900">{job.solar_service}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Cost</p>
                              <p className="text-sm font-bold text-green-600">
                                ₹{job.estimated_cost?.toLocaleString("en-IN") || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                              <p className="text-sm text-gray-900">{job.location.city}, {job.location.pincode}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                              <p className="text-sm text-gray-900">
                                {new Date(job.scheduled_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Package</p>
                              <p className="text-sm text-gray-900">{job.package_name || '-'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
                              <p className="text-sm text-gray-900">{job.capacity || '-'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {job.status === "Created" && (
                          <div className="pt-3 border-t border-gray-100">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAssignModal(job.id)}
                              className="w-full text-xs h-8"
                            >
                              <UserCheck className="h-3 w-3 mr-2" />
                              Assign to Employee
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>{job.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {job.customer.first_name} {job.customer.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{job.customer.mobile}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {job.location.city}, {job.location.pincode}
                          </p>
                        </TableCell>
                        <TableCell>{job.solar_service}</TableCell>
                        <TableCell>{job.package_name || "-"}</TableCell>
                        <TableCell>{job.capacity || "-"}</TableCell>
                        <TableCell>
                          ₹{job.estimated_cost?.toLocaleString("en-IN") || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(job.scheduled_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              job.job_priority === "High"
                                ? "destructive"
                                : job.job_priority === "Medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {job.job_priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          {job.status === "Created" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openAssignModal(job.id)}
                                title="Assign to Employee"
                              >
                                <UserCheck className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>

             {/* PAGINATION */}
{totalJobs > jobsPerPage && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 sm:px-0">
    <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
      Showing {(currentPage - 1) * jobsPerPage + 1} to{" "}
      {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs}
    </p>

    <div className="flex gap-1 flex-wrap justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {(() => {
        const totalPages = Math.ceil(totalJobs / jobsPerPage);
        const pages: number[] = [];
        const delta = 2;
        const left = Math.max(1, currentPage - delta);
        const right = Math.min(totalPages, currentPage + delta);

        for (let i = left; i <= right; i++) pages.push(i);
        if (left > 1) pages.unshift(1);
        if (right < totalPages) pages.push(totalPages);

        return pages.map((p, idx) => (
          <React.Fragment key={p}>
            {idx > 0 && pages[idx - 1] !== p - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <Button
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </Button>
          </React.Fragment>
        ));
      })()}

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setCurrentPage((p) => Math.min(Math.ceil(totalJobs / jobsPerPage), p + 1))
        }
        disabled={currentPage === Math.ceil(totalJobs / jobsPerPage)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)}


            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}