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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Work Progress</h1>
        <p className="text-gray-600">Track complete workflow from enquiry to completion</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="w-full max-w-md">
            <Label className="text-sm font-medium mb-2 block">Search by ID or Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID or customer name..."
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className="font-semibold text-lg text-gray-900">#{item.id}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-base font-medium text-gray-700 mb-1">
                      {item.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      📞 {item.mobile}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0 bg-gray-50 px-3 py-2 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">System Size</p>
                    <p className="font-bold text-lg text-gray-900">{item.kv}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Mobile Timeline - Vertical */}
                  <div className="block lg:hidden">
                    <div className="relative pl-6 space-y-4">
                      {/* Vertical line */}
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                      
                      <div className="relative">
                        <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                        <div className={`p-4 rounded-lg ${getStatusColor(item.status)} shadow-sm`}>
                          <p className="text-sm font-semibold">📋 Enquiry Received</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                      
                      {item.salesPersonId && (
                        <div className="relative">
                          <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                          <div className={`p-4 rounded-lg ${getStatusColor(item.status)} shadow-sm`}>
                            <p className="text-sm font-semibold">👤 Sales Assigned</p>
                            <p className="text-xs text-gray-600 mt-1">{item.salesPersonName}</p>
                          </div>
                        </div>
                      )}
                      
                      {item.fieldExecutiveId && (
                        <div className="relative">
                          <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-sm"></div>
                          <div className={`p-4 rounded-lg ${getStatusColor(item.status)} shadow-sm`}>
                            <p className="text-sm font-semibold">🔧 Field Assigned</p>
                            <p className="text-xs text-gray-600 mt-1">{item.fieldExecutiveName}</p>
                          </div>
                        </div>
                      )}
                      
                      {item.status === 'completed' && (
                        <div className="relative">
                          <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                          <div className="p-4 rounded-lg bg-green-100 shadow-sm">
                            <p className="text-sm font-semibold">✅ Completed</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.paymentStatus === 'paid' ? '💰 Paid' : '⏳ Pending Payment'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Timeline - Horizontal */}
                  <div className="hidden lg:flex items-stretch gap-3">
                    {/* Enquiry */}
                    <div className="flex-1">
                      <div className={`p-4 rounded-lg h-full ${getStatusColor(item.status)} shadow-sm border-l-4 border-blue-500`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">📋</span>
                          <p className="text-sm font-semibold">Enquiry Received</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Sales */}
                    <div className="flex-1">
                      <div
                        className={`p-4 rounded-lg h-full shadow-sm ${
                          item.salesPersonId 
                            ? `${getStatusColor(item.status)} border-l-4 border-orange-500` 
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">👤</span>
                          <p className="text-sm font-semibold">Sales Assigned</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {item.salesPersonName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Field */}
                    <div className="flex-1">
                      <div
                        className={`p-4 rounded-lg h-full shadow-sm ${
                          item.fieldExecutiveId 
                            ? `${getStatusColor(item.status)} border-l-4 border-purple-500` 
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🔧</span>
                          <p className="text-sm font-semibold">Field Assigned</p>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {item.fieldExecutiveName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Completion */}
                    <div className="flex-1">
                      <div
                        className={`p-4 rounded-lg h-full shadow-sm ${
                          item.status === 'completed' 
                            ? 'bg-green-100 border-l-4 border-green-500' 
                            : 'bg-gray-50 border-l-4 border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">✅</span>
                          <p className="text-sm font-semibold">Completed</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          {item.status === 'completed'
                            ? item.paymentStatus === 'paid'
                              ? '💰 Paid'
                              : '⏳ Pending Payment'
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {(item.quotationAmount || item.workDate || item.paymentStatus) && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.quotationAmount && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium mb-1">💰 Quotation Amount</p>
                          <p className="text-lg font-bold text-blue-900">
                            ₹{item.quotationAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {item.workDate && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs text-purple-600 font-medium mb-1">📅 Work Date</p>
                          <p className="text-sm font-semibold text-purple-900">
                            {new Date(item.workDate).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      )}
                      {item.paymentStatus && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium mb-1">💳 Payment Status</p>
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
