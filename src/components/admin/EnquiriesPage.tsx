import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { mockEnquiries, mockSalesPersons, mockFieldExecutives } from '../../lib/mockData';
import { Eye, UserPlus, Search, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(mockEnquiries.filter(e => e.type === 'enquiry'));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('new');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: 'secondary', label: 'New' },
      assigned: { variant: 'default', label: 'Assigned' },
      scheduled: { variant: 'outline', label: 'Scheduled' },
      completed: { variant: 'default', label: 'Completed' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.mobile.includes(searchTerm) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesDate = !dateFilter || 
      new Date(enquiry.createdAt).toDateString() === dateFilter.toDateString();
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleAssign = () => {
    if (!selectedSalesPerson) {
      toast.error('Please select a sales person');
      return;
    }
    toast.success('Enquiry assigned successfully');
    setShowAssignForm(false);
    setSelectedSalesPerson('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1 sm:mb-2">Enquiries</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage all customer enquiries</p>
      </div>

      <div className="space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 sm:justify-end">
          <div className="flex-1 sm:flex-none sm:w-64">
            <Label className="text-sm">Search</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 sm:flex-none sm:w-48">
            <Label className="text-sm">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 sm:flex-none sm:w-56">
            <Label className="text-sm">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left mt-1 text-sm',
                    !dateFilter && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Card className="hidden md:block">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="text-base sm:text-lg">All Enquiries ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Mobile</TableHead>
                  <TableHead className="text-xs sm:text-sm">KV</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="text-xs sm:text-sm">{enquiry.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{enquiry.fullName}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{enquiry.mobile}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{enquiry.kv}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{getStatusBadge(enquiry.status)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setSelectedEnquiry(enquiry);
                          setViewDialogOpen(true);
                          setShowAssignForm(false);
                          setSelectedSalesPerson('');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-2">
        <div className="bg-white rounded-lg border p-2 mb-2">
          <p className="text-xs text-gray-600">Total: <span className="font-medium text-gray-900">{filteredEnquiries.length}</span> enquiries</p>
        </div>
        {filteredEnquiries.map((enquiry) => (
          <Card key={enquiry.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{enquiry.id}</p>
                    <p className="font-medium text-sm mt-0.5 truncate">{enquiry.fullName}</p>
                  </div>
                  {getStatusBadge(enquiry.status)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                  <div>
                    <p className="text-gray-500 mb-0.5">Mobile</p>
                    <p className="text-gray-900 font-medium">{enquiry.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-0.5">Capacity</p>
                    <p className="text-gray-900 font-medium">{enquiry.kv}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 pt-1">
                  {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-1 h-8 text-xs"
                  onClick={() => {
                    setSelectedEnquiry(enquiry);
                    setViewDialogOpen(true);
                    setShowAssignForm(false);
                    setSelectedSalesPerson('');
                  }}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="text-base sm:text-lg">Enquiry Details</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">View and manage enquiry information</DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (() => {
            const salesPerson = mockSalesPersons.find(sp => sp.id === selectedEnquiry.salesPersonId);
            const fieldExecutive = mockFieldExecutives.find(fe => fe.id === selectedEnquiry.fieldExecutiveId);
            
            return (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs sm:text-sm">Enquiry ID</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Full Name</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Mobile</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.mobile}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Email</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 break-all">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">System Size</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.kv}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm">Address</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.address}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm">Message</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.message}</p>
                  </div>
                  
                  {/* Show Sales Person for assigned, scheduled, and completed */}
                  {(selectedEnquiry.status === 'assigned' || 
                    selectedEnquiry.status === 'scheduled' || 
                    selectedEnquiry.status === 'completed') && salesPerson && (
                    <div className="col-span-2">
                      <Label>Assigned Sales Person</Label>
                      <p className="text-gray-900">{salesPerson.name}</p>
                    </div>
                  )}
                  
                  {/* Show quotation amount for assigned, scheduled, and completed */}
                  {selectedEnquiry.quotationAmount && (
                    <div>
                      <Label>Quotation Amount</Label>
                      <p className="text-gray-900">
                        ₹{selectedEnquiry.quotationAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {/* Show Field Executive and Work Details for scheduled and completed */}
                  {(selectedEnquiry.status === 'scheduled' || selectedEnquiry.status === 'completed') && (
                    <>
                      {fieldExecutive && (
                        <div>
                          <Label>Field Executive</Label>
                          <p className="text-gray-900">{fieldExecutive.name}</p>
                        </div>
                      )}
                      {selectedEnquiry.workDate && (
                        <div>
                          <Label>Work Date</Label>
                          <p className="text-gray-900">
                            {new Date(selectedEnquiry.workDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {selectedEnquiry.workTime && (
                        <div>
                          <Label>Work Time</Label>
                          <p className="text-gray-900">{selectedEnquiry.workTime}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Show Payment Status for scheduled and completed */}
                  {(selectedEnquiry.status === 'scheduled' || selectedEnquiry.status === 'completed') && (
                    <div>
                      <Label>Payment Status</Label>
                      <div>
                        {selectedEnquiry.paymentStatus === 'paid' ? (
                          <Badge className="bg-green-100 text-green-700">Paid</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedEnquiry.status === 'new' && (
                <div className="pt-4 border-t">
                  {/* Assign to Sales Person - Only show for 'new' enquiries */}
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowAssignForm(!showAssignForm);
                      }}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Assign to Sales Person
                      </div>
                      {showAssignForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    
                    {showAssignForm && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div>
                          <Label>Select Sales Person</Label>
                          <Select value={selectedSalesPerson} onValueChange={setSelectedSalesPerson}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose sales person..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mockSalesPersons.map((sp) => (
                                <SelectItem key={sp.id} value={sp.id}>
                                  {sp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAssign} className="flex-1">
                            Assign Enquiry
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowAssignForm(false);
                              setSelectedSalesPerson('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
