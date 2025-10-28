import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { mockEnquiries } from '../../lib/mockData';
import { CheckCircle2, Clock, Eye, Search, IndianRupee } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PaymentsPage() {
  const [payments, setPayments] = useState(
    mockEnquiries.filter((e) => e.quotationAmount && e.quotationAmount > 0)
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.mobile.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const updatePaymentStatus = (id: string, status: 'paid' | 'pending', amount?: string) => {
    if (status === 'paid' && !amount) {
      toast.error('Please enter the paid amount');
      return;
    }

    const paidAmountNum = amount ? Number(amount) : undefined;

    setPayments(
      payments.map((p) => 
        p.id === id 
          ? { ...p, paymentStatus: status, paidAmount: paidAmountNum } 
          : p
      )
    );
    toast.success(`Payment marked as ${status}${amount ? ` - ₹${Number(amount).toLocaleString()}` : ''}`);
    
    // Update selected payment if it's currently being viewed
    if (selectedPayment && selectedPayment.id === id) {
      setSelectedPayment({ 
        ...selectedPayment, 
        paymentStatus: status,
        paidAmount: paidAmountNum 
      });
    }
    // Reset amount after marking as paid
    setPaidAmount('');
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setPaidAmount('');
    setViewDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setViewDialogOpen(open);
    if (!open) {
      setPaidAmount('');
    }
  };

  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (p.quotationAmount || 0), 0);

  const totalPending = payments
    .filter((p) => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + (p.quotationAmount || 0), 0);

  const getPaymentBadge = (status?: string) => {
    if (status === 'paid') {
      return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Track and manage payment status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Paid</p>
                <p className="text-gray-900">₹{(totalPaid / 100000).toFixed(2)}L</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Pending</p>
                <p className="text-gray-900">₹{(totalPending / 100000).toFixed(2)}L</p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Paid Count</p>
            <p className="text-gray-900">
              {payments.filter((p) => p.paymentStatus === 'paid').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Pending Count</p>
            <p className="text-gray-900">
              {payments.filter((p) => p.paymentStatus === 'pending').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex items-end gap-4 justify-end">
          {/* Search */}
          <div className="flex-none w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-none w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enquiry ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.fullName}</TableCell>
                  <TableCell>{payment.mobile}</TableCell>
                  <TableCell>
                    ₹{payment.quotationAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>{getPaymentBadge(payment.paymentStatus)}</TableCell>
                  <TableCell>
                    {payment.workDate
                      ? new Date(payment.workDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewPayment(payment)}
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

      {/* View Payment Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Complete information about the payment</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Status Section */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    {getPaymentBadge(selectedPayment.paymentStatus)}
                  </div>
                </div>

                {/* Amount Input for Pending Payments */}
                {selectedPayment.paymentStatus === 'pending' && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-600">Enter Paid Amount</Label>
                      <div className="relative mt-1">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        updatePaymentStatus(selectedPayment.id, 'paid', paidAmount);
                      }}
                      disabled={!paidAmount || Number(paidAmount) <= 0}
                      className="w-full"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                  </div>
                )}

                {/* Display Paid Amount for Paid Payments */}
                {selectedPayment.paymentStatus === 'paid' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                          <p className="text-green-600">
                            {selectedPayment.paidAmount 
                              ? selectedPayment.paidAmount.toLocaleString()
                              : selectedPayment.quotationAmount?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Payment has been completed. No further actions available.
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Enquiry ID</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Full Name</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Mobile Number</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.mobile}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.email}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600">Address</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.address}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Quotation Amount</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <IndianRupee className="h-4 w-4 text-gray-600" />
                      <p className="text-gray-900">
                        {selectedPayment.quotationAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Payment Status</Label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {selectedPayment.paymentStatus || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Work Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Work Date</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedPayment.workDate
                        ? new Date(selectedPayment.workDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Work Time</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedPayment.workTime || 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <p className="text-gray-900 mt-1 capitalize">{selectedPayment.status}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Type</Label>
                    <p className="text-gray-900 mt-1">{selectedPayment.installationType}</p>
                  </div>
                  {selectedPayment.remarks && (
                    <div className="col-span-2">
                      <Label className="text-gray-600">Remarks</Label>
                      <p className="text-gray-900 mt-1">{selectedPayment.remarks}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Information */}
              {(selectedPayment.salesPersonId || selectedPayment.fieldExecutiveId) && (
                <div>
                  <h3 className="text-gray-900 mb-4">Assignment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPayment.salesPersonId && (
                      <div>
                        <Label className="text-gray-600">Sales Person ID</Label>
                        <p className="text-gray-900 mt-1">{selectedPayment.salesPersonId}</p>
                      </div>
                    )}
                    {selectedPayment.fieldExecutiveId && (
                      <div>
                        <Label className="text-gray-600">Field Executive ID</Label>
                        <p className="text-gray-900 mt-1">
                          {selectedPayment.fieldExecutiveId}
                        </p>
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
