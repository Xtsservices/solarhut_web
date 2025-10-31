import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { mockEnquiries } from '../../lib/mockData';
import { Eye, Play, CheckCircle2, Search, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

export function AssignedJobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('assigned');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // Filter jobs assigned to field executive FE001 (Manoj Kumar)
  let assignedJobs = mockEnquiries.filter(
    (e) => e.fieldExecutiveId === 'FE001' && e.type === 'enquiry'
  );

  // Apply filters
  if (statusFilter !== 'all') {
    assignedJobs = assignedJobs.filter((job) => job.status === statusFilter);
  }

  if (searchTerm) {
    assignedJobs = assignedJobs.filter(
      (job) =>
        job.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (dateFilter) {
    assignedJobs = assignedJobs.filter((job) => {
      if (!job.workDate) return false;
      const jobDate = new Date(job.workDate);
      return (
        jobDate.getDate() === dateFilter.getDate() &&
        jobDate.getMonth() === dateFilter.getMonth() &&
        jobDate.getFullYear() === dateFilter.getFullYear()
      );
    });
  }

  // Get all assigned jobs for stats (without filters)
  const allAssignedJobs = mockEnquiries.filter(
    (e) => e.fieldExecutiveId === 'FE001' && e.type === 'enquiry'
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      assigned: { variant: 'default', label: 'Assigned', color: 'bg-yellow-100 text-yellow-700' },
      scheduled: { variant: 'default', label: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
      completed: { variant: 'default', label: 'Completed', color: 'bg-green-100 text-green-700' },
    };
    const config = variants[status] || variants.assigned;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentBadge = (status?: string) => {
    if (status === 'paid') {
      return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>;
  };

  const handleStartWork = () => {
    toast.success('Work started! Status updated.');
  };

  const handleCompleteWork = () => {
    if (!completionNotes) {
      toast.error('Please add completion notes');
      return;
    }
    toast.success('Work marked as completed! Admin has been notified.');
    setCompletionNotes('');
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
            <p className="text-gray-900">{allAssignedJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Assigned</p>
            <p className="text-gray-900">
              {allAssignedJobs.filter((j) => j.status === 'assigned').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Scheduled</p>
            <p className="text-gray-900">
              {allAssignedJobs.filter((j) => j.status === 'scheduled').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Completed</p>
            <p className="text-gray-900">
              {allAssignedJobs.filter((j) => j.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-end gap-4 justify-end">
          {/* Search */}
          <div className="flex-none w-64">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex-none w-48">
            <Label>Status</Label>
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
            <Label>Work Date</Label>
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
          <CardTitle>Job List ({assignedJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>KV</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No jobs found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                assignedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.fullName}</TableCell>
                  <TableCell className="max-w-xs truncate">{job.address}</TableCell>
                  <TableCell>{job.kv}</TableCell>
                  <TableCell>
                    {job.workDate ? new Date(job.workDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{getPaymentBadge(job.paymentStatus)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedJob(job);
                            setCompletionNotes('');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Job Details</DialogTitle>
                          <DialogDescription>View and manage this job</DialogDescription>
                        </DialogHeader>
                        {selectedJob && (
                          <div className="space-y-6">
                            {/* Job Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Job ID</Label>
                                <p className="text-gray-900">{selectedJob.id}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div>{getStatusBadge(selectedJob.status)}</div>
                              </div>
                              <div>
                                <Label>Client Name</Label>
                                <p className="text-gray-900">{selectedJob.fullName}</p>
                              </div>
                              <div>
                                <Label>Mobile</Label>
                                <p className="text-gray-900">{selectedJob.mobile}</p>
                              </div>
                              <div>
                                <Label>System Size</Label>
                                <p className="text-gray-900">{selectedJob.kv}</p>
                              </div>
                              <div>
                                <Label>Work Date</Label>
                                <p className="text-gray-900">
                                  {selectedJob.workDate
                                    ? new Date(selectedJob.workDate).toLocaleDateString()
                                    : '-'}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <Label>Address</Label>
                                <p className="text-gray-900">{selectedJob.address}</p>
                              </div>
                              {selectedJob.quotationAmount && (
                                <div className="col-span-2">
                                  <Label>Quotation Amount</Label>
                                  <p className="text-gray-900">
                                    ₹{selectedJob.quotationAmount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                              <div className="col-span-2">
                                <Label>Payment Status</Label>
                                <div>{getPaymentBadge(selectedJob.paymentStatus)}</div>
                              </div>
                            </div>

                            {/* Action Section */}
                            {selectedJob.status !== 'completed' && (
                              <div className="border-t pt-6 space-y-4">
                                {selectedJob.status === 'scheduled' ? (
                                  <>
                                    <h3 className="text-gray-900">Start Work</h3>
                                    <p className="text-gray-600 text-sm">
                                      Mark this job as started to begin work
                                    </p>
                                    <Button onClick={handleStartWork} className="w-full">
                                      <Play className="h-4 w-4 mr-2" />
                                      Start Work
                                    </Button>
                                  </>
                                ) : selectedJob.status === 'assigned' ? (
                                  <>
                                    <h3 className="text-gray-900">Mark as Done</h3>
                                    <div>
                                      <Label>Completion Notes</Label>
                                      <Textarea
                                        rows={4}
                                        value={completionNotes}
                                        onChange={(e) => setCompletionNotes(e.target.value)}
                                        placeholder="Add notes about the completed work..."
                                      />
                                    </div>
                                    <div>
                                      <Label>Upload Photos (Optional)</Label>
                                      <Input type="file" multiple accept="image/*" />
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                      <p className="text-sm text-orange-900">
                                        ⚠️ Payment Status: {selectedJob.paymentStatus === 'paid' ? 'Paid ✓' : 'Pending'}
                                      </p>
                                      <p className="text-xs text-orange-700 mt-1">
                                        {selectedJob.paymentStatus === 'paid' 
                                          ? 'You can submit completion.'
                                          : 'Please wait for payment confirmation before submitting.'}
                                      </p>
                                    </div>
                                    <Button
                                      onClick={handleCompleteWork}
                                      className="w-full"
                                      disabled={selectedJob.paymentStatus !== 'paid'}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Submit Completion
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
