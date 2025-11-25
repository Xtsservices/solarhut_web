import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL in JobRequestsPage:', API_BASE_URL);


export function JobRequestsPage() {
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [supplierRequests, setSupplierRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [jobCurrentPage, setJobCurrentPage] = useState(1);
  const [supplierCurrentPage, setSupplierCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch individual contact by ID
  const fetchContactById = async (contactId: string) => {
    try {
      console.log('🔍 Fetching contact by ID:', contactId);
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Fetch contact by ID error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Contact by ID result:', result);
      return result;
    } catch (error) {
      console.error('💥 Error fetching contact by ID:', error);
      toast.error('Failed to fetch contact details');
      return null;
    }
  };

  // Fetch contacts by reason
  const fetchContactsByReason = async (reason: string) => {
    try {
      console.log('🔍 Fetching contacts by reason:', reason);
      const response = await fetch(`${API_BASE_URL}/api/contacts/reason/${encodeURIComponent(reason)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Fetch contacts by reason error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Contacts by reason result:', result);
      return result;
    } catch (error) {
      console.error('💥 Error fetching contacts by reason:', error);
      toast.error(`Failed to fetch contacts for reason: ${reason}`);
      return null;
    }
  };

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching contacts from:', `${API_BASE_URL}/api/contacts`);
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch contacts response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Raw API result:', result);
      
      if (result.success && Array.isArray(result.data)) {
        console.log('✅ Data is valid array, length:', result.data.length);
        console.log('📋 Sample data structure:', result.data[0]);
        
        // Filter contacts based on request type
        const allContacts = result.data;
        console.log('📋 All contacts data:', allContacts);
        
        // Filter job opportunities (job seekers, employment requests)
        const jobOpportunities = allContacts.filter((contact: any) => {
          const message = (contact.message || contact.description || contact.requirements || '').toLowerCase();
          const reason = (contact.reason || '').toLowerCase();
          const requestType = (contact.request_type || contact.type || '').toLowerCase();
          const category = (contact.category || '').toLowerCase();
          
          // Check for job-related keywords
          const jobKeywords = [
            'job', 'employment', 'career', 'work', 'position', 'hire', 'recruit',
            'experience', 'resume', 'cv', 'apply', 'opportunity', 'vacancy',
            'technician', 'engineer', 'sales', 'field', 'installer'
          ];
          
          // Check if this is explicitly marked as job request in reason field
          if (reason.includes('job') || reason.includes('employment') || reason.includes('career') || reason.includes('opportunity')) {
            return true;
          }
          
          // Check if this is explicitly marked as job request in other fields
          if (requestType.includes('job') || category.includes('job')) {
            return true;
          }
          
          // Check message content for job-related keywords
          const hasJobKeywords = jobKeywords.some(keyword => 
            message.includes(keyword) || requestType.includes(keyword) || category.includes(keyword) || reason.includes(keyword)
          );
          
          return hasJobKeywords;
        });
        
        // Filter supplier requests (business partnerships, suppliers, vendors)
        const supplierRequests = allContacts.filter((contact: any) => {
          const message = (contact.message || contact.description || contact.requirements || '').toLowerCase();
          const reason = (contact.reason || '').toLowerCase();
          const requestType = (contact.request_type || contact.type || '').toLowerCase();
          const category = (contact.category || '').toLowerCase();
          
          // Check for supplier-related keywords
          const supplierKeywords = [
            'supplier', 'vendor', 'partnership', 'business', 'company', 'manufacture',
            'distribute', 'wholesale', 'retail', 'product', 'service', 'supply',
            'collaborate', 'deal', 'contract', 'agreement'
          ];
          
          // Check if this is explicitly marked as supplier request in reason field
          if (reason.includes('supplier') || reason.includes('partnership') || reason.includes('vendor')) {
            return true;
          }
          
          // Check if this is explicitly marked as supplier request in other fields
          if (requestType.includes('supplier') || requestType.includes('partner') || 
              category.includes('supplier') || category.includes('partner')) {
            return true;
          }
          
          // Check message content for supplier-related keywords
          const hasSupplierKeywords = supplierKeywords.some(keyword => 
            message.includes(keyword) || requestType.includes(keyword) || category.includes(keyword) || reason.includes(keyword)
          );
          
          // If it's not a job request and has supplier keywords, or has company-like info
          const isNotJobRequest = !jobOpportunities.find((job: any) => 
            (job.id || job.contact_id) === (contact.id || contact.contact_id)
          );
          
          return hasSupplierKeywords || (isNotJobRequest && (contact.company_name || contact.business_name));
        });
        
        // Debug: If no contacts were categorized, show all as supplier requests for debugging
        if (jobOpportunities.length === 0 && supplierRequests.length === 0 && allContacts.length > 0) {
          console.log('⚠️ No contacts matched filters, showing all as supplier requests for debugging');
          setSupplierRequests(allContacts);
          setJobRequests([]);
        } else {
          setJobRequests(jobOpportunities);
          setSupplierRequests(supplierRequests);
        }
        
        console.log('🎯 Filtering Results:');
        console.log(`📊 Total contacts: ${allContacts.length}`);
        console.log(`💼 Job opportunities: ${jobOpportunities.length}`);
        console.log(`🏢 Supplier requests: ${supplierRequests.length}`);
        
        // Log sample data for debugging
        if (jobOpportunities.length > 0) {
          console.log('💼 Sample job request:', jobOpportunities[0]);
        }
        if (supplierRequests.length > 0) {
          console.log('🏢 Sample supplier request:', supplierRequests[0]);
        }
        
        // Log sample contact structure for debugging
        if (result.data.length > 0) {
          console.log('📊 Sample contact structure:', JSON.stringify(result.data[0], null, 2));
        }
      } else if (result.success && result.data) {
        console.log('⚠️ Data exists but not array format:', result.data);
        // Try to handle if data is not an array
        const dataArray = Array.isArray(result.data) ? result.data : [result.data];
        setJobRequests(dataArray);
        setSupplierRequests(dataArray);
      } else {
        console.log('❌ No valid data found:', { success: result.success, data: result.data });
        setJobRequests([]);
        setSupplierRequests([]);
      }
    } catch (error) {
      console.error('💥 Error fetching contacts:', error);
      toast.error('Failed to fetch contacts. Please check console for details.');
      setJobRequests([]);
      setSupplierRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced fetch with reason-based filtering
  const fetchJobRequests = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching job-related contacts...');
      
      // Try to fetch job-specific contacts first
      const jobReasons = ['job', 'employment', 'career', 'work'];
      let jobContacts: any[] = [];
      
      for (const reason of jobReasons) {
        const result = await fetchContactsByReason(reason);
        if (result?.success && Array.isArray(result.data)) {
          jobContacts = [...jobContacts, ...result.data];
        }
      }
      
      // Remove duplicates based on ID
      const uniqueJobContacts = jobContacts.filter((contact, index, self) => 
        index === self.findIndex(c => (c.id || c.contact_id) === (contact.id || contact.contact_id))
      );
      
      console.log('💼 Fetched job contacts via reason:', uniqueJobContacts.length);
      return uniqueJobContacts;
    } catch (error) {
      console.error('💥 Error fetching job requests:', error);
      return [];
    }
  };

  const fetchSupplierRequests = async () => {
    try {
      console.log('🔍 Fetching supplier-related contacts...');
      
      // Try to fetch supplier-specific contacts first
      const supplierReasons = ['supplier', 'partnership', 'vendor', 'business'];
      let supplierContacts: any[] = [];
      
      for (const reason of supplierReasons) {
        const result = await fetchContactsByReason(reason);
        if (result?.success && Array.isArray(result.data)) {
          supplierContacts = [...supplierContacts, ...result.data];
        }
      }
      
      // Remove duplicates based on ID
      const uniqueSupplierContacts = supplierContacts.filter((contact, index, self) => 
        index === self.findIndex(c => (c.id || c.contact_id) === (contact.id || contact.contact_id))
      );
      
      console.log('🏢 Fetched supplier contacts via reason:', uniqueSupplierContacts.length);
      return uniqueSupplierContacts;
    } catch (error) {
      console.error('💥 Error fetching supplier requests:', error);
      return [];
    }
  };

  // Enhanced contact fetching with multiple strategies
  const fetchAllContactsEnhanced = async () => {
    try {
      setIsLoading(true);
      
      // Strategy 1: Try reason-based fetching first
      console.log('📡 Strategy 1: Fetching by reason...');
      const [jobContactsFromReason, supplierContactsFromReason] = await Promise.all([
        fetchJobRequests(),
        fetchSupplierRequests()
      ]);
      
      // If reason-based fetching worked, use those results
      if (jobContactsFromReason.length > 0 || supplierContactsFromReason.length > 0) {
        console.log('✅ Using reason-based results');
        setJobRequests(jobContactsFromReason);
        setSupplierRequests(supplierContactsFromReason);
        console.log('✅ Final counts - Jobs:', jobContactsFromReason.length, 'Suppliers:', supplierContactsFromReason.length);
      } else {
        // Strategy 2: Fallback to general contacts API and filter
        console.log('📡 Strategy 2: Fallback to general API and filtering...');
        await fetchContacts(); // This will set jobRequests and supplierRequests internally
      }
      
    } catch (error) {
      console.error('💥 Error in enhanced fetch:', error);
      // Fallback to original method
      await fetchContacts();
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    // Use the original, working fetchContacts method
    fetchContacts();
  }, []);

  // Helper function to get full name from various name fields
  const getFullName = (contact: any) => {
    // Try direct full name fields first
    if (contact.full_name) return contact.full_name;
    if (contact.fullName) return contact.fullName;
    if (contact.name) return contact.name;
    if (contact.company_name) return contact.company_name;
    
    // Try to combine first and last name
    const firstName = contact.firstName || contact.first_name || '';
    const lastName = contact.lastName || contact.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    if (firstName) return firstName;
    if (lastName) return lastName;
    
    return 'Unknown';
  };

  // Helper function to get contact number
  const getContactNumber = (contact: any) => {
    return contact.mobile || contact.phone || contact.contact || contact.contact_number || 'N/A';
  };

  // Helper function to get email
  const getEmail = (contact: any) => {
    return contact.email || contact.email_address || 'N/A';
  };

  // Helper function to get address
  const getAddress = (contact: any) => {
    return contact.address || contact.location || contact.city || 'N/A';
  };

  // Helper function to get message/description
  const getMessage = (contact: any) => {
    return contact.message || contact.description || contact.requirements || contact.details || 'N/A';
  };

  // Helper function to get created date
  const getCreatedDate = (contact: any) => {
    const date = contact.created_at || contact.createdAt || contact.date_created || contact.date;
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: string; label: string }> = {
      new: { variant: 'secondary', label: 'New' },
      assigned: { variant: 'default', label: 'Under Review' },
      completed: { variant: 'default', label: 'Approved' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDeleteJob = async (request: any) => {
    const id = request.id || request.contact_id;
    if (!id) {
      toast.error('Unable to delete: No ID found');
      return;
    }

    try {
      console.log(`🗑️ Deleting job request with ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Delete result:', result);

      if (result.success) {
        setJobRequests(jobRequests.filter((r: any) => (r.id || r.contact_id) !== id));
        toast.success(result.message || 'Job request deleted successfully');
      } else {
        throw new Error(result.message || 'Failed to delete job request');
      }
    } catch (error) {
      console.error('💥 Error deleting job request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete job request');
    }
  };

  const handleDeleteSupplier = async (request: any) => {
    const id = request.id || request.contact_id;
    if (!id) {
      toast.error('Unable to delete: No ID found');
      return;
    }

    try {
      console.log(`🗑️ Deleting supplier request with ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Delete result:', result);

      if (result.success) {
        setSupplierRequests(supplierRequests.filter((r: any) => (r.id || r.contact_id) !== id));
        toast.success(result.message || 'Supplier request deleted successfully');
      } else {
        throw new Error(result.message || 'Failed to delete supplier request');
      }
    } catch (error) {
      console.error('💥 Error deleting supplier request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete supplier request');
    }
  };

  // Pagination logic for job requests
  const jobTotalPages = Math.ceil(jobRequests.length / itemsPerPage);
  const jobStartIndex = (jobCurrentPage - 1) * itemsPerPage;
  const jobEndIndex = jobStartIndex + itemsPerPage;
  const paginatedJobRequests = jobRequests.slice(jobStartIndex, jobEndIndex);

  // Pagination logic for supplier requests
  const supplierTotalPages = Math.ceil(supplierRequests.length / itemsPerPage);
  const supplierStartIndex = (supplierCurrentPage - 1) * itemsPerPage;
  const supplierEndIndex = supplierStartIndex + itemsPerPage;
  const paginatedSupplierRequests = supplierRequests.slice(supplierStartIndex, supplierEndIndex);

  // Pagination handlers
  const handleJobPageChange = (page: number) => {
    console.log('📄 Job page changing to:', page);
    setJobCurrentPage(page);
  };

  const handleSupplierPageChange = (page: number) => {
    console.log('📄 Supplier page changing to:', page);
    setSupplierCurrentPage(page);
  };

  // Get page numbers for pagination display
  const getJobPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= jobTotalPages; i++) {
      const showPage = i === 1 || i === jobTotalPages || (i >= jobCurrentPage - 1 && i <= jobCurrentPage + 1);
      if (showPage) {
        pages.push(i);
      } else if (i === jobCurrentPage - 2 || i === jobCurrentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };

  const getSupplierPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= supplierTotalPages; i++) {
      const showPage = i === 1 || i === supplierTotalPages || (i >= supplierCurrentPage - 1 && i <= supplierCurrentPage + 1);
      if (showPage) {
        pages.push(i);
      } else if (i === supplierCurrentPage - 2 || i === supplierCurrentPage + 2) {
        pages.push('...');
      }
    }
    return pages;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading contacts...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-gray-900 mb-2">Contacts</h1>
            <p className="text-gray-600">Manage partnership and job requests</p>
          </div>
        
        </div>

      </div>

      <Tabs defaultValue="job" className="w-full">
        <TabsList>
          <TabsTrigger value="job">Job Requests ({jobRequests.length})</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Requests ({supplierRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="job">
          <Card>
            <CardHeader>
              <CardTitle>Job Partnership Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              {/* Desktop Table Layout */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedJobRequests.map((request: any) => (
                      <TableRow key={request.id || request.contact_id}>
                        <TableCell>{request.id || request.contact_id || 'N/A'}</TableCell>
                        <TableCell>{getFullName(request)}</TableCell>
                        <TableCell>{getContactNumber(request)}</TableCell>
                        <TableCell>{getEmail(request)}</TableCell>
                        <TableCell>{getStatusBadge(request.status || 'new')}</TableCell>
                        <TableCell>{getCreatedDate(request)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={async () => {
                                    const contactId = request.id || request.contact_id;
                                    if (contactId) {
                                      // Fetch detailed contact info using individual API
                                      const detailedContact = await fetchContactById(contactId.toString());
                                      if (detailedContact?.success && detailedContact.data) {
                                        setSelectedRequest(detailedContact.data);
                                      } else {
                                        setSelectedRequest(request);
                                      }
                                    } else {
                                      setSelectedRequest(request);
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Job Request Details</DialogTitle>
                                <DialogDescription>View detailed information about this job request</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Request ID</Label>
                                      <p className="text-gray-900">{selectedRequest.id || selectedRequest.contact_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedRequest.status || 'new')}</div>
                                    </div>
                                    <div>
                                      <Label>Company/Name</Label>
                                      <p className="text-gray-900">{getFullName(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Mobile</Label>
                                      <p className="text-gray-900">{getContactNumber(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-gray-900">{getEmail(selectedRequest)}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Experience & Requirements</Label>
                                      <p className="text-gray-900">{getMessage(selectedRequest)}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job Request</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this job request from {getFullName(request)}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex justify-end gap-2">
                                <AlertDialogCancel className="mr-2">Cancel</AlertDialogCancel>
                                <Button
                                  onClick={() => handleDeleteJob(request)}
                                  variant="destructive"
                                  // className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No job requests found. Check your API connection or contact data.
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3 p-4">
                {paginatedJobRequests.map((request: any) => (
                  <Card key={request.id || request.contact_id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-1">ID: {request.id || request.contact_id || 'N/A'}</p>
                            <p className="font-medium text-sm truncate">{getFullName(request)}</p>
                            <p className="text-xs text-gray-600 truncate">{getEmail(request)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {getStatusBadge(request.status || 'new')}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t">
                          <div>
                            <p className="text-gray-500 mb-1">Mobile</p>
                            <p className="text-gray-900 font-medium">{getContactNumber(request)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Date</p>
                            <p className="text-gray-900 font-medium">{getCreatedDate(request)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs"
                                onClick={async () => {
                                  const contactId = request.id || request.contact_id;
                                  if (contactId) {
                                    const detailedContact = await fetchContactById(contactId.toString());
                                    if (detailedContact?.success && detailedContact.data) {
                                      setSelectedRequest(detailedContact.data);
                                    } else {
                                      setSelectedRequest(request);
                                    }
                                  } else {
                                    setSelectedRequest(request);
                                  }
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Job Request Details</DialogTitle>
                                <DialogDescription>View detailed information about this job request</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Request ID</Label>
                                      <p className="text-gray-900">{selectedRequest.id || selectedRequest.contact_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedRequest.status || 'new')}</div>
                                    </div>
                                    <div>
                                      <Label>Company/Name</Label>
                                      <p className="text-gray-900">{getFullName(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Mobile</Label>
                                      <p className="text-gray-900">{getContactNumber(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-gray-900">{getEmail(selectedRequest)}</p>
                                    </div>
                                    <div className="col-span-full">
                                      <Label>Experience & Requirements</Label>
                                      <p className="text-gray-900">{getMessage(selectedRequest)}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="flex-1 text-xs text-red-600">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this job request.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJobRequest(request.id || request.contact_id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {jobRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No job requests found. Check your API connection or contact data.</p>
                  </div>
                )}
              </div>
              
              {/* Desktop Pagination Controls */}
              {jobRequests.length > itemsPerPage && (
                <div className="hidden md:flex items-center justify-between gap-4 p-4 border-t">
                  <div className="text-sm text-gray-700">
                    Showing {jobStartIndex + 1} to {Math.min(jobEndIndex, jobRequests.length)} of {jobRequests.length} job requests
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJobPageChange(jobCurrentPage - 1)}
                      disabled={jobCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {getJobPageNumbers().map((page, index) => {
                        if (page === '...') {
                          return <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>;
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={jobCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleJobPageChange(page as number)}
                            className="min-w-[32px]"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJobPageChange(jobCurrentPage + 1)}
                      disabled={jobCurrentPage === jobTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Partnership Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSupplierRequests.map((request: any) => (
                    <TableRow key={request.id || request.contact_id}>
                      <TableCell>{request.id || request.contact_id || 'N/A'}</TableCell>
                      <TableCell>{getFullName(request)}</TableCell>
                      <TableCell>{getContactNumber(request)}</TableCell>
                      <TableCell>{getEmail(request)}</TableCell>
                      <TableCell>{getStatusBadge(request.status || 'new')}</TableCell>
                      <TableCell>{getCreatedDate(request)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  const contactId = request.id || request.contact_id;
                                  if (contactId) {
                                    // Fetch detailed contact info using individual API
                                    const detailedContact = await fetchContactById(contactId.toString());
                                    if (detailedContact?.success && detailedContact.data) {
                                      setSelectedRequest(detailedContact.data);
                                    } else {
                                      setSelectedRequest(request);
                                    }
                                  } else {
                                    setSelectedRequest(request);
                                  }
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Supplier Request Details</DialogTitle>
                                <DialogDescription>View detailed information about this supplier request</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Request ID</Label>
                                      <p className="text-gray-900">{selectedRequest.id || selectedRequest.contact_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedRequest.status || 'new')}</div>
                                    </div>
                                    <div>
                                      <Label>Company Name</Label>
                                      <p className="text-gray-900">{getFullName(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Contact</Label>
                                      <p className="text-gray-900">{getContactNumber(selectedRequest)}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-gray-900">{getEmail(selectedRequest)}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Products & Services</Label>
                                      <p className="text-gray-900">{getMessage(selectedRequest)}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Supplier Request</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this supplier request from {getFullName(request)}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex justify-end gap-2">
                                <AlertDialogCancel className="mr-2">Cancel</AlertDialogCancel>
                                <Button
                                  onClick={() => handleDeleteSupplier(request)}
                                  variant="destructive"
                                  // className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {supplierRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No supplier requests found. Check your API connection or contact data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Supplier Requests Pagination Controls */}
              {supplierRequests.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                  <div className="text-sm text-gray-700">
                    Showing {supplierStartIndex + 1} to {Math.min(supplierEndIndex, supplierRequests.length)} of {supplierRequests.length} supplier requests
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSupplierPageChange(supplierCurrentPage - 1)}
                      disabled={supplierCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {getSupplierPageNumbers().map((page, index) => {
                        if (page === '...') {
                          return <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>;
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={supplierCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSupplierPageChange(page as number)}
                            className="min-w-[32px]"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSupplierPageChange(supplierCurrentPage + 1)}
                      disabled={supplierCurrentPage === supplierTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
