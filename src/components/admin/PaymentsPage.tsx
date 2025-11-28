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
import { toast } from 'sonner';

export function PaymentsPage() {
  // FIXED: Default paymentStatus to 'pending' if not set + ensure paidAmount exists
  const [payments, setPayments] = useState(
    mockEnquiries
      .filter((e) => e.quotationAmount && e.quotationAmount > 0)
      .map((enquiry) => ({
        ...enquiry,
        paymentStatus: enquiry.paymentStatus || 'pending', // ← CRITICAL FIX: Treat undefined as pending
        paidAmount: enquiry.paidAmount || undefined,
      }))
  );

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');

  const filteredPayments = payments.filter((payment) => {
    // IMPROVED: Use !== 'paid' for pending to catch undefined cases too
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' ? payment.paymentStatus === 'paid' : payment.paymentStatus !== 'paid');

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

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, paymentStatus: status, paidAmount: paidAmountNum }
          : p
      )
    );

    toast.success(`Payment marked as ${status}${amount ? ` - ₹${Number(amount).toLocaleString()}` : ''}`);

    if (selectedPayment && selectedPayment.id === id) {
      setSelectedPayment({
        ...selectedPayment,
        paymentStatus: status,
        paidAmount: paidAmountNum,
      });
    }
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

  // IMPROVED: More accurate paid/pending totals using !== 'paid' logic
  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (p.paidAmount || p.quotationAmount || 0), 0);

  const totalPending = payments
    .filter((p) => p.paymentStatus !== 'paid') // ← Includes undefined & 'pending'
    .reduce((sum, p) => sum + (p.quotationAmount || 0), 0);

  const getPaymentBadge = (status?: string) => {
    if (status === 'paid') {
      return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">Payments</h1>
        <p className="text-sm sm:text-base text-gray-600">Track and manage payment status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Paid</p>
                <p className="text-lg sm:text-xl text-gray-900">₹{(totalPaid / 100000).toFixed(2)}L</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Pending</p>
                <p className="text-lg sm:text-xl text-gray-900">₹{(totalPending / 100000).toFixed(2)}L</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Paid Count</p>
                <p className="text-lg sm:text-xl text-gray-900">
                  {payments.filter((p) => p.paymentStatus === 'paid').length} {/* FIXED: Now correct */}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">Pending Count</p>
                <p className="text-lg sm:text-xl text-gray-900">
                  {payments.filter((p) => p.paymentStatus !== 'paid').length} {/* FIXED: Now shows correct count */}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 sm:justify-end">
          <div className="w-full sm:flex-none sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="w-full sm:flex-none sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden lg:block">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Payment Records ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Enquiry ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">Client Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Mobile</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Work Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-xs sm:text-sm">{payment.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{payment.fullName}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{payment.mobile}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{payment.quotationAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>{getPaymentBadge(payment.paymentStatus)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
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
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Payment Records ({filteredPayments.length})
          </h2>
        </div>
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.fullName}</p>
                    <p className="text-xs text-gray-500">ID: {payment.id}</p>
                  </div>
                  {getPaymentBadge(payment.paymentStatus)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 mb-1">Mobile</p>
                    <p className="text-gray-900">{payment.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Amount</p>
                    <p className="text-gray-900 font-medium">₹{payment.quotationAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Work Date</p>
                    <p className="text-gray-900">
                      {payment.workDate
                        ? new Date(payment.workDate).toLocaleDateString()
                        : 'Not scheduled'}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPayment(payment)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No payments found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[90vw] sm:max-w-2xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">Payment Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Complete information about the payment
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    {getPaymentBadge(selectedPayment.paymentStatus)}
                  </div>
                </div>

                {/* Mark as Paid Form */}
                {selectedPayment.paymentStatus !== 'paid' && (
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

                {/* Paid Confirmation */}
                {selectedPayment.paymentStatus === 'paid' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                          <p className="text-green-600 font-medium">
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

              {/* Rest of the dialog content remains unchanged */}
              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><Label className="text-xs sm:text-sm text-gray-600">Enquiry ID</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.id}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Full Name</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.fullName}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Mobile Number</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.mobile}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Email</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.email}</p></div>
                  <div className="sm:col-span-2"><Label className="text-xs sm:text-sm text-gray-600">Address</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.address}</p></div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Quotation Amount</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <IndianRupee className="h-4 w-4 text-gray-600" />
                      <p className="text-sm sm:text-base text-gray-900 font-medium">
                        {selectedPayment.quotationAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Payment Status</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 capitalize">
                      {selectedPayment.paymentStatus || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Work Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Work Date</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">
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
                    <Label className="text-xs sm:text-sm text-gray-600">Work Time</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">
                      {selectedPayment.workTime || 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Status</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 capitalize">{selectedPayment.status}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Type</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.installationType}</p>
                  </div>
                  {selectedPayment.remarks && (
                    <div className="sm:col-span-2">
                      <Label className="text-xs sm:text-sm text-gray-600">Remarks</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.remarks}</p>
                    </div>
                  )}
                </div>
              </div>

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
                        <p className="text-gray-900 mt-1">{selectedPayment.fieldExecutiveId}</p>
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