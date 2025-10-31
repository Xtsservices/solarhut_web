import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { mockEnquiries } from '../../lib/mockData';
import { Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function JobRequestsPage() {
  const [jobRequests, setJobRequests] = useState(
    mockEnquiries.filter((e: any) => e.type === 'job')
  );
  const [supplierRequests, setSupplierRequests] = useState(
    mockEnquiries.filter((e: any) => e.type === 'supplier')
  );
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Job & Supplier Requests</h1>
        <p className="text-gray-600">Manage partnership and job requests</p>
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
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.fullName}</TableCell>
                      <TableCell>{request.mobile}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.address}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
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
                                      <p className="text-gray-900">{selectedRequest.id}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedRequest.status)}</div>
                                    </div>
                                    <div>
                                      <Label>Company/Name</Label>
                                      <p className="text-gray-900">{selectedRequest.fullName}</p>
                                    </div>
                                    <div>
                                      <Label>Mobile</Label>
                                      <p className="text-gray-900">{selectedRequest.mobile}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-gray-900">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <Label>Location</Label>
                                      <p className="text-gray-900">{selectedRequest.address}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Experience & Requirements</Label>
                                      <p className="text-gray-900">{selectedRequest.message}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteJob(request.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.fullName}</TableCell>
                      <TableCell>{request.mobile}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.address}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
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
                                      <p className="text-gray-900">{selectedRequest.id}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedRequest.status)}</div>
                                    </div>
                                    <div>
                                      <Label>Company Name</Label>
                                      <p className="text-gray-900">{selectedRequest.fullName}</p>
                                    </div>
                                    <div>
                                      <Label>Contact</Label>
                                      <p className="text-gray-900">{selectedRequest.mobile}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-gray-900">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <Label>Address</Label>
                                      <p className="text-gray-900">{selectedRequest.address}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Products & Services</Label>
                                      <p className="text-gray-900">{selectedRequest.message}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSupplier(request.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
