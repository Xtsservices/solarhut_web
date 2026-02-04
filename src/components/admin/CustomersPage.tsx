import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

// Mock data for customers
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    address: '123 Main St, Mumbai, Maharashtra',
    mobile: '+91 9876543210',
    email: 'john.doe@example.com',
    leadEstimation: 'Lead',
    assignedTo: 'Rajesh Kumar',
    status: 'New',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    address: '456 Park Avenue, Delhi',
    mobile: '+91 9876543211',
    email: 'jane.smith@example.com',
    leadEstimation: 'Estimation',
    assignedTo: 'Priya Sharma',
    status: 'In Progress',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    address: '789 Beach Road, Goa',
    mobile: '+91 9876543212',
    email: 'michael.j@example.com',
    leadEstimation: 'Lead',
    assignedTo: 'Amit Patel',
    status: 'Qualified',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    address: '321 Garden Lane, Bangalore',
    mobile: '+91 9876543213',
    email: 'sarah.w@example.com',
    leadEstimation: 'Estimation',
    assignedTo: 'Rajesh Kumar',
    status: 'Converted',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22'
  },
  {
    id: 5,
    name: 'David Brown',
    address: '654 Hill View, Pune',
    mobile: '+91 9876543214',
    email: 'david.brown@example.com',
    leadEstimation: 'Lead',
    assignedTo: 'Neha Desai',
    status: 'Lost',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16'
  },
  {
    id: 6,
    name: 'Emily Davis',
    address: '987 Lake Side, Hyderabad',
    mobile: '+91 9876543215',
    email: 'emily.davis@example.com',
    leadEstimation: 'Estimation',
    assignedTo: 'Amit Patel',
    status: 'Follow Up',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21'
  }
];

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Qualified': 'bg-purple-100 text-purple-700',
  'Converted': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-700',
  'Follow Up': 'bg-orange-100 text-orange-700'
};

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const statuses = ['all', ...Array.from(new Set(mockCustomers.map(c => c.status)))];
  const types = ['all', 'Lead', 'Estimation'];
  const employees = ['all', ...Array.from(new Set(mockCustomers.map(c => c.assignedTo)))];

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
      const matchesType = selectedType === 'all' || customer.leadEstimation === selectedType;
      const matchesEmployee = selectedEmployee === 'all' || customer.assignedTo === selectedEmployee;

      const matchesDateRange = (!startDate || new Date(customer.updatedAt) >= new Date(startDate)) &&
                               (!endDate || new Date(customer.updatedAt) <= new Date(endDate));

      return matchesSearch && matchesStatus && matchesType && matchesEmployee && matchesDateRange;
    });
  }, [searchTerm, selectedStatus, selectedType, selectedEmployee, startDate, endDate]);

  const handleExport = () => {
    // Export functionality
    console.log('Exporting customers:', filteredCustomers);
  };

  const handleViewDetails = (customerId: number) => {
    console.log('View customer details:', customerId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer information</p>
        </div>
        <Button onClick={handleExport} className="bg-orange-500 hover:bg-orange-600">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockCustomers.filter(c => c.status === 'New').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockCustomers.filter(c => c.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockCustomers.filter(c => c.status === 'Converted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, mobile, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assigned To</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {employees.map(emp => (
                      <option key={emp} value={emp}>
                        {emp === 'all' ? 'All Employees' : emp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">{customer.mobile}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-sm text-gray-600 truncate">{customer.address}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{customer.leadEstimation}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.assignedTo}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[customer.status]}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(customer.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(customer.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Summary */}
          {filteredCustomers.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredCustomers.length} of {mockCustomers.length} customers
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
