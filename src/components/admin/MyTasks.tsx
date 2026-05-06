"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  Search,
  Filter,
  MoreVertical,
  Plus,
  UserCheck,
  Eye,
  RefreshCw,
  MessageSquare,
  Edit2,
  Users,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { apiGet, apiPut, apiPost } from "../../api/commonApi";
import { updateLeadStatus, updateJobStatus, assignJobToEmployee } from "../../api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

type Lead = {
  id: number;
  customer_name: string;
  mobile: string;
  email?: string;
  solar_service: string;
  lead_status: string;
  capacity?: string;
  location: string;
  property_type?: string;
  channel: string;
  assigned_at: string;
};

type JobCreateForm = {
  customer: {
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    customer_type: "Individual" | "Business" | "Corporate";
    company_name: string;
    lead_source: string;
  };
  location: {
    location_type: "Home" | "Office" | "Billing" | "Installation" | "Other";
    address_line_1: string;
    address_line_2: string;
    city: string;
    district_id: number;
    state_id: number;
    country_id: number;
    pincode: string;
    landmark: string;
    is_primary: boolean;
  };
  service_type: "Installation" | "Maintenance" | "Repair";
  solar_service: string;
  package_id: number;
  job_priority: "Low" | "Medium" | "High";
  scheduled_date: string;
  job_description: string;
  special_instructions: string;
};

