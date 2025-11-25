import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { mockEnquiries, mockSalesPersons, mockFieldExecutives } from '../../lib/mockData';
import { Search, ArrowRight } from 'lucide-react';

export function WorkProgressPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const progressData = mockEnquiries
    .filter((e) => e.salesPersonId || e.fieldExecutiveId)
    .map((enquiry) => {
      const salesPerson = mockSalesPersons.find((sp) => sp.id === enquiry.salesPersonId);
      const fieldExecutive = mockFieldExecutives.find((fe) => fe.id === enquiry.fieldExecutiveId);
      
      return {
        ...enquiry,
        salesPersonName: salesPerson?.name || '-',
        fieldExecutiveName: fieldExecutive?.name || '-',
      };
    });

  const filteredData = progressData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-gray-200',
      assigned: 'bg-blue-200',
      scheduled: 'bg-orange-200',
      completed: 'bg-green-200',
    };
    return colors[status] || colors.new;
  };

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

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Work Progress</h1>
        <p className="text-gray-600">Track complete workflow from enquiry to completion</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="w-full max-w-md">
            <Label className="text-sm font-medium">Search by ID or Name</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Timeline Cards */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{item.id}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {item.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.mobile}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-sm text-gray-600">System Size</p>
                    <p className="font-semibold text-gray-900">{item.kv}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Mobile Timeline - Vertical */}
                  <div className="block md:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1">
                        <div className={`p-3 rounded-lg ${getStatusColor(item.status)}`}>
                          <p className="text-sm font-medium">Enquiry Received</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {item.salesPersonId && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-orange-500 mt-2"></div>
                        <div className="flex-1">
                          <div className={`p-3 rounded-lg ${getStatusColor(item.status)}`}>
                            <p className="text-sm font-medium">Sales Assigned</p>
                            <p className="text-xs text-gray-600 mt-1">{item.salesPersonName}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {item.fieldExecutiveId && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
                        <div className="flex-1">
                          <div className={`p-3 rounded-lg ${getStatusColor(item.status)}`}>
                            <p className="text-sm font-medium">Field Assigned</p>
                            <p className="text-xs text-gray-600 mt-1">{item.fieldExecutiveName}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {item.status === 'completed' && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-500 mt-2"></div>
                        <div className="flex-1">
                          <div className="p-3 rounded-lg bg-green-200">
                            <p className="text-sm font-medium">Completed</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop Timeline - Horizontal */}
                  <div className="hidden md:flex items-center gap-2">
                    {/* Enquiry */}
                    <div className="flex-1">
                      <div className={`p-3 rounded-lg ${getStatusColor(item.status)}`}>
                        <p className="text-sm font-medium">Enquiry Received</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

                    {/* Sales */}
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          item.salesPersonId ? getStatusColor(item.status) : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm font-medium">Sales Assigned</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {item.salesPersonName}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

                    {/* Field */}
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          item.fieldExecutiveId ? getStatusColor(item.status) : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm font-medium">Field Assigned</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {item.fieldExecutiveName}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />

                    {/* Completion */}
                    <div className="flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          item.status === 'completed' ? 'bg-green-200' : 'bg-gray-100'
                        }`}
                      >
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.status === 'completed'
                            ? item.paymentStatus === 'paid'
                              ? 'Paid'
                              : 'Pending Payment'
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {(item.quotationAmount || item.workDate || item.paymentStatus) && (
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {item.quotationAmount && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="text-gray-600 font-medium">Quotation:</span>
                          <span className="text-gray-900 font-semibold">
                            ₹{item.quotationAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {item.workDate && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="text-gray-600 font-medium">Work Date:</span>
                          <span className="text-gray-900">
                            {new Date(item.workDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.paymentStatus && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="text-gray-600 font-medium">Payment:</span>
                          <Badge
                            variant="outline"
                            className={
                              item.paymentStatus === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }
                          >
                            {item.paymentStatus}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No progress data found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
