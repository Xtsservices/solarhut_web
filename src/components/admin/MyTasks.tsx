"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { apiGet, apiPut } from "../../api/commonApi";
import { updateLeadStatus } from "../../api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

type Job = {
  id: number;
  job_code: string;
  customer: {
    first_name: string;
    last_name: string;
    mobile: string;
  };
  location: {
    city: string;
    pincode: string;
  };
  solar_service: string;
  package_name: string;
  package_capacity: string;
  estimated_cost: number;
  scheduled_date: string;
  job_priority: "Low" | "Medium" | "High";
  status: "Assigned" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
};

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
  const [activeTab, setActiveTab] = useState<"leads" | "jobs">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Action Modal
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"lead" | "job">("job");
  const [actionId, setActionId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Job Completion Fields
  const [completionData, setCompletionData] = useState({
    status_reason: "",
    amount: 0,
    discount_amount: "",
    payment_method: "",
    transaction_id: "",
  });

  // Current Job for prefill
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

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

  // Fetch Leads
  const fetchMyLeads = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(leadFilters.search && { search: leadFilters.search }),
          ...(leadFilters.status !== "all" && { status: leadFilters.status }),
          ...(leadFilters.solar_service !== "all" && {
            solar_service: leadFilters.solar_service,
          }),
          ...(leadFilters.channel !== "all" && {
            channel: leadFilters.channel,
          }),
          ...(leadFilters.start_date && {
            start_date: format(leadFilters.start_date, "yyyy-MM-dd"),
          }),
          ...(leadFilters.end_date && {
            end_date: format(leadFilters.end_date, "yyyy-MM-dd"),
          }),
        });

        const response = await apiGet(`/mytasks/myLeads?${params.toString()}`);
        if (response?.data?.success) {
          const data: LeadsResponse = response.data.data;
          const mapped = data.leads.map((l: any) => ({
            id: l.id,
            customer_name: `${l.first_name} ${l.last_name}`.trim() || "Unknown",
            mobile: l.mobile,
            email: l.email,
            solar_service: l.solar_service,
            lead_status: l.status,
            capacity: l.capacity,
            location: l.location,
            property_type: l.property_type,
            channel: l.channel,
            assigned_at: l.created_at || l.updated_at,
          }));
          setLeads(mapped);
          setLeadPagination(data.pagination);
          setLeadPage(data.pagination.current_page);
        } else {
          setLeads([]);
        }
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

        const response = await apiGet(`/mytasks/myJobs?${params.toString()}`);
        if (response?.data?.success) {
          const data: JobsResponse = response.data.data;
          const mapped = data.jobs.map((j: any) => {
            const [first_name = "", last_name = ""] = (j.customer_name || "")
              .trim()
              .split(" ");
            return {
              id: j.id,
              job_code: j.job_code,
              customer: {
                first_name,
                last_name: last_name || (j.company_name ? "" : "User"),
                mobile: j.customer_mobile,
              },
              location: { city: j.city, pincode: j.pincode },
              solar_service: j.solar_service,
              package_name: j.package_name || "-",
              package_capacity: j.package_capacity || "-",
              estimated_cost: Number(j.package_price || j.estimated_cost || 0),
              scheduled_date: j.scheduled_date.split("T")[0],
              job_priority: j.job_priority,
              status: j.status,
            };
          });
          setJobs(mapped);
          setJobPagination(data.pagination);
          setJobPage(data.pagination.current_page);
        } else {
          setJobs([]);
        }
      } catch (error) {
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
        // Jobs continue to use existing API (PUT) with additional payload
        const endpoint = `/jobs/${actionId}/status`;
        const payload: any = {
          new_status: newStatus,
          comments: comment.trim(),
        };

        if (actionType === "job" && newStatus === "Completed") {
          payload.status_reason = completionData.status_reason.trim();
          payload.payment_details = {
            amount: completionData.amount,
            discount_amount: completionData.discount_amount
              ? Number(completionData.discount_amount)
              : 0,
            payment_method: completionData.payment_method,
            payment_status: "Completed",
            transaction_id: completionData.transaction_id.trim(),
          };
        }

        const response = await apiPut(endpoint, payload);

        if (response?.data?.success) {
          toast.success(`Job status updated to ${newStatus}`);
          setActionOpen(false);
          resetModal();
          fetchMyJobs(jobPage);
          fetchOverview();
        } else {
          toast.error("Failed to update status");
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetchOverview();
    if (activeTab === "leads") fetchMyLeads(1);
    else fetchMyJobs(1);
  }, [activeTab, fetchMyLeads, fetchMyJobs]);

  useEffect(() => {
    setLeadPage(1);
  }, [leadFilters]);
  useEffect(() => {
    setJobPage(1);
  }, [jobFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (activeTab === "leads" && leadPage === 1) fetchMyLeads(1);
      else if (activeTab === "jobs" && jobPage === 1) fetchMyJobs(1);
      else activeTab === "leads" ? setLeadPage(1) : setJobPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [
    leadFilters.search,
    jobFilters.search,
    activeTab,
    fetchMyLeads,
    fetchMyJobs,
  ]);

  const getStatusBadge = (status: string, type: "lead" | "job") => {
    const colors: Record<string, string> = {
      Assigned: "bg-blue-100 text-blue-700",
      "In Progress": "bg-purple-100 text-purple-700",
      "On Hold": "bg-yellow-100 text-yellow-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
      Contacted: "bg-indigo-100 text-indigo-700",
      Qualified: "bg-cyan-100 text-cyan-700",
      Converted: "bg-emerald-100 text-emerald-700",
      Lost: "bg-rose-100 text-rose-700",
    };
    return <Badge className={colors[status] || "bg-gray-100"}>{status}</Badge>;
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600">
          View and update your assigned leads and jobs
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "leads" | "jobs")}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Leads
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Jobs
          </TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Leads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["assigned", "ongoing", "closed"].map((key) => (
                <Card key={key}>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
                    <p
                      className={`text-2xl font-bold ${
                        key === "assigned"
                          ? "text-blue-600"
                          : key === "ongoing"
                          ? "text-purple-600"
                          : "text-green-600"
                      }`}
                    >
                      {summary?.leads[key as keyof typeof summary.leads] ?? 0}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Lead Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads..."
                    value={leadFilters.search}
                    onChange={(e) =>
                      setLeadFilters({ ...leadFilters, search: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <Select
                  value={leadFilters.status}
                  onValueChange={(v) =>
                    setLeadFilters({ ...leadFilters, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[
                      "Assigned",
                      "Contacted",
                      "Qualified",
                      "Converted",
                      "Lost",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {leadFilters.start_date
                        ? format(leadFilters.start_date, "PP")
                        : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leadFilters.start_date || undefined}
                      onSelect={(d) =>
                        setLeadFilters({
                          ...leadFilters,
                          start_date: d || null,
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {leadFilters.end_date
                        ? format(leadFilters.end_date, "PP")
                        : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={leadFilters.end_date || undefined}
                      onSelect={(d) =>
                        setLeadFilters({ ...leadFilters, end_date: d || null })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : leads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No leads found
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">
                            #{lead.id}
                          </TableCell>
                          <TableCell>{lead.customer_name}</TableCell>
                          <TableCell>
                            <p className="text-sm">{lead.mobile}</p>
                            {lead.email && (
                              <p className="text-xs text-gray-500">
                                {lead.email}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{lead.solar_service}</TableCell>
                          <TableCell>{lead.location}</TableCell>
                          <TableCell>
                            {getStatusBadge(lead.lead_status, "lead")}
                          </TableCell>
                          <TableCell>
                            {lead.lead_status !== "Completed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  openActionModal(
                                    "lead",
                                    lead.id,
                                    lead.lead_status
                                  )
                                }
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {leadPagination.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        Showing {leads.length} of {leadPagination.total_records}{" "}
                        leads
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchMyLeads(leadPage - 1)}
                          disabled={!leadPagination.has_previous}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from(
                          { length: Math.min(5, leadPagination.total_pages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  leadPage === pageNum ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => fetchMyLeads(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchMyLeads(leadPage + 1)}
                          disabled={!leadPagination.has_next}
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

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["assigned", "ongoing", "closed"].map((key) => (
                <Card key={key}>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 capitalize">{key}</p>
                    <p
                      className={`text-2xl font-bold ${
                        key === "assigned"
                          ? "text-blue-600"
                          : key === "ongoing"
                          ? "text-purple-600"
                          : "text-green-600"
                      }`}
                    >
                      {summary?.jobs[key as keyof typeof summary.jobs] ?? 0}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={jobFilters.search}
                    onChange={(e) =>
                      setJobFilters({ ...jobFilters, search: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <Select
                  value={jobFilters.status}
                  onValueChange={(v) =>
                    setJobFilters({ ...jobFilters, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[
                      "Assigned",
                      "In Progress",
                      "On Hold",
                      "Completed",
                      "Cancelled",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {jobFilters.start_date
                        ? format(jobFilters.start_date, "PP")
                        : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={jobFilters.start_date || undefined}
                      onSelect={(d) =>
                        setJobFilters({ ...jobFilters, start_date: d || null })
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {jobFilters.end_date
                        ? format(jobFilters.end_date, "PP")
                        : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={jobFilters.end_date || undefined}
                      onSelect={(d) =>
                        setJobFilters({ ...jobFilters, end_date: d || null })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No jobs found
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            {job.job_code}
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">
                              {job.customer.first_name} {job.customer.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {job.customer.mobile}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {job.location.city}, {job.location.pincode}
                            </p>
                          </TableCell>
                          <TableCell>{job.solar_service}</TableCell>
                          <TableCell>{job.package_name}</TableCell>
                          <TableCell>
                            ₹{job.estimated_cost.toLocaleString("en-IN")}
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
                          <TableCell>
                            {getStatusBadge(job.status, "job")}
                          </TableCell>
                          <TableCell>
                            {job.status !== "Completed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  openActionModal("job", job.id, job.status)
                                }
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {jobPagination.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        Showing {jobs.length} of {jobPagination.total_records}{" "}
                        jobs
                      </p>
                      <div className="flex gap-1">
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
                                variant={
                                  jobPage === pageNum ? "default" : "outline"
                                }
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
    </div>
  );
}