type Job = {
  id: number;
  job_code: string;
  customer: {
    first_name: string;
    last_name: string;
    mobile: string;
    email?: string;
    customer_type?: "Individual" | "Business" | "Corporate";
    company_name?: string;
  };
  location: {
    city: string;
    pincode: string;
    location_type?: string;
    address_line_1?: string;
    address_line_2?: string;
    state_id?: number;
    country_id?: number;
    district_id?: number;
  };
  solar_service: string;
  package_name: string;
  package_capacity?: string;
  estimated_cost: number;
  scheduled_date: string;
  job_priority: "Low" | "Medium" | "High";
  status: "Pending" | "Assigned" | "In Progress" | "On Hold" | "Completed" | "Cancelled" | "Created";
  service_type?: string;
  job_description?: string;
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

type TaskSummary = {
  leads: { assigned: number; ongoing: number; closed: number; total: number };
  jobs: { assigned: number; ongoing: number; closed: number; total: number };
};

type Pagination = {
  current_page: number;
  total_pages: number;
  total_records: number;
  records_per_page: number;
  has_next: boolean;
  has_previous: boolean;
};

type LeadsResponse = { leads: any[]; pagination: Pagination };
type JobsResponse = { jobs: any[]; pagination: Pagination };

const STATUS_OPTIONS = [
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
] as const;
const PAYMENT_METHODS = [
  "Bank Transfer",
  "UPI",
  "Cash",
  "Cheque",
  "Card",
] as const;

export function MyTasks() {
  const location = useLocation();
  const user = useSelector((state: any) => state.currentUserData);

  // Check if user has 'leads' or 'enquiries' permission — only then show the Leads tab
  const canViewLeads = useMemo(() => {
    if (!user) return true; // fallback: allow if user not loaded yet
    const perms: string[] = (user.permissions || []).map((p: any) => {
      if (typeof p === 'string') return p.toLowerCase();
      if (p?.feature_name) return p.feature_name.toLowerCase();
      if (p?.name) return p.name.toLowerCase();
      return '';
    }).filter(Boolean);
    // If no permissions defined, allow by default (full-access user)
    if (perms.length === 0) return true;
    return perms.some(p => p === 'leads' || p === 'enquiries');
  }, [user]);

  // Initialize activeTab from localStorage or navigation state
  const [activeTab, setActiveTab] = useState<"leads" | "jobs" | "jobs_done">(() => {
    const saved = localStorage.getItem('myTasksActiveTab');
    if (saved === 'leads' || saved === 'jobs' || saved === 'jobs_done') {
      return saved;
    }
    return 'jobs';
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsRawData, setJobsRawData] = useState<any[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle tab from navigation state (takes priority over localStorage)
  useEffect(() => {
    if (location.state?.tab === 'leads' || location.state?.tab === 'jobs') {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  // Effect to persist activeTab to localStorage
  useEffect(() => {
    localStorage.setItem('myTasksActiveTab', activeTab);
  }, [activeTab]);

  // Filters
  const [leadFilters, setLeadFilters] = useState({
    search: "",
    status: "all",
    solar_service: "all",
    channel: "all",
    start_date: null as Date | null,
    end_date: null as Date | null,
  });
  const [jobFilters, setJobFilters] = useState({
    search: "",
    status: "all",
    start_date: null as Date | null,
    end_date: null as Date | null,
  });

  // Pagination
  const [leadPage, setLeadPage] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [leadPagination, setLeadPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    records_per_page: 10,
    has_next: false,
    has_previous: false,
  });
  const [jobPagination, setJobPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    records_per_page: 10,
    has_next: false,
    has_previous: false,
  });

  // Cache all leads for client-side pagination
  const allLeadsRef = React.useRef<Lead[]>([]);

  // Action Modal
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"lead" | "job">("job");
  const [actionId, setActionId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [actionAttachments, setActionAttachments] = useState<File[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Job Creation States
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Reference Data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  // Job Creation Form
  const initialJobForm: JobCreateForm = {
    customer: {
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      customer_type: "Individual",
      company_name: "",
      lead_source: "",
    },
    location: {
      location_type: "Installation",
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
    service_type: "Installation",
    solar_service: "Residential Solar",
    package_id: 0,
    job_priority: "Medium",
    scheduled_date: "",
    job_description: "",
    special_instructions: "",
  };
  const [jobFormData, setJobFormData] = useState<JobCreateForm>(initialJobForm);
  const [jobValidationErrors, setJobValidationErrors] = useState<Record<string, string>>({});

  // Job Completion Fields (for MyTasks status updates)
  const [completionData, setCompletionData] = useState({
    status_reason: "",
    amount: 0,
    discount_amount: "",
    payment_method: "",
    transaction_id: "",
  });

  // Job Status Update States
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<Job | null>(null);
  const [jobStatusForm, setJobStatusForm] = useState({
    new_status: "",
    status_reason: "",
    comments: "",
  });
  const [jobStatusAttachments, setJobStatusAttachments] = useState<File[]>([]);
  const [isUpdatingJobStatus, setIsUpdatingJobStatus] = useState(false);

  // Job Details View States
  const [viewJobDetailsDialogOpen, setViewJobDetailsDialogOpen] = useState(false);
  const [selectedJobForView, setSelectedJobForView] = useState<any>(null);

  // Attachment Viewer States
  const [attachmentViewerOpen, setAttachmentViewerOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  // Job Assignment States
  const [assignJobDialogOpen, setAssignJobDialogOpen] = useState(false);
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<any>(null);
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [selectedJobEmployee, setSelectedJobEmployee] = useState("");
  const [assigningJob, setAssigningJob] = useState(false);

  // Leads/Enquiries Management States
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [viewLeadDialogOpen, setViewLeadDialogOpen] = useState(false);
  const [selectedLeadRole, setSelectedLeadRole] = useState("");
  const [selectedLeadEmployee, setSelectedLeadEmployee] = useState("");
  const [assigningLead, setAssigningLead] = useState(false);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [createEmployeeDialogOpen, setCreateEmployeeDialogOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeMobile, setNewEmployeeMobile] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("Sales Person");
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);

  // Current Job for prefill
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  // -------------------------------------------------
  // Reference Data Loading
  // -------------------------------------------------
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [countryRes, stateRes, districtRes] = await Promise.all([
          apiGet("/countries/allCountries"),
          apiGet("/states/allStates"),
          apiGet("/districts/allDistricts"),
        ]);

        const countryData = countryRes?.data?.data || [];
        const stateData = stateRes?.data?.data || [];
        const districtData = districtRes?.data?.data || [];

        setCountries(
          countryData.map((c: any) => ({
            id: c.id,
            name: c.alias_name || c.name,
          }))
        );
        setStates(
          stateData.map((s: any) => ({
            id: s.id,
            name: s.alias_name || s.name,
            country_id: s.country_id,
          }))
        );
        setDistricts(
          districtData.map((d: any) => ({
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

  // Filter States when country changes
  useEffect(() => {
    if (jobFormData.location.country_id) {
      const filtered = states.filter((s) => s.country_id === jobFormData.location.country_id);
      setFilteredStates(filtered);
      setJobFormData((prev) => ({
        ...prev,
        location: { ...prev.location, state_id: 0, district_id: 0 },
      }));
      setFilteredDistricts([]);
    } else {
      setFilteredStates([]);
      setFilteredDistricts([]);
    }
  }, [jobFormData.location.country_id, states]);

  // Filter Districts when state changes
  useEffect(() => {
    if (jobFormData.location.state_id) {
      const filtered = districts.filter((d) => d.state_id === jobFormData.location.state_id);
      setFilteredDistricts(filtered);
      setJobFormData((prev) => ({
        ...prev,
        location: { ...prev.location, district_id: 0 },
      }));
    } else {
      setFilteredDistricts([]);
    }
  }, [jobFormData.location.state_id, districts]);

  // -------------------------------------------------
  // Load Packages
  // -------------------------------------------------
  const loadPackages = useCallback(async () => {
    try {
      let result: any = null;
      
      // Try primary endpoint
      try {
        result = await apiGet("/packages");
      } catch (e) {
        // If primary endpoint fails, try alternative endpoint
        console.warn("Primary /packages endpoint failed, trying /solar-packages");
        try {
          result = await apiGet("/solar-packages");
        } catch (e2) {
          console.warn("Alternative /solar-packages endpoint also failed");
        }
      }

      let packageData: any[] = [];

      if (result) {
        // Try different response structures
        if (result?.data?.success && Array.isArray(result?.data?.data)) {
          packageData = result.data.data;
        } else if (Array.isArray(result?.data?.data)) {
          packageData = result.data.data;
        } else if (Array.isArray(result?.data)) {
          packageData = result.data;
        } else if (result?.data?.packages && Array.isArray(result.data.packages)) {
          packageData = result.data.packages;
        }
      }

      if (packageData.length > 0) {
        const pkgs = packageData.map((p: any) => ({
          id: Number(p.id || p.package_id),
          name: p.name || p.package_name || "Unnamed",
          capacity: p.capacity || p.package_capacity || "",
          cost: Number(p.cost || p.price || p.package_price || 0),
        }));
        setPackages(pkgs);
        console.log(`Loaded ${pkgs.length} packages successfully`);
      } else {
        setPackages([]);
        console.warn("No packages found in response");
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Failed to load packages");
      setPackages([]);
    }
  },[]);

  // -------------------------------------------------
  // Fetch Employees
  // -------------------------------------------------
  const fetchEmployees = useCallback(async () => {
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
      }
    } catch {
      toast.error("Failed to load employees");
    }
  }, []);

  // -------------------------------------------------
  // Job Validation
  // -------------------------------------------------
  const validateJobField = (field: string, value: any) => {
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

  const handleJobFieldChange = (section: string, field: string, value: any) => {
    const updated = { ...jobFormData };
    if (section === "customer")
      updated.customer = { ...updated.customer, [field]: value };
    else if (section === "location")
      updated.location = { ...updated.location, [field]: value };
    else (updated as any)[field] = value;

    setJobFormData(updated);

    setJobValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    const fieldErrors = validateJobField(field, value);
    if (Object.keys(fieldErrors).length > 0) {
      setJobValidationErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  const validateJobForm = () => {
    const errors: Record<string, string> = {};
    ["first_name", "last_name", "mobile"].forEach((f) =>
      Object.assign(errors, validateJobField(f, (jobFormData.customer as any)[f]))
    );
    if (jobFormData.customer.email)
      Object.assign(errors, validateJobField("email", jobFormData.customer.email));
    ["address_line_1", "city", "pincode"].forEach((f) =>
      Object.assign(errors, validateJobField(f, (jobFormData.location as any)[f]))
    );

    if (!jobFormData.location.country_id) errors.country_id = "Country is required";
    if (!jobFormData.location.state_id) errors.state_id = "State is required";
    if (!jobFormData.location.district_id) errors.district_id = "District is required";
    if (!jobFormData.package_id) errors.package_id = "Package is required";
    if (!jobFormData.scheduled_date) errors.scheduled_date = "Scheduled date is required";
    if (!jobFormData.job_description) errors.job_description = "Description is required";

    setJobValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------
  // Create Job
  // -------------------------------------------------
  const handleJobSubmit = async () => {
    if (!validateJobForm()) return toast.error("Please fix the errors");

    setIsSubmitting(true);
    try {
      const payload = JSON.stringify(jobFormData);
      const response = await apiPost("/jobs/create", payload);
      if (response?.data?.success) {
        toast.success("Job created successfully");
        closeJobDialog();
        // Refresh jobs list and overview
        await Promise.all([fetchMyJobs(1), fetchOverview()]);
      } else {
        toast.error(response?.data?.message || "Failed to create job");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to save job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeJobDialog = () => {
    setAddJobDialogOpen(false);
    setJobFormData(initialJobForm);
    setJobValidationErrors({});
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
      if (response?.data?.success) {
        toast.success("Job assigned successfully");
        closeAssignModal();
        // Refresh jobs list and overview
        await Promise.all([fetchMyJobs(1), fetchOverview()]);
      } else {
        toast.error(response?.data?.message || "Failed to assign job");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to assign job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------
  // Helper Functions
  // -------------------------------------------------
  const getSelectedPackageLabel = () => {
    if (!jobFormData.package_id) return "Select Package";
    const pkg = packages.find((p) => p.id === jobFormData.package_id);
    return pkg
      ? `${pkg.name} - ${pkg.capacity} (₹${pkg.cost.toLocaleString("en-IN")})`
      : "Select Package";
  };

  // Fetch Overview
  const fetchOverview = async () => {
    try {
      const response = await apiGet("/mytasks/overview");
      if (response?.data?.success && response.data?.data?.summary) {
        const sum = response.data.data.summary;
        setSummary({
          leads: {
            assigned: sum.leads.assigned,
            ongoing: sum.leads.ongoing,
            closed: sum.leads.closed,
            total: sum.leads.total,
          },
          jobs: {
            assigned: Number(sum.jobs.assigned),
            ongoing: Number(sum.jobs.ongoing),
            closed: Number(sum.jobs.closed),
            total: sum.jobs.total,
          },
        });
      }
    } catch (error) {
      toast.error("Failed to load summary");
    }
  };

  // Fetch Leads — uses same /leads API as the main Leads (EnquiriesPage)
  const fetchMyLeads = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        // Only re-fetch from API when on page 1 (i.e. fresh load or filter change)
        // For page changes, use cached allLeadsRef
        if (page === 1 || allLeadsRef.current.length === 0) {
          const response = await apiGet(`/leads`);
          if (response?.data?.success) {
            const raw: any[] = Array.isArray(response.data.data)
              ? response.data.data
              : [];

            const mapped: Lead[] = raw.map((l: any) => ({
              id: l.id || l.lead_id,
              customer_name:
                l.full_name ||
                l.fullName ||
                l.name ||
                l.customer_name ||
                `${l.first_name || l.firstName || ''} ${l.last_name || l.lastName || ''}`.trim() ||
                "Unknown",
              mobile: l.mobile || l.phone || l.contact || "",
              email: l.email || "",
              service_type: l.service_type || "",
              solar_service:
                l.solar_service ||
                l.serviceType ||
                l.type ||
                "",
              lead_status: l.status || l.lead_status || "New",
              capacity: l.capacity || l.kv || l.system_size || "",
              location: l.location || l.city || "",
              property_type: l.property_type || l.home_type || "",
              channel: l.channel || l.lead_source || "",
              assigned_at: l.created_at || l.createdAt || l.updated_at || "",
              assigned_to_name: l.assigned_to_name || null,
              assigned_to_mobile: l.assigned_to_mobile || null,
            }));

            allLeadsRef.current = mapped;
          } else {
            allLeadsRef.current = [];
          }
        }

        // Client-side filter
        let filtered = allLeadsRef.current;
        if (leadFilters.search) {
          const s = leadFilters.search.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.customer_name.toLowerCase().includes(s) ||
              l.mobile.includes(s) ||
              String(l.id).includes(s)
          );
        }
        if (leadFilters.status !== "all") {
          filtered = filtered.filter(
            (l) => l.lead_status.toLowerCase() === leadFilters.status.toLowerCase()
          );
        }
        if (leadFilters.solar_service !== "all") {
          filtered = filtered.filter(
            (l) => l.solar_service.toLowerCase() === leadFilters.solar_service.toLowerCase()
          );
        }
        if (leadFilters.channel !== "all") {
          filtered = filtered.filter(
            (l) => l.channel.toLowerCase() === leadFilters.channel.toLowerCase()
          );
        }
        if (leadFilters.start_date) {
          filtered = filtered.filter(
            (l) =>
              l.assigned_at &&
              new Date(l.assigned_at) >= leadFilters.start_date!
          );
        }
        if (leadFilters.end_date) {
          filtered = filtered.filter(
            (l) =>
              l.assigned_at &&
              new Date(l.assigned_at) <= leadFilters.end_date!
          );
        }

        // Client-side pagination
        const perPage = 10;
        const total = filtered.length;
        const totalPages = Math.ceil(total / perPage) || 1;
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * perPage;
        const paginated = filtered.slice(start, start + perPage);

        setLeads(paginated);
        setLeadPagination({
          current_page: safePage,
          total_pages: totalPages,
          total_records: total,
          records_per_page: perPage,
          has_next: safePage < totalPages,
          has_previous: safePage > 1,
        });
        setLeadPage(safePage);
      } catch (error) {
        toast.error("Failed to load leads");
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    },
    [leadFilters]
  );

  // Fetch Jobs
  const fetchMyJobs = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(jobFilters.search && { search: jobFilters.search }),
          ...(jobFilters.status !== "all" && { status: jobFilters.status }),
          ...(jobFilters.start_date && {
            start_date: format(jobFilters.start_date, "yyyy-MM-dd"),
          }),
          ...(jobFilters.end_date && {
            end_date: format(jobFilters.end_date, "yyyy-MM-dd"),
          }),
        });

        const response = await apiGet(`/jobs/allJobs`);
        if (response?.data?.success) {
          const jobsData: any[] = Array.isArray(response.data.data) ? response.data.data : [];
          
          const mapped = jobsData.map((item: any) => {
            const j = item.job_info || {};
            const c = item.customer_info || {};
            const l = item.location_info || {};
            const p = item.package_info || {};
            
            const [first_name = "", last_name = ""] = (c.customer_name || "")
              .trim()
              .split(" ");
            
            return {
              id: j.id,
              job_code: j.job_code,
              customer: {
                first_name,
                last_name: last_name || (c.company_name ? "" : "User"),
                mobile: c.customer_mobile,
              },
              location: { 
                city: l.city || l.address_line_1 || "-", 
                pincode: l.pincode || "-"
              },
              solar_service: j.solar_service,
              package_name: p.package_name || "-",
              package_capacity: j.capacity || p.package_capacity || "-",
              estimated_cost: Number(p.package_price || j.estimated_cost || 0),
              scheduled_date: j.scheduled_date ? j.scheduled_date.split("T")[0] : "",
              job_priority: j.job_priority,
              status: j.status,
            };
          });
          
          setJobs(mapped);
          setJobsRawData(jobsData);
          setJobPagination({
            current_page: response.data.pagination?.current_page || 1,
            total_pages: response.data.pagination?.total_pages || 1,
            total_records: response.data.pagination?.total_items || 0,
            records_per_page: response.data.pagination?.per_page || 10,
            has_next: response.data.pagination?.has_next || false,
            has_previous: response.data.pagination?.has_previous || false,
          });
          setJobPage(response.data.pagination?.current_page || 1);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    },
    [jobFilters]
  );

  // Update Status
  const updateStatus = async () => {
    if (!actionId || !newStatus || !comment.trim()) {
      toast.error("Please select status and add a comment");
      return;
    }

    if (actionType === "job" && newStatus === "Completed") {
      if (!completionData.status_reason.trim()) {
        toast.error("Status reason is required for completion");
        return;
      }
      if (!completionData.payment_method) {
        toast.error("Payment method is required");
        return;
      }
      if (!completionData.transaction_id.trim()) {
        toast.error("Transaction ID is required");
        return;
      }
    }

    setActionLoading(true);
    try {
      if (actionType === "lead") {
        // Use the dedicated API endpoint for updating lead status (PATCH /api/leads/:id/status)
        const result = await updateLeadStatus(actionId as number, newStatus);
        if (result.ok) {
          toast.success(`Lead status updated to ${newStatus}`);
          setActionOpen(false);
          resetModal();
          fetchMyLeads(leadPage);
          fetchOverview();
        } else {
          toast.error(result.error || "Failed to update lead status");
        }
      } else {
        // Jobs use the updateJobStatus function with FormData
        let statusReason = comment.trim();

        // For Completed status, use the explicit status_reason field
        if (actionType === "job" && newStatus === "Completed") {
          statusReason = completionData.status_reason.trim() || comment.trim();
        }

        const result = await updateJobStatus(
          actionId as number,
          newStatus,
          statusReason,
          comment.trim() || undefined,
          actionAttachments.length > 0 ? actionAttachments : undefined
        );

        if (result.ok) {
          toast.success(`Job status updated to ${newStatus}`);
          setActionOpen(false);
          resetModal();
          fetchMyJobs(jobPage);
          fetchOverview();
        } else {
          toast.error(result.error || "Failed to update status");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Modal
  const resetModal = () => {
    setNewStatus("");
    setComment("");
    setActionAttachments([]);
    setCompletionData({
      status_reason: "",
      amount: 0,
      discount_amount: "",
      payment_method: "",
      transaction_id: "",
    });
    setCurrentJob(null);
  };

  // Open Action Modal
  const openActionModal = (
    type: "lead" | "job",
    id: number,
    currentStatus: string
  ) => {
    setActionType(type);
    setActionId(id);
    resetModal();

    if (type === "job") {
      const job = jobs.find((j) => j.id === id);
      if (job) {
        setCurrentJob(job);
        setCompletionData((prev) => ({ ...prev, amount: job.estimated_cost }));
      }
    }

    setActionOpen(true);
  };

  // Handle Update Job Status
  const handleUpdateJobStatus = async () => {
    if (!selectedJobForEdit || !jobStatusForm.new_status || !jobStatusForm.status_reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUpdatingJobStatus(true);
    try {
      const result = await updateJobStatus(
        selectedJobForEdit.id,
        jobStatusForm.new_status,
        jobStatusForm.status_reason,
        jobStatusForm.comments || undefined,
        jobStatusAttachments.length > 0 ? jobStatusAttachments : undefined
      );

      if (result.ok) {
        toast.success(
          `Job status updated to ${jobStatusForm.new_status}${
            result.data?.estimations_synced
              ? ` (${result.data.estimations_synced} estimations synced)`
              : ""
          }${
            result.data?.attachments?.length ? ` with ${result.data.attachments.length} file(s)` : ""
          }`
        );
        setEditJobDialogOpen(false);
        setJobStatusForm({ new_status: "", status_reason: "", comments: "" });
        setJobStatusAttachments([]);
        setSelectedJobForEdit(null);
        // Refresh jobs list
        fetchMyJobs(jobPage);
      } else {
        toast.error(result.error || "Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An error occurred while updating job status");
    } finally {
      setIsUpdatingJobStatus(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetchOverview();
    if (activeTab === "leads" && canViewLeads) fetchMyLeads(1);
    else fetchMyJobs(1);
  }, [activeTab, fetchMyLeads, fetchMyJobs, canViewLeads]);

  useEffect(() => {
    allLeadsRef.current = []; // clear cache so filters re-fetch from API
    setLeadPage(1);
  }, [leadFilters]);
  useEffect(() => {
    setJobPage(1);
  }, [jobFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeTab === "leads" && canViewLeads && leadPage === 1) fetchMyLeads(1);
      else if ((activeTab === "jobs" || activeTab === "jobs_done") && jobPage === 1) fetchMyJobs(1);
      else if (activeTab === "leads") setLeadPage(1);
      else setJobPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [
    leadFilters.search,
    jobFilters.search,
    activeTab,
    fetchMyLeads,
    fetchMyJobs,
    canViewLeads,
  ]);

  // -------------------------------------------------
  // Initial Loads
  // -------------------------------------------------
  useEffect(() => {
    loadPackages();
    fetchEmployees();
    fetchAllEmployees();
    fetchRoles();
    fetchSalesPersons();
    fetchOverview();
  }, []);

  // -------------------------------------------------
  // Leads/Enquiries Helper Functions
  // -------------------------------------------------
  const getFullName = (lead: any) => {
    if (lead?.full_name) return lead.full_name;
    if (lead?.fullName) return lead.fullName;
    if (lead?.name) return lead.name;
    if (lead?.customer_name) return lead.customer_name;
    const firstName = lead?.first_name || lead?.firstName || "";
    const lastName = lead?.last_name || lead?.lastName || "";
    if (firstName && lastName) return `${firstName} ${lastName}`.trim();
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "Unknown";
  };

  const getServiceType = (lead: any) => {
    const serviceType = lead?.service_type || lead?.serviceType || lead?.services_type || lead?.type || "";
    if (serviceType) return serviceType.charAt(0).toUpperCase() + serviceType.slice(1).toLowerCase();
    return "General";
  };

  const getEmployeeDisplayName = (emp: any) => {
    if (!emp) return "Employee";
    if (typeof emp.name === "string" && emp.name.trim().length > 0) return emp.name;
    const firstName = emp.first_name || "";
    const lastName = emp.last_name || "";
    const combinedName = `${firstName} ${lastName}`.trim();
    return combinedName.length > 0 ? combinedName : "Employee";
  };

  const getEmployeesByRole = (role: string) => {
    if (!role) return [];
    return employees.filter((emp: any) => {
      if (emp.role === role) return true;
      if (emp.roles && Array.isArray(emp.roles)) return emp.roles.some((r: any) => typeof r === "string" ? r === role : r.role_name === role);
      if (typeof emp.roles === "string" && emp.roles === role) return true;
      return false;
    });
  };

  // Fetch Sales Persons (same as fetchMyLeads)
  const fetchSalesPersons = useCallback(async () => {
    try {
      const response = await apiGet("/leads");
      if (response?.data?.success) {
        const raw = Array.isArray(response.data.data) ? response.data.data : [];
        setSalesPersons(raw.slice(0, 5)); // Store first 5 for display
      }
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    }
  }, []);

  // Fetch All Employees
  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await apiGet("/employees");
      if (response?.status === 200 && Array.isArray(response.data.data)) {
        const mapped = response.data.data.map((e: any) => ({
          id: e.id,
          user_id: e.user_id,
          first_name: e.first_name,
          last_name: e.last_name,
          mobile: e.mobile,
          email: e.email,
          role: e.role,
          roles: e.roles || [],
          name: e.name || `${e.first_name || ""} ${e.last_name || ""}`.trim(),
        }));
        setEmployees(mapped);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  // Fetch Roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await apiGet("/roles");
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const roleNames = response.data.data.map((r: any) => r.role_name || r.name).filter(Boolean);
        setRoles(roleNames);
      } else {
        setRoles(["Sales Person", "Field Executive", "Manager", "Admin"]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles(["Sales Person", "Field Executive", "Manager", "Admin"]);
    }
  }, []);

  // Create New Employee
  const handleCreateEmployee = async () => {
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim() || !newEmployeeMobile.trim()) {
      toast.error("Please fill all employee details");
      return;
    }

    try {
      setIsCreatingEmployee(true);
      const response = await apiPost("/employees", JSON.stringify({
        name: newEmployeeName.trim(),
        email: newEmployeeEmail.trim(),
        mobile: newEmployeeMobile.trim(),
        role: newEmployeeRole,
      }));

      if (response?.data?.success) {
        toast.success("Employee created successfully");
        await fetchAllEmployees();
        setCreateEmployeeDialogOpen(false);
        setNewEmployeeName("");
        setNewEmployeeEmail("");
        setNewEmployeeMobile("");
        setNewEmployeeRole("Sales Person");
      } else {
        toast.error("Failed to create employee");
      }
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast.error(error?.response?.data?.message || "Failed to create employee");
    } finally {
      setIsCreatingEmployee(false);
    }
  };

  // Assign Job to Employee
  const handleAssignJob = async () => {
    if (!selectedJobEmployee) {
      toast.error("Please select an employee");
      return;
    }
    if (!selectedJobRole) {
      toast.error("Please select a role");
      return;
    }
    if (!selectedJobForAssign) {
      toast.error("No job selected");
      return;
    }

    setAssigningJob(true);
    try {
      const jobId = selectedJobForAssign.id;
      const employeeId = parseInt(selectedJobEmployee, 10);

      const response = await assignJobToEmployee(
        jobId,
        employeeId,
        selectedJobRole
      );

      if (response.ok) {
        const assignmentData = response.data?.data;
        toast.success(`Job assigned to ${assignmentData?.employee_name || 'employee'} successfully`);
        setAssignJobDialogOpen(false);
        setSelectedJobForAssign(null);
        setSelectedJobEmployee("");
        setSelectedJobRole("");
        await fetchMyJobs(jobPage);
      } else {
        toast.error(response.error || "Failed to assign job");
      }
    } catch (error: any) {
      console.error("Error assigning job:", error);
      toast.error(error?.message || "Failed to assign job");
    } finally {
      setAssigningJob(false);
    }
  };

  // Assign Lead to Employee
  const handleAssignLead = async () => {
    if (!selectedLeadEmployee) {
      toast.error("Please select an employee");
      return;
    }
    if (!selectedLead) {
      toast.error("No lead selected");
      return;
    }

    setAssigningLead(true);
    try {
      const token = localStorage.getItem("authToken");
      const leadId = selectedLead.id || selectedLead.lead_id;
      const employeeId = parseInt(selectedLeadEmployee, 10);

      const response = await apiPost("/assignleads", JSON.stringify({
        leadId,
        employeeId,
        assignedBy: user?.id,
      }));

      if (response?.data?.success) {
        toast.success("Lead assigned successfully");
        setViewLeadDialogOpen(false);
        setSelectedLeadEmployee("");
        setSelectedLeadRole("");
        await fetchMyLeads(1);
      } else {
        toast.error(response?.data?.message || "Failed to assign lead");
      }
    } catch (error: any) {
      console.error("Error assigning lead:", error);
      toast.error(error?.response?.data?.message || "Failed to assign lead");
    } finally {
      setAssigningLead(false);
    }
  };

  // Refresh Employees and Roles
  const refreshSalesPersons = async () => {
    console.log("🔄 Refreshing employees and roles...");
    await Promise.all([fetchSalesPersons(), fetchAllEmployees(), fetchRoles()]);
    toast.success("Employees and roles refreshed");
  };

  const getStatusBadge = (status: string, type: "lead" | "job") => {
    const colors: Record<string, string> = {
      New: "bg-gray-200 text-gray-800",
      Active: "bg-blue-100 text-blue-700",
      "Site Visit": "bg-orange-100 text-orange-700",
      "Estimation Generated": "bg-purple-100 text-purple-700",
      Processed: "bg-indigo-100 text-indigo-700",
      "Pending on Portal": "bg-yellow-100 text-yellow-700",
      "Payment Pending": "bg-yellow-100 text-yellow-700",
      "Partial Payment Done": "bg-amber-100 text-amber-700",
      "Payment Done": "bg-lime-100 text-lime-700",
      "Invoice Generated": "bg-cyan-100 text-cyan-700",
      "Job Done": "bg-green-100 text-green-700",
      Assigned: "bg-blue-100 text-blue-700",
      "In Progress": "bg-purple-100 text-purple-700",
      "On Hold": "bg-yellow-100 text-yellow-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
      Contacted: "bg-indigo-100 text-indigo-700",
      Qualified: "bg-cyan-100 text-cyan-700",
      Converted: "bg-emerald-100 text-emerald-700",
      Lost: "bg-rose-100 text-rose-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Created: "bg-yellow-100 text-yellow-700",
    };
    return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  return (
    <div className="space-y-8 pr-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600">
          View and update your assigned leads and jobs
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "leads" | "jobs" | "jobs_done")}
        className="space-y-6"
      >
        <TabsList className={`grid w-full max-w-lg ${canViewLeads ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {canViewLeads && (
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Leads
            </TabsTrigger>
          )}
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Jobs
          </TabsTrigger>
          <TabsTrigger value="jobs_done" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Jobs Done
          </TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          {/* Header with Filters */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
              {/* Lead Filters - beside heading */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads..."
                    value={leadFilters.search}
                    onChange={(e) => setLeadFilters({ ...leadFilters, search: e.target.value })}
                    className="pl-10 h-9"
                  />
                </div>
                <Select
                  value={leadFilters.status}
                  onValueChange={(v) => setLeadFilters({ ...leadFilters, status: v })}
                >
                  <SelectTrigger className="flex-1 sm:flex-none sm:min-w-[150px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                      {leadFilters.start_date ? format(leadFilters.start_date, "MMM dd") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leadFilters.start_date || undefined}
                      onSelect={(d: Date | undefined) => setLeadFilters({...leadFilters, start_date: d || null})}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                      {leadFilters.end_date ? format(leadFilters.end_date, "MMM dd") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leadFilters.end_date || undefined}
                      onSelect={(d: Date | undefined) => setLeadFilters({...leadFilters, end_date: d || null})}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <p className="text-gray-600">Manage all customer leads and enquiries</p>
          </div>

          {/* Lead Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Total Leads</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{summary?.leads.assigned || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">New Leads</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{leads.filter((l: any) => (l.status || l.lead_status || "new").toLowerCase() === "new").length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Assigned</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{leads.filter((l: any) => (l.status || l.lead_status || "new").toLowerCase() === "assigned").length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Leads Table - Desktop */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>All Leads ({leads.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Sno</TableHead>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Mobile</TableHead>
                      <TableHead className="text-xs sm:text-sm">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm">Service Type</TableHead>
                      <TableHead className="text-xs sm:text-sm">Capacity</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead: any) => (
                        <TableRow key={lead.id || lead.lead_id}>
                          <TableCell className="text-xs sm:text-sm">{lead.id || lead.lead_id}</TableCell>
                          <TableCell className="text-xs sm:text-sm font-medium">{getFullName(lead)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{lead.mobile || lead.phone || "N/A"}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{lead.email || "N/A"}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{getServiceType(lead)}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{lead.kv || lead.capacity || lead.system_size || "N/A"}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{getStatusBadge(lead.lead_status || lead.status || "new", "lead")}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedLead(lead);
                                setViewLeadDialogOpen(true);
                                setSelectedLeadEmployee("");
                                setSelectedLeadRole("");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Leads Cards - Mobile */}
          <div className="md:hidden space-y-2">
            {leads.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No leads found
                </CardContent>
              </Card>
            ) : (
              leads.map((lead: any) => (
                <Card key={lead.id || lead.lead_id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start  gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{lead.id || lead.lead_id}</p>
                          <p className="font-medium text-sm">{getFullName(lead)}</p>
                        </div>
                        {getStatusBadge(lead.lead_status || lead.status || "new", "lead")}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                        <div>
                          <p className="text-gray-500 mb-0.5">Mobile</p>
                          <p className="text-gray-900 font-medium">{lead.mobile || lead.phone || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Service</p>
                          <p className="text-gray-900 font-medium">{getServiceType(lead)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500 mb-0.5">Capacity</p>
                          <p className="text-gray-900 font-medium">{lead.kv || lead.capacity || "N/A"}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs h-8"
                        onClick={() => {
                          setSelectedLead(lead);
                          setViewLeadDialogOpen(true);
                          setSelectedLeadEmployee("");
                          setSelectedLeadRole("");
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1.5" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* View Lead Dialog */}
          <Dialog open={viewLeadDialogOpen} onOpenChange={(open) => {
            setViewLeadDialogOpen(open);
            if (!open) {
              setSelectedLeadEmployee("");
              setSelectedLeadRole("");
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Lead Details</DialogTitle>
                <DialogDescription>View and manage lead information</DialogDescription>
              </DialogHeader>
              {selectedLead && (
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Lead ID</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.id || selectedLead.lead_id}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedLead.lead_status || selectedLead.status || "new", "lead")}</div>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Full Name</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{getFullName(selectedLead)}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Contact Number</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.mobile || selectedLead.phone || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Email</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.email || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Service Type</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{getServiceType(selectedLead)}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Capacity</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.kv || selectedLead.capacity || selectedLead.system_size || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold text-blue-700">Location</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.location || selectedLead.city || "N/A"}</p>
                    </div>
                    {selectedLead.assigned_to_name && (
                      <>
                        <div>
                          <Label className="text-xs sm:text-sm font-semibold text-blue-700">Assigned To</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.assigned_to_name || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm font-semibold text-blue-700">Assigned To Mobile</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedLead.assigned_to_mobile || "N/A"}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Assignment Section */}
                  {(selectedLead.status || selectedLead.lead_status || "new").toLowerCase() !== "assigned" && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-semibold text-sm mb-3">Assign Lead</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs sm:text-sm">Select Role</Label>
                          <Select value={selectedLeadRole} onValueChange={setSelectedLeadRole} disabled={roles.length === 0}>
                            <SelectTrigger>
                              <SelectValue placeholder={roles.length === 0 ? "Loading roles..." : "Choose role..."} />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedLeadRole && (
                          <div>
                            <Label className="text-xs sm:text-sm">Select Employee</Label>
                            <Select value={selectedLeadEmployee} onValueChange={(v) => {
                              if (v === "create_new") {
                                setNewEmployeeRole(selectedLeadRole);
                                setCreateEmployeeDialogOpen(true);
                                setSelectedLeadEmployee("");
                              } else {
                                setSelectedLeadEmployee(v);
                              }
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder={getEmployeesByRole(selectedLeadRole).length > 0 ? "Choose employee..." : "No employees - Click to create"} />
                              </SelectTrigger>
                              <SelectContent>
                                {getEmployeesByRole(selectedLeadRole).map((emp: any) => (
                                  <SelectItem key={emp.id} value={String(emp.id)}>
                                    {getEmployeeDisplayName(emp)}
                                  </SelectItem>
                                ))}
                                <hr className="my-1" />
                                <SelectItem value="create_new">
                                  <span className="text-blue-600">Create New {selectedLeadRole}</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {selectedLeadRole && selectedLeadEmployee && selectedLeadEmployee !== "create_new" && (
                          <Button
                            onClick={handleAssignLead}
                            className="w-full"
                            disabled={assigningLead}
                          >
                            {assigningLead ? "Assigning..." : "Assign Lead"}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          onClick={refreshSalesPersons}
                          size="sm"
                          className="w-full"
                        >
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Refresh Employees
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Create Employee Dialog */}
          <Dialog open={createEmployeeDialogOpen} onOpenChange={setCreateEmployeeDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Employee</DialogTitle>
                <DialogDescription>Add a new employee to the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Enter full name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={newEmployeeEmail}
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    placeholder="Enter mobile number"
                    value={newEmployeeMobile}
                    onChange={(e) => setNewEmployeeMobile(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={newEmployeeRole} onValueChange={setNewEmployeeRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreateEmployeeDialogOpen(false);
                      setNewEmployeeName("");
                      setNewEmployeeEmail("");
                      setNewEmployeeMobile("");
                    }}
                    className="flex-1"
                    disabled={isCreatingEmployee}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateEmployee}
                    className="flex-1"
                    disabled={isCreatingEmployee || !newEmployeeName.trim() || !newEmployeeEmail.trim()}
                  >
                    {isCreatingEmployee ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          {/* Header with Filters */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
              {/* Job Filters - beside heading */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={jobFilters.search}
                    onChange={(e) =>
                      setJobFilters({ ...jobFilters, search: e.target.value })
                    }
                    className="pl-10 h-9"
                  />
                </div>
                <Select
                  value={jobFilters.status}
                  onValueChange={(v) =>
                    setJobFilters({ ...jobFilters, status: v })
                  }
                >
                  <SelectTrigger className="flex-1 sm:flex-none sm:min-w-[150px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {["Assigned", "In Progress", "On Hold", "Completed", "Cancelled"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                      {jobFilters.start_date ? format(jobFilters.start_date, "MMM dd") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={jobFilters.start_date || undefined}
                      onSelect={(d: Date | undefined) =>
                        setJobFilters({ ...jobFilters, start_date: d || null })
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                      {jobFilters.end_date ? format(jobFilters.end_date, "MMM dd") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={jobFilters.end_date || undefined}
                      onSelect={(d: Date | undefined) =>
                        setJobFilters({ ...jobFilters, end_date: d || null })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-gray-600">Manage solar installation and service jobs</p>
              <Dialog open={addJobDialogOpen} onOpenChange={setAddJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[100vw] max-w-[100vw] sm:w-[85vw] sm:max-w-[85vw] md:w-[75vw] md:max-w-[75vw] lg:w-[70vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto">
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
                          value={jobFormData.customer.first_name}
                          onChange={(e) =>
                            handleJobFieldChange("customer", "first_name", e.target.value)
                          }
                          className={jobValidationErrors.first_name ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.first_name && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.first_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Last Name <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Input
                          placeholder="Enter last name (e.g., Kumar)"
                          value={jobFormData.customer.last_name}
                          onChange={(e) =>
                            handleJobFieldChange("customer", "last_name", e.target.value)
                          }
                          className={jobValidationErrors.last_name ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.last_name && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.last_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Mobile <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Input
                          placeholder="Enter 10-digit mobile number"
                          value={jobFormData.customer.mobile}
                          onChange={(e) =>
                            handleJobFieldChange("customer", "mobile", e.target.value)
                          }
                          className={jobValidationErrors.mobile ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.mobile && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.mobile}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email (Optional)</Label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={jobFormData.customer.email}
                          onChange={(e) =>
                            handleJobFieldChange("customer", "email", e.target.value)
                          }
                          className={jobValidationErrors.email ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.email && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Customer Type <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Select
                          value={jobFormData.customer.customer_type}
                          onValueChange={(v) =>
                            handleJobFieldChange("customer", "customer_type", v as any)
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
                      {jobFormData.customer.customer_type !== "Individual" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Company Name</Label>
                          <Input
                            placeholder="Enter company name (e.g., ABC Solar Pvt Ltd)"
                            value={jobFormData.customer.company_name}
                            onChange={(e) =>
                              handleJobFieldChange("customer", "company_name", e.target.value)
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Lead Source</Label>
                        <Input
                          placeholder="Enter lead source"
                          value={jobFormData.customer.lead_source}
                          onChange={(e) =>
                            handleJobFieldChange("customer", "lead_source", e.target.value)
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
                          value={jobFormData.location.location_type}
                          onValueChange={(v) =>
                            handleJobFieldChange("location", "location_type", v as any)
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
                          value={jobFormData.location.address_line_1}
                          onChange={(e) =>
                            handleJobFieldChange("location", "address_line_1", e.target.value)
                          }
                          className={jobValidationErrors.address_line_1 ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.address_line_1 && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.address_line_1}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Address Line 2</Label>
                        <Input
                          placeholder="Enter additional address details"
                          value={jobFormData.location.address_line_2}
                          onChange={(e) =>
                            handleJobFieldChange("location", "address_line_2", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          City <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Input
                          placeholder="Enter city name (e.g., Mumbai)"
                          value={jobFormData.location.city}
                          onChange={(e) =>
                            handleJobFieldChange("location", "city", e.target.value)
                          }
                          className={jobValidationErrors.city ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.city && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Country <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Select
                          value={jobFormData.location.country_id.toString()}
                          onValueChange={(v) =>
                            handleJobFieldChange("location", "country_id", parseInt(v))
                          }
                        >
                          <SelectTrigger className={jobValidationErrors.country_id ? "border-red-500" : ""}>
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
                        {jobValidationErrors.country_id && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.country_id}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          State <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Select
                          value={jobFormData.location.state_id.toString()}
                          disabled={!jobFormData.location.country_id}
                          onValueChange={(v) =>
                            handleJobFieldChange("location", "state_id", parseInt(v))
                          }
                        >
                          <SelectTrigger className={jobValidationErrors.state_id ? "border-red-500" : ""}>
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
                        {jobValidationErrors.state_id && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.state_id}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          District <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Select
                          value={jobFormData.location.district_id.toString()}
                          disabled={!jobFormData.location.state_id}
                          onValueChange={(v) =>
                            handleJobFieldChange("location", "district_id", parseInt(v))
                          }
                        >
                          <SelectTrigger className={jobValidationErrors.district_id ? "border-red-500" : ""}>
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
                        {jobValidationErrors.district_id && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.district_id}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Pincode <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Input
                          placeholder="Enter 6-digit pincode"
                          value={jobFormData.location.pincode}
                          onChange={(e) =>
                            handleJobFieldChange("location", "pincode", e.target.value)
                          }
                          className={jobValidationErrors.pincode ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.pincode && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.pincode}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Landmark</Label>
                        <Input
                          placeholder="Enter nearby landmark"
                          value={jobFormData.location.landmark}
                          onChange={(e) =>
                            handleJobFieldChange("location", "landmark", e.target.value)
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
                          value={jobFormData.service_type}
                          onValueChange={(v) => handleJobFieldChange("", "service_type", v as any)}
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
                          value={jobFormData.solar_service}
                          onValueChange={(v) => handleJobFieldChange("", "solar_service", v)}
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
                          value={jobFormData.package_id ? String(jobFormData.package_id) : undefined}
                          onValueChange={(v) => handleJobFieldChange("", "package_id", Number(v))}
                        >
                          <SelectTrigger className={jobValidationErrors.package_id ? "border-red-500" : ""}>
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
                        {jobValidationErrors.package_id && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.package_id}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Priority</Label>
                        <Select
                          value={jobFormData.job_priority}
                          onValueChange={(v) => handleJobFieldChange("", "job_priority", v as any)}
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
                          value={jobFormData.scheduled_date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => handleJobFieldChange("", "scheduled_date", e.target.value)}
                          className={jobValidationErrors.scheduled_date ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.scheduled_date && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.scheduled_date}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2 lg:col-span-2 space-y-2">
                        <Label className="text-sm font-medium">
                          Description <span className="text-red-600 font-bold">*</span>
                        </Label>
                        <Textarea
                          placeholder="Enter detailed job description"
                          value={jobFormData.job_description}
                          rows={3}
                          onChange={(e) => handleJobFieldChange("", "job_description", e.target.value)}
                          className={jobValidationErrors.job_description ? "border-red-500" : ""}
                        />
                        {jobValidationErrors.job_description && (
                          <p className="text-red-600 font-medium text-xs mt-1">{jobValidationErrors.job_description}</p>
                        )}
                      </div>
                      <div className="sm:col-span-2 lg:col-span-2 space-y-2">
                        <Label className="text-sm font-medium">Special Instructions</Label>
                        <Textarea
                          placeholder="Enter any special instructions or preferences"
                          value={jobFormData.special_instructions}
                          rows={2}
                          onChange={(e) => handleJobFieldChange("", "special_instructions", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-8 border-t border-gray-200">
                    <Button variant="outline" onClick={closeJobDialog} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleJobSubmit}
                      disabled={isSubmitting || Object.keys(jobValidationErrors).length > 0}
                    >
                      {isSubmitting ? "Saving..." : "Create Job"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Assign Employee Modal */}
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[80vw] sm:max-w-[80vw] md:w-[60vw] md:max-w-[60vw] lg:w-[45vw] lg:max-w-[45vw] max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Total Jobs</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{summary?.jobs.total || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Active Jobs</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{summary?.jobs.assigned || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600">Closed Jobs</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{summary?.jobs.closed || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Table Content */}
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
                                {getStatusBadge(job.status, "job")}
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
                                  <p className="text-sm text-gray-900">{job.package_capacity || '-'}</p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-gray-100">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Find the raw job data for this job
                                    const rawJobData = jobsRawData.find(j => j.job_info?.id === job.id);
                                    setSelectedJobForView(rawJobData || job);
                                    setViewJobDetailsDialogOpen(true);
                                  }}
                                  className="flex-1 text-xs h-8"
                                  title="View"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedJobForEdit(job);
                                    setEditJobDialogOpen(true);
                                  }}
                                  className="flex-1 text-xs h-8"
                                  title="Edit Status"
                                >
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedJobForAssign(job);
                                    setAssignJobDialogOpen(true);
                                  }}
                                  className="flex-1 text-xs h-8"
                                  title="Assign"
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  Assign
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {}}
                                  className="flex-1 text-xs h-8"
                                  title="Notes"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Notes
                                </Button>
                              </div>
                            </div>
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
                          <TableHead>Capacity</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
                              <TableCell>{job.package_capacity || "-"}</TableCell>
                              <TableCell>
                                ₹{job.estimated_cost?.toLocaleString("en-IN") || "-"}
                              </TableCell>
                              <TableCell>{getStatusBadge(job.status, "job")}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      // Find the raw job data for this job
                                      const rawJobData = jobsRawData.find(j => j.job_info?.id === job.id);
                                      setSelectedJobForView(rawJobData || job);
                                      setViewJobDetailsDialogOpen(true);
                                    }}
                                    title="View"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedJobForEdit(job);
                                      setEditJobDialogOpen(true);
                                    }}
                                    title="Edit Status"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedJobForAssign(job);
                                      setAssignJobDialogOpen(true);
                                    }}
                                    title="Assign"
                                  >
                                    <Users className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {}}
                                    title="Notes"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {jobPagination.total_pages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 sm:px-0">
                      <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                        Showing {(jobPage - 1) * 10 + 1} to{" "}
                        {Math.min(jobPage * 10, jobPagination.total_records)} of {jobPagination.total_records}
                      </p>

                      <div className="flex gap-1 flex-wrap justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchMyJobs(jobPage - 1)}
                          disabled={!jobPagination.has_previous}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from(
                          { length: Math.min(5, jobPagination.total_pages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={jobPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => fetchMyJobs(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchMyJobs(jobPage + 1)}
                          disabled={!jobPagination.has_next}
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
        </TabsContent>

        {/* Jobs Done Tab */}
        <TabsContent value="jobs_done" className="space-y-6">
          {/* Header with Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-2xl font-semibold">Jobs Done</h2>
            {/* Job Filters - beside heading */}
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={jobFilters.search}
                  onChange={(e) => setJobFilters({ ...jobFilters, search: e.target.value })}
                  className="pl-10 h-9"
                />
              </div>
              <Select value={jobFilters.status} onValueChange={(v) => setJobFilters({ ...jobFilters, status: v })}>
                <SelectTrigger className="flex-1 sm:flex-none sm:min-w-[150px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {["Assigned", "In Progress", "On Hold", "Completed", "Cancelled"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                    {jobFilters.start_date ? format(jobFilters.start_date, "MMM dd") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={jobFilters.start_date || undefined} onSelect={(d: Date | undefined) => setJobFilters({ ...jobFilters, start_date: d || null })} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none sm:min-w-[140px] justify-start text-left font-normal h-9 text-sm px-3">
                    {jobFilters.end_date ? format(jobFilters.end_date, "MMM dd") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={jobFilters.end_date || undefined} onSelect={(d: Date | undefined) => setJobFilters({ ...jobFilters, end_date: d || null })} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Jobs Done Table — only Completed jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : jobs.filter((j) => j.status === "Completed").length === 0 ? (
                <div className="text-center py-8 text-gray-500">No completed jobs found</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.filter((j) => j.status === "Completed").map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.job_code}</TableCell>
                          <TableCell>
                            <p className="font-medium">{job.customer.first_name} {job.customer.last_name}</p>
                            <p className="text-sm text-gray-500">{job.customer.mobile}</p>
                          </TableCell>
                          <TableCell><p className="text-sm">{job.location.city}, {job.location.pincode}</p></TableCell>
                          <TableCell>{job.solar_service}</TableCell>
                          <TableCell>₹{job.estimated_cost.toLocaleString("en-IN")}</TableCell>
                          <TableCell>{getStatusBadge(job.status, "job")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {jobPagination.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        Showing {jobs.filter((j) => j.status === "Completed").length} completed jobs
                      </p>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => fetchMyJobs(jobPage - 1)} disabled={!jobPagination.has_previous}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, jobPagination.total_pages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button key={pageNum} variant={jobPage === pageNum ? "default" : "outline"} size="sm" onClick={() => fetchMyJobs(pageNum)}>
                              {pageNum}
                            </Button>
                          );
                        })}
                        <Button variant="outline" size="sm" onClick={() => fetchMyJobs(jobPage + 1)} disabled={!jobPagination.has_next}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Modal */}
      <Dialog
        open={actionOpen}
        onOpenChange={(open) => {
          setActionOpen(open);
          if (!open) resetModal();
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Update {actionType === "job" ? "Job" : "Lead"} Status
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {actionType === "job" && newStatus === "Completed" && (
              <>
                <div>
                  <Label>Status Reason</Label>
                  <Input
                    placeholder="e.g., Job Completed successfully"
                    value={completionData.status_reason}
                    onChange={(e) =>
                      setCompletionData({
                        ...completionData,
                        status_reason: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={completionData.amount}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label>
                      Discount Amount (₹){" "}
                      <span className="text-xs text-gray-500">(optional)</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={completionData.discount_amount}
                      onChange={(e) =>
                        setCompletionData({
                          ...completionData,
                          discount_amount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={completionData.payment_method}
                    onValueChange={(v) =>
                      setCompletionData({
                        ...completionData,
                        payment_method: v,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Transaction ID</Label>
                  <Input
                    placeholder="e.g., TXN123456789"
                    value={completionData.transaction_id}
                    onChange={(e) =>
                      setCompletionData({
                        ...completionData,
                        transaction_id: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* File Upload for Jobs */}
            {actionType === "job" && (
              <div className="border-t pt-4">
                <Label htmlFor="action-attachments" className="text-gray-700 font-semibold mb-2 block">
                  📎 Attach Images (Optional)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <Input
                    id="action-attachments"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setActionAttachments([...actionAttachments, ...files]);
                      // Clear input so user can select more files
                      if (e.target) {
                        e.target.value = '';
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Upload multiple images (JPG, PNG, etc.)
                  </p>
                </div>

                {/* Show selected files */}
                {actionAttachments.length > 0 && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Selected Files ({actionAttachments.length}):
                    </p>
                    <ul className="space-y-1">
                      {actionAttachments.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                          <span>📄 {file.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setActionAttachments(actionAttachments.filter((_, i) => i !== index))
                            }
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label>Comment</Label>
              <Textarea
                placeholder="Add your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionOpen(false);
                resetModal();
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateStatus} disabled={actionLoading}>
              {actionLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Status Dialog */}
      <Dialog open={editJobDialogOpen} onOpenChange={setEditJobDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
          </DialogHeader>

          {selectedJobForEdit && (
            <div className="space-y-4">
              {/* Job Info Display */}
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Job ID</p>
                    <p className="font-medium">{selectedJobForEdit.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    <p className="font-medium">{getStatusBadge(selectedJobForEdit.status, "job")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium">
                      {selectedJobForEdit.customer.first_name} {selectedJobForEdit.customer.last_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">New Status *</Label>
                  <Select value={jobStatusForm.new_status} onValueChange={(value) => 
                    setJobStatusForm({...jobStatusForm, new_status: value})
                  }>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Site Visit">Site Visit</SelectItem>
                      <SelectItem value="Estimation Generated">Estimation Generated</SelectItem>
                      <SelectItem value="Processed">Processed</SelectItem>
                      <SelectItem value="Pending on Portal">Pending on Portal</SelectItem>
                      <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                      <SelectItem value="Partial Payment Done">Partial Payment Done</SelectItem>
                      <SelectItem value="Payment Done">Payment Done</SelectItem>
                      <SelectItem value="Invoice Generated">Invoice Generated</SelectItem>
                      <SelectItem value="Job Done">Job Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-reason">Status Reason *</Label>
                  <Input
                    id="status-reason"
                    placeholder="e.g., Site visit completed, Customer approved design, etc."
                    value={jobStatusForm.status_reason}
                    onChange={(e) =>
                      setJobStatusForm({...jobStatusForm, status_reason: e.target.value})
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add any additional comments..."
                    value={jobStatusForm.comments}
                    onChange={(e) =>
                      setJobStatusForm({...jobStatusForm, comments: e.target.value})
                    }
                    rows={3}
                  />
                </div>

                {/* File Upload - Optional for all statuses */}
                <div className="border-t pt-4">
                  <Label htmlFor="attachments" className="text-gray-700 font-semibold mb-2 block">
                    📎 Attach Multiple Files (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setJobStatusAttachments([...jobStatusAttachments, ...files]);
                        // Clear input so user can select more files
                        if (e.target) {
                          e.target.value = '';
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Select multiple files: images (JPG, PNG), PDFs, or documents. Max 5 files per upload.
                    </p>
                  </div>

                  {/* Show selected files */}
                  {jobStatusAttachments.length > 0 && (
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected Files ({jobStatusAttachments.length}):
                      </p>
                      <ul className="space-y-1">
                        {jobStatusAttachments.map((file, index) => (
                          <li key={index} className="text-xs text-gray-600 flex justify-between items-center">
                              <span>📄 {file.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setJobStatusAttachments(jobStatusAttachments.filter((_, i) => i !== index));
                                }}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditJobDialogOpen(false);
                setJobStatusForm({new_status: "", status_reason: "", comments: ""});
                setJobStatusAttachments([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateJobStatus}
              disabled={isUpdatingJobStatus || !jobStatusForm.new_status || !jobStatusForm.status_reason}
            >
              {isUpdatingJobStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Job Details Dialog */}
      <Dialog open={viewJobDetailsDialogOpen} onOpenChange={setViewJobDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>

          {selectedJobForView && (
            <div className="space-y-6">
              {/* Job Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Job ID</p>
                    <p className="font-medium">{selectedJobForView.job_info?.id || selectedJobForView.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Code</p>
                    <p className="font-medium">{selectedJobForView.job_info?.job_code || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{getStatusBadge(selectedJobForView.job_info?.status || selectedJobForView.status, "job")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-medium">{selectedJobForView.job_info?.service_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Solar Service</p>
                    <p className="font-medium">{selectedJobForView.job_info?.solar_service || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{selectedJobForView.job_info?.capacity || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className="font-medium">{selectedJobForView.job_info?.job_priority || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-medium">{selectedJobForView.job_info?.scheduled_date ? new Date(selectedJobForView.job_info.scheduled_date).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="font-medium">{selectedJobForView.job_info?.estimated_cost ? `₹${selectedJobForView.job_info.estimated_cost.toLocaleString("en-IN")}` : "N/A"}</p>
                  </div>
                </div>
                {selectedJobForView.job_info?.job_description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-900">{selectedJobForView.job_info.job_description}</p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium">{selectedJobForView.customer_info?.customer_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer Code</p>
                    <p className="font-medium">{selectedJobForView.customer_info?.customer_code || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium">{selectedJobForView.customer_info?.customer_mobile || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedJobForView.customer_info?.customer_email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer Type</p>
                    <p className="font-medium">{selectedJobForView.customer_info?.customer_type || "N/A"}</p>
                  </div>
                  {selectedJobForView.customer_info?.company_name && (
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium">{selectedJobForView.customer_info.company_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Location Type</p>
                    <p className="font-medium">{selectedJobForView.location_info?.location_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address Line 1</p>
                    <p className="font-medium">{selectedJobForView.location_info?.address_line_1 || "N/A"}</p>
                  </div>
                  {selectedJobForView.location_info?.address_line_2 && (
                    <div>
                      <p className="text-sm text-gray-600">Address Line 2</p>
                      <p className="font-medium">{selectedJobForView.location_info.address_line_2}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{selectedJobForView.location_info?.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">District</p>
                    <p className="font-medium">{selectedJobForView.location_info?.district_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium">{selectedJobForView.location_info?.state_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pincode</p>
                    <p className="font-medium">{selectedJobForView.location_info?.pincode || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              {selectedJobForView.payment_summary && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Advance</p>
                      <p className="font-medium">₹{selectedJobForView.payment_summary.total_advance?.toLocaleString("en-IN") || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Milestone</p>
                      <p className="font-medium">₹{selectedJobForView.payment_summary.total_milestone?.toLocaleString("en-IN") || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Final</p>
                      <p className="font-medium">₹{selectedJobForView.payment_summary.total_final?.toLocaleString("en-IN") || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="font-medium">₹{selectedJobForView.payment_summary.total_paid?.toLocaleString("en-IN") || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Amount</p>
                      <p className="font-medium text-orange-600">₹{selectedJobForView.payment_summary.pending_amount?.toLocaleString("en-IN") || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="font-medium">{selectedJobForView.payment_summary.payment_status || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Information */}
              {selectedJobForView.assignment_info && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Assigned Employees</p>
                      <p className="font-medium">{selectedJobForView.assignment_info.assigned_employees || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Assignment Status</p>
                      <p className="font-medium">{selectedJobForView.assignment_info.assignment_status || "N/A"}</p>
                    </div>
                  </div>
                  {selectedJobForView.assignment_info.employees_details && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Assigned Employee Details:</p>
                      <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                        <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedJobForView.assignment_info.employees_details.first_name} {selectedJobForView.assignment_info.employees_details.last_name}</span></p>
                        <p><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedJobForView.assignment_info.employees_details.employee_mobile}</span></p>
                        <p><span className="text-gray-600">Assignment Status:</span> <span className="font-medium">{selectedJobForView.assignment_info.employees_details.assignment_status}</span></p>
                        <p><span className="text-gray-600">Assigned By:</span> <span className="font-medium">{selectedJobForView.assignment_info.employees_details.assigned_by_name}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Information */}
              {selectedJobForView.status_info && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className="font-medium">{selectedJobForView.status_info.current_status || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Status Changes</p>
                      <p className="font-medium">{selectedJobForView.status_info.total_status_changes || "0"}</p>
                    </div>
                  </div>

                  {/* Status Attachments with Images */}
                  {selectedJobForView.status_info.attachments && selectedJobForView.status_info.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Status Attachments ({selectedJobForView.status_info.attachments.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedJobForView.status_info.attachments.map((attachment: any, idx: number) => (
                          <div key={idx} className="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition">
                            {/* Image Display - Clickable */}
                            {attachment.attachment_type === "image" && attachment.signed_url && (
                              <div 
                                className="aspect-video bg-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                                onClick={() => {
                                  setSelectedAttachment(attachment);
                                  setAttachmentViewerOpen(true);
                                }}
                              >
                                <img
                                  src={attachment.signed_url}
                                  alt={attachment.file_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Image+Unavailable";
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Document Icon for Non-Images */}
                            {attachment.attachment_type !== "image" && (
                              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">📄</div>
                                  <p className="text-xs text-gray-600">{attachment.attachment_type}</p>
                                </div>
                              </div>
                            )}

                            {/* File Details */}
                            <div className="p-3">
                              <p className="text-sm font-medium text-gray-900 truncate" title={attachment.file_name}>
                                {attachment.file_name}
                              </p>
                              <div className="mt-2 space-y-1 text-xs text-gray-600">
                                {attachment.file_size && (
                                  <p>📦 {(attachment.file_size / 1024).toFixed(2)} KB</p>
                                )}
                                <p>⏱️ {new Date(attachment.uploaded_at).toLocaleDateString()}</p>
                                <p>👤 {attachment.uploaded_by}</p>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="mt-3 flex gap-2">
                                {/* View Button for Images */}
                                {attachment.attachment_type === "image" && attachment.signed_url && (
                                  <button
                                    onClick={() => {
                                      setSelectedAttachment(attachment);
                                      setAttachmentViewerOpen(true);
                                    }}
                                    className="flex-1 px-2 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded transition"
                                  >
                                    👁️ View
                                  </button>
                                )}
                                
                                {/* Download Button */}
                                {attachment.signed_url && (
                                  <a
                                    href={attachment.signed_url}
                                    download={attachment.file_name}
                                    className={`${attachment.attachment_type === "image" ? "flex-1" : "w-full"} text-center px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition`}
                                  >
                                    �️ View
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Creator Information */}
              {/* {selectedJobForView.creator_info && (
                // <div className="border rounded-lg p-4">
                //   <h3 className="text-lg font-semibold text-gray-900 mb-3">Audit Information</h3>
                //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                //     <div>
                //       <p className="text-gray-600">Created By</p>
                //       <p className="font-medium">{selectedJobForView.creator_info.created_by_name || "N/A"}</p>
                //     </div>
                //     <div>
                //       <p className="text-gray-600">Updated By</p>
                //       <p className="font-medium">{selectedJobForView.creator_info.updated_by_name || "N/A"}</p>
                //     </div>
                //     {selectedJobForView.job_info?.created_at && (
                //       <div>
                //         <p className="text-gray-600">Created At</p>
                //         <p className="font-medium">{new Date(selectedJobForView.job_info.created_at).toLocaleDateString()} {new Date(selectedJobForView.job_info.created_at).toLocaleTimeString()}</p>
                //       </div>
                //     )}
                //     {selectedJobForView.job_info?.updated_at && (
                //       <div>
                //         <p className="text-gray-600">Updated At</p>
                //         <p className="font-medium">{new Date(selectedJobForView.job_info.updated_at).toLocaleDateString()} {new Date(selectedJobForView.job_info.updated_at).toLocaleTimeString()}</p>
                //       </div>
                //     )}
                //   </div>
                // </div>
              )} */}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setViewJobDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Job to Employee Dialog */}
      <Dialog open={assignJobDialogOpen} onOpenChange={setAssignJobDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Job to Employee</DialogTitle>
            <DialogDescription>
              {selectedJobForAssign && (
                <span>
                  Job ID: {selectedJobForAssign.id} - {selectedJobForAssign.solar_service}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Select Role</Label>
              <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Selection */}
            {selectedJobRole && (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Select Employee</Label>
                <Select value={selectedJobEmployee} onValueChange={(v) => {
                  if (v === "create_new") {
                    setNewEmployeeRole(selectedJobRole);
                    setCreateEmployeeDialogOpen(true);
                    setSelectedJobEmployee("");
                  } else {
                    setSelectedJobEmployee(v);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={getEmployeesByRole(selectedJobRole).length > 0 ? "Choose employee..." : "No employees - Click to create"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getEmployeesByRole(selectedJobRole).map((emp: any) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {getEmployeeDisplayName(emp)}
                      </SelectItem>
                    ))}
                    <hr className="my-1" />
                    <SelectItem value="create_new">
                      <span className="text-blue-600">Create New {selectedJobRole}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedJobRole && selectedJobEmployee && selectedJobEmployee !== "create_new" && (
              <Button
                onClick={handleAssignJob}
                className="w-full"
                disabled={assigningJob}
              >
                {assigningJob ? "Assigning..." : "Assign Job"}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => {
                fetchAllEmployees();
                fetchRoles();
              }}
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh Employees
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignJobDialogOpen(false);
                setSelectedJobForAssign(null);
                setSelectedJobRole("");
                setSelectedJobEmployee("");
              }}
              disabled={assigningJob}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Viewer Dialog */}
      <Dialog open={attachmentViewerOpen} onOpenChange={setAttachmentViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black">
          <DialogHeader className="bg-black px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center justify-between text-white">
              <span>📸 Image Viewer</span>
              <button
                onClick={() => setAttachmentViewerOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </DialogTitle>
          </DialogHeader>

          {selectedAttachment && selectedAttachment.attachment_type === "image" && selectedAttachment.signed_url && (
            <div className="flex justify-center items-center py-4 px-6">
              <img
                src={selectedAttachment.signed_url}
                alt={selectedAttachment.file_name}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Image+Unavailable";
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
