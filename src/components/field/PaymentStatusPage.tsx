import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { mockEnquiries } from '../../lib/mockData';
import { IndianRupee, CheckCircle2, Clock } from 'lucide-react';

export function PaymentStatusPage() {
  // Filter jobs assigned to field executive FE001
  const jobs = mockEnquiries.filter(
    (e) => e.fieldExecutiveId === 'FE001' && e.quotationAmount && e.type === 'enquiry'
  );

  const totalPaid = jobs
    .filter((j) => j.paymentStatus === 'paid')
    .reduce((sum, j) => sum + (j.quotationAmount || 0), 0);

  const totalPending = jobs
    .filter((j) => j.paymentStatus === 'pending')
    .reduce((sum, j) => sum + (j.quotationAmount || 0), 0);

  const getPaymentBadge = (status?: string) => {
    if (status === 'paid') {
      return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Payment Status</h1>
        <p className="text-gray-600">Track payment status for your completed jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Jobs</p>
                <p className="text-gray-900">{jobs.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Work Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.fullName}</TableCell>
                  <TableCell>{job.mobile}</TableCell>
                  <TableCell>
                    ₹{job.quotationAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {job.workDate ? new Date(job.workDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={job.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPaymentBadge(job.paymentStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {jobs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No payment records found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Note */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <IndianRupee className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Payment Information</h3>
              <p className="text-gray-600 text-sm">
                Payments are processed by the admin after job verification. You can only submit
                work completion once the payment status shows as "Paid". For any payment-related
                queries, please contact the admin office.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
