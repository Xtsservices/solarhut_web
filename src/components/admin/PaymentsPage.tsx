import { useState,useEffect } from 'react';
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
// ⭐ CHANGED
import { getPaymentStats, getPaymentsList } from '../../api/api';


export function PaymentsPage() {
  // Payments list from API
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  // ⭐ CHANGED
  const [stats, setStats] = useState({
    today_payments: 0,
    week_payments: 0,
    pending_payments: 0,
  });
  


  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' ? payment.paymentStatus === 'completed' : payment.paymentStatus !== 'completed');

    const matchesSearch =
      searchTerm === '' ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.mobile.includes(searchTerm) ||
      payment.jobCode?.toLowerCase().includes(searchTerm.toLowerCase());

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
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>;
    }
    if (status === 'failed') {
      return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">{status || 'Pending'}</Badge>;
  };
  // ⭐ CHANGED — Fetch stats on load
useEffect(() => {
  fetchStats();
  fetchPaymentsList();
}, []);

const fetchStats = async () => {
  const result = await getPaymentStats();
  if (result.ok && result.data?.data) {
    setStats(result.data.data);
  }
};

const fetchPaymentsList = async () => {
  setIsLoading(true);
  try {
    const result = await getPaymentsList();
    if (result.ok && result.data?.data) {
      const mappedPayments = result.data.data.map((item: any) => ({
        id: item.payment_info?.id?.toString() || '',
        jobId: item.job_info?.job_id?.toString() || '',
        jobCode: item.job_info?.job_code || '',
        fullName: item.customer_info?.customer_name || '',
        mobile: item.customer_info?.customer_mobile || '',
        email: item.customer_info?.customer_email || '',
        customerCode: item.customer_info?.customer_code || '',
        paymentType: item.payment_info?.payment_type || '',
        amount: parseFloat(item.payment_info?.amount) || 0,
        quotationAmount: parseFloat(item.payment_info?.total_amount) || 0,
        discountAmount: parseFloat(item.payment_info?.discount_amount) || 0,
        taxableAmount: parseFloat(item.payment_info?.taxable_amount) || 0,
        gstRate: parseFloat(item.payment_info?.gst_rate) || 0,
        cgstAmount: parseFloat(item.payment_info?.cgst_amount) || 0,
        sgstAmount: parseFloat(item.payment_info?.sgst_amount) || 0,
        igstAmount: parseFloat(item.payment_info?.igst_amount) || 0,
        totalTaxAmount: parseFloat(item.payment_info?.total_tax_amount) || 0,
        paymentMethod: item.payment_info?.payment_method || '',
        paymentStatus: item.payment_info?.payment_status?.toLowerCase() || 'pending',
        transactionId: item.payment_info?.transaction_id || '',
        paymentDate: item.payment_info?.payment_date || null,
        dueDate: item.payment_info?.due_date || null,
        serviceType: item.job_info?.service_type || '',
        solarService: item.job_info?.solar_service || '',
        jobStatus: item.job_info?.job_status || '',
        createdBy: item.processed_by_info?.created_by || '',
        processedBy: item.processed_by_info?.processed_by || '',
        verifiedBy: item.processed_by_info?.verified_by || '',
        createdAt: item.payment_info?.created_at || null,
      }));
      setPayments(mappedPayments);
    }
  } catch (err) {
    console.error('Error fetching payments:', err);
    toast.error('Error loading payments');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">Payments</h1>
        <p className="text-sm sm:text-base text-gray-600">Track and manage payment status</p>
      </div>

      {/* Summary Cards */}
      {/* ⭐ CHANGED — STATS CARDS USING API */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">

  {/* Today Payments */}
  <Card>
    <CardContent className="p-4 sm:p-6">
      <p className="text-gray-600 text-sm mb-1">Today Payments</p>
      <p className="text-xl font-semibold text-gray-900">₹{stats.today_payments.toLocaleString()}</p>
    </CardContent>
  </Card>

  {/* Week Payments */}
  <Card>
    <CardContent className="p-4 sm:p-6">
      <p className="text-gray-600 text-sm mb-1">Week Payments</p>
      <p className="text-xl font-semibold text-gray-900">₹{stats.week_payments.toLocaleString()}</p>
    </CardContent>
  </Card>

  {/* Pending Payments */}
  <Card>
    <CardContent className="p-4 sm:p-6">
      <p className="text-gray-600 text-sm mb-1">Pending Payments</p>
      <p className="text-xl font-semibold text-gray-900">{stats.pending_payments}</p>
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
                  <TableHead className="text-xs sm:text-sm">Job Code</TableHead>
                  <TableHead className="text-xs sm:text-sm">Customer Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Mobile</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Payment Method</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Payment Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-xs sm:text-sm">{payment.jobCode}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{payment.fullName}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{payment.mobile}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{payment.quotationAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{payment.paymentMethod}</TableCell>
                    <TableCell>{getPaymentBadge(payment.paymentStatus)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
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
                  ))
                )}
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
        
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Loading payments...</p>
            </CardContent>
          </Card>
        ) : filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No payments found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.fullName}</p>
                    <p className="text-xs text-gray-500">{payment.jobCode}</p>
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
                    <p className="text-gray-500 mb-1">Payment Method</p>
                    <p className="text-gray-900">{payment.paymentMethod || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Payment Date</p>
                    <p className="text-gray-900">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  <div className="col-span-2 flex justify-end">
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
          ))
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
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-xl font-semibold text-gray-900">₹{selectedPayment.quotationAmount?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Completed Payment Info */}
                {selectedPayment.paymentStatus === 'completed' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-5 w-5 text-green-600" />
                          <p className="text-green-600 font-medium">
                            {selectedPayment.quotationAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Payment has been completed.
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><Label className="text-xs sm:text-sm text-gray-600">Customer Code</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.customerCode || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Customer Name</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.fullName}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Mobile Number</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.mobile}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Email</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.email || '-'}</p></div>
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Job Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><Label className="text-xs sm:text-sm text-gray-600">Job Code</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.jobCode || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Service Type</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.serviceType || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Solar Service</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.solarService || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Job Status</Label><p className="text-sm sm:text-base text-gray-900 mt-1 capitalize">{selectedPayment.jobStatus || '-'}</p></div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div><Label className="text-xs sm:text-sm text-gray-600">Payment Type</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.paymentType || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Payment Method</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.paymentMethod || '-'}</p></div>
                  <div><Label className="text-xs sm:text-sm text-gray-600">Transaction ID</Label><p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.transactionId || '-'}</p></div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Payment Date</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">
                      {selectedPayment.paymentDate
                        ? new Date(selectedPayment.paymentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div>
                <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Tax Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Taxable Amount</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">₹{selectedPayment.taxableAmount?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">GST Rate</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.gstRate || 0}%</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">CGST Amount</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">₹{selectedPayment.cgstAmount?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">SGST Amount</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">₹{selectedPayment.sgstAmount?.toLocaleString() || '0'}</p>
                  </div>
                  {selectedPayment.igstAmount > 0 && (
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">IGST Amount</Label>
                      <p className="text-sm sm:text-base text-gray-900 mt-1">₹{selectedPayment.igstAmount?.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600">Total Tax</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">₹{selectedPayment.totalTaxAmount?.toLocaleString() || '0'}</p>
                  </div>
                  {selectedPayment.discountAmount > 0 && (
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">Discount</Label>
                      <p className="text-sm sm:text-base text-green-600 mt-1">-₹{selectedPayment.discountAmount?.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Processed By Information */}
              {(selectedPayment.createdBy || selectedPayment.processedBy || selectedPayment.verifiedBy) && (
                <div>
                  <h3 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Processed By</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {selectedPayment.createdBy && (
                      <div>
                        <Label className="text-xs sm:text-sm text-gray-600">Created By</Label>
                        <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.createdBy}</p>
                      </div>
                    )}
                    {selectedPayment.processedBy && (
                      <div>
                        <Label className="text-xs sm:text-sm text-gray-600">Processed By</Label>
                        <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.processedBy}</p>
                      </div>
                    )}
                    {selectedPayment.verifiedBy && (
                      <div>
                        <Label className="text-xs sm:text-sm text-gray-600">Verified By</Label>
                        <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedPayment.verifiedBy}</p>
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