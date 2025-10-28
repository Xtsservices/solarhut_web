import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { mockEnquiries, mockFieldExecutives } from '../../lib/mockData';
import { Eye, Search, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

interface AssignedEnquiriesProps {
  onScheduleClick?: (enquiry: any) => void;
}

export function AssignedEnquiries({ onScheduleClick }: AssignedEnquiriesProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('assigned');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Schedule work form state
  const [formData, setFormData] = useState({
    workDate: '',
    workTime: '',
    address: '',
    quotationAmount: '',
    fieldExecutiveId: '',
    remarks: '',
  });

  // Filter enquiries assigned to sales person SP001 (Rahul Verma)
  const assignedEnquiries = mockEnquiries.filter(
    (e) => e.salesPersonId === 'SP001' && e.type === 'enquiry'
  );

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

  const filteredEnquiries = assignedEnquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.mobile.includes(searchTerm) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesDate = !dateFilter || 
      new Date(enquiry.createdAt).toDateString() === dateFilter.toDateString();
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleScheduleSubmit = () => {
    if (!formData.workDate || !formData.workTime || !formData.quotationAmount || !formData.fieldExecutiveId) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Work scheduled successfully! Field executive has been notified.');
    
    // Reset form
    setFormData({
      workDate: '',
      workTime: '',
      address: '',
      quotationAmount: '',
      fieldExecutiveId: '',
      remarks: '',
    });
    setShowScheduleForm(false);
    setViewDialogOpen(false);
  };

  const availableExecutives = mockFieldExecutives.filter(
    (fe) => fe.status === 'available' || fe.status === 'on-job'
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1 sm:mb-2">Assigned Enquiries</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage your assigned customer enquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-gray-600 text-xs mb-0.5">Total</p>
            <p className="text-gray-900">{assignedEnquiries.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-gray-600 text-xs mb-0.5">Pending</p>
            <p className="text-gray-900">
              {assignedEnquiries.filter((e) => e.status === 'assigned').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-gray-600 text-xs mb-0.5">Scheduled</p>
            <p className="text-gray-900">
              {assignedEnquiries.filter((e) => e.status === 'scheduled').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 sm:justify-end">
          {/* Search */}
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
          
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none sm:w-48">
            <Label className="text-sm">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="flex-none w-56">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left',
                    !dateFilter && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enquiries ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>KV</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>{enquiry.id}</TableCell>
                  <TableCell>{enquiry.fullName}</TableCell>
                  <TableCell>{enquiry.mobile}</TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.address}</TableCell>
                  <TableCell>{enquiry.kv}</TableCell>
                  <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setViewDialogOpen(true);
                        setShowScheduleForm(false);
                        setFormData({
                          workDate: '',
                          workTime: '',
                          address: enquiry.address,
                          quotationAmount: '',
                          fieldExecutiveId: '',
                          remarks: '',
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog with Schedule Work Integration */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>View detailed information and schedule work</DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-6">
              {/* Enquiry Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Enquiry ID</Label>
                  <p className="text-gray-900">{selectedEnquiry.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedEnquiry.status)}</div>
                </div>
                <div>
                  <Label>Full Name</Label>
                  <p className="text-gray-900">{selectedEnquiry.fullName}</p>
                </div>
                <div>
                  <Label>Mobile</Label>
                  <p className="text-gray-900">{selectedEnquiry.mobile}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-gray-900">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <Label>System Size</Label>
                  <p className="text-gray-900">{selectedEnquiry.kv}</p>
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <p className="text-gray-900">{selectedEnquiry.address}</p>
                </div>
                <div className="col-span-2">
                  <Label>Message</Label>
                  <p className="text-gray-900">{selectedEnquiry.message}</p>
                </div>
              </div>

              {/* Schedule Work Section - Only for 'assigned' status */}
              {selectedEnquiry.status === 'assigned' && (
                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      onClick={() => setShowScheduleForm(!showScheduleForm)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Schedule Work
                      </div>
                      {showScheduleForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    
                    {showScheduleForm && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="enquiryId">Enquiry ID</Label>
                            <Input
                              id="enquiryId"
                              value={selectedEnquiry.id}
                              disabled
                              className="bg-white"
                            />
                          </div>

                          <div>
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input
                              id="clientName"
                              value={selectedEnquiry.fullName}
                              disabled
                              className="bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="workDate">Work Date *</Label>
                            <Input
                              id="workDate"
                              type="date"
                              value={formData.workDate}
                              onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="workTime">Time *</Label>
                            <Input
                              id="workTime"
                              type="time"
                              value={formData.workTime}
                              onChange={(e) => setFormData({ ...formData, workTime: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">Full Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Installation address"
                          />
                        </div>

                        <div>
                          <Label htmlFor="quotationAmount">Quotation Amount (₹) *</Label>
                          <Input
                            id="quotationAmount"
                            type="number"
                            value={formData.quotationAmount}
                            onChange={(e) => setFormData({ ...formData, quotationAmount: e.target.value })}
                            placeholder="180000"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="fieldExecutive">Assign to Field Executive *</Label>
                          <Select
                            value={formData.fieldExecutiveId}
                            onValueChange={(value) => setFormData({ ...formData, fieldExecutiveId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field executive..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableExecutives.map((fe) => (
                                <SelectItem key={fe.id} value={fe.id}>
                                  {fe.name} - {fe.status === 'available' ? '✓ Available' : 'On Job'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="remarks">Remarks / Special Instructions</Label>
                          <Textarea
                            id="remarks"
                            rows={3}
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            placeholder="Any special instructions for the field executive..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleScheduleSubmit} className="flex-1">
                            Schedule Work
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowScheduleForm(false);
                              setFormData({
                                workDate: '',
                                workTime: '',
                                address: selectedEnquiry.address,
                                quotationAmount: '',
                                fieldExecutiveId: '',
                                remarks: '',
                              });
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
