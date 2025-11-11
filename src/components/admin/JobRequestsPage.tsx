import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../website/ip';

export function JobRequestsPage() {
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [supplierRequests, setSupplierRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // For now, show all contacts in both tabs to see the data structure
        // Later we can filter by specific fields once we know the data structure
        console.log('📋 All contacts data:', result.data);
        
        // Show all contacts in both tabs for debugging
        setJobRequests(result.data);
        setSupplierRequests(result.data);
        
        console.log('🎯 All contacts loaded:', result.data.length);
        
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

  // Fetch data on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Helper function to get full name from various name fields
  const getFullName = (contact: any) => {
    // Try direct full name fields first
    if (contact.fullName) return contact.fullName;
    if (contact.full_name) return contact.full_name;
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
    const date = contact.createdAt || contact.created_at || contact.date_created || contact.date;
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

  const handleDeleteJob = (id: string) => {
    setJobRequests(jobRequests.filter((r: any) => r.id !== id));
    toast.success('Job request deleted');
  };

  const handleDeleteSupplier = (id: string) => {
    setSupplierRequests(supplierRequests.filter((r: any) => r.id !== id));
    toast.success('Supplier request deleted');
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
        <h1 className="text-gray-900 mb-2">Job & Supplier Requests</h1>
        <p className="text-gray-600">Manage partnership and job requests</p>
        {/* Debug info */}
        <div className="mt-2 text-sm text-blue-600">
          Debug: API Endpoint: {API_BASE_URL}/api/contacts
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
            <CardContent>
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
                  {jobRequests.map((request: any) => (
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
                                onClick={() => setSelectedRequest(request)}
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteJob(request.id || request.contact_id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
                  {supplierRequests.map((request: any) => (
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
                                onClick={() => setSelectedRequest(request)}
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSupplier(request.id || request.contact_id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
