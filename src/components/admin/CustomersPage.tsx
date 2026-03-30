import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Pencil, Trash2, User, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { apiGet } from '../../api/commonApi';
import { updateCustomer, deleteCustomer } from '../../api/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

// Types
interface Customer {
  id: number;
  customer_code: string;
  name: string;
  email: string;
  mobile: string;
  alternate_mobile: string;
  status: string;
  customer_type: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  company_name: string;
  pan_number: string;
  gst_number: string;
  lead_source: string;
  created_at: string;
  updated_at: string;
}

export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    alternate_mobile: '',
    date_of_birth: '',
    gender: '',
    customer_type: '',
    company_name: '',
    gst_number: '',
    pan_number: '',
    lead_source: '',
    notes: '',
    status: '',
  });

  // Delete dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await apiGet('/customers/allCustomers');
        if (response?.data?.success && Array.isArray(response.data.data)) {
          const mappedCustomers = response.data.data.map((customer: any) => ({
            id: customer.id,
            customer_code: customer.customer_code,
            name: customer.full_name || `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            mobile: customer.mobile,
            alternate_mobile: customer.alternate_mobile,
            status: customer.status === 'Active' ? 'Active' : 'Inactive',
            customer_type: customer.customer_type,
            full_name: customer.full_name,
            gender: customer.gender,
            date_of_birth: customer.date_of_birth,
            company_name: customer.company_name,
            pan_number: customer.pan_number,
            gst_number: customer.gst_number,
            lead_source: customer.lead_source,
            created_at: customer.created_at,
            updated_at: customer.updated_at
          }));
          setCustomers(mappedCustomers);
        } else {
          toast.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Get unique values for filters
  const statuses = ['all', ...Array.from(new Set(customers.map(c => c.status)))];
  const types = ['all', ...Array.from(new Set(customers.map(c => c.customer_type)))];
  const employees = ['all'];

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm);

      const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
      const matchesType = selectedType === 'all' || customer.customer_type === selectedType;
      const matchesEmployee = selectedEmployee === 'all';

      const matchesDateRange = (!startDate || new Date(customer.updated_at) >= new Date(startDate)) &&
                               (!endDate || new Date(customer.updated_at) <= new Date(endDate));

      // Hide inactive customers
      const isActive = customer.status === 'Active';

      return matchesSearch && matchesStatus && matchesType && matchesEmployee && matchesDateRange && isActive;
    });
  }, [searchTerm, selectedStatus, selectedType, selectedEmployee, startDate, endDate, customers]);

  // Handle open edit dialog
  const handleOpenEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    const nameParts = customer.full_name ? customer.full_name.split(' ') : customer.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setEditForm({
      first_name: firstName,
      last_name: lastName,
      mobile: customer.mobile,
      email: customer.email,
      alternate_mobile: customer.alternate_mobile || '',
      date_of_birth: customer.date_of_birth || '',
      gender: customer.gender || '',
      customer_type: customer.customer_type || '',
      company_name: customer.company_name || '',
      gst_number: customer.gst_number || '',
      pan_number: customer.pan_number || '',
      lead_source: customer.lead_source || '',
      notes: '',
      status: customer.status || 'Active',
    });
    setShowEditDialog(true);
  };

  // Handle save customer
  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;
    
    // Validate required fields
    if (!editForm.first_name.trim() || !editForm.mobile.trim() || !editForm.email.trim()) {
      toast.error('Please fill in all required fields (First Name, Mobile, Email)');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateCustomer(editingCustomer.id, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        mobile: editForm.mobile,
        email: editForm.email,
        alternate_mobile: editForm.alternate_mobile,
        date_of_birth: editForm.date_of_birth,
        gender: editForm.gender,
        customer_type: editForm.customer_type,
        company_name: editForm.company_name,
        gst_number: editForm.gst_number,
        pan_number: editForm.pan_number,
        lead_source: editForm.lead_source,
        notes: editForm.notes,
        status: editForm.status,
      });

      if (result.ok) {
        // Update the customers list
        setCustomers(customers.map(c => 
          c.id === editingCustomer.id 
            ? {
                ...c,
                name: `${editForm.first_name} ${editForm.last_name}`.trim(),
                full_name: `${editForm.first_name} ${editForm.last_name}`.trim(),
                email: editForm.email,
                mobile: editForm.mobile,
                alternate_mobile: editForm.alternate_mobile,
                status: editForm.status,
                customer_type: editForm.customer_type,
                gender: editForm.gender,
                date_of_birth: editForm.date_of_birth,
                company_name: editForm.company_name,
                gst_number: editForm.gst_number,
                pan_number: editForm.pan_number,
                lead_source: editForm.lead_source,
              }
            : c
        ));
        setShowEditDialog(false);
        setEditingCustomer(null);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    setIsDeleting(true);
    try {
      const result = await deleteCustomer(deletingCustomer.id);

      if (result.ok) {
        // Update the customers list by removing or marking as inactive
        setCustomers(customers.map(c => 
          c.id === deletingCustomer.id 
            ? { ...c, status: 'Inactive' }
            : c
        ));
        setShowDeleteConfirm(false);
        setDeletingCustomer(null);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer information</p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'Active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Individual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {customers.filter(c => c.customer_type === 'Individual').length}
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
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading customers...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">S.No</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-center font-medium text-gray-700">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.customer_code}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {customer.mobile}
                          </div>
                          {customer.alternate_mobile && (
                            <div className="text-xs text-gray-500 mt-1">{customer.alternate_mobile}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {customer.email}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {customer.lead_source}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Details"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditDialog(customer)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingCustomer(customer);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Summary */}
          {filteredCustomers.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.customer_code} - {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.full_name}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Customer Code</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.customer_code}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.gender || '-'}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    {selectedCustomer.date_of_birth ? new Date(selectedCustomer.date_of_birth).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base break-all">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Mobile</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.mobile}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Alternate Mobile</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.alternate_mobile || '-'}</p>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Business Information</h3>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Customer Type</p>
                  <Badge className={selectedCustomer.customer_type === 'Business' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                    {selectedCustomer.customer_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Company Name</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.company_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">PAN Number</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.pan_number || '-'}</p>
                </div>
              </div>

              {/* Tax & Source Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Tax & Source</h3>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">GST Number</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.gst_number || '-'}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Lead Source</p>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{selectedCustomer.lead_source}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Status</p>
                  <Badge className={selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-4 col-span-1 md:col-span-2">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Created At</p>
                    <p className="font-medium text-gray-900 text-xs md:text-sm">
                      {new Date(selectedCustomer.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Updated At</p>
                    <p className="font-medium text-gray-900 text-xs md:text-sm">
                      {new Date(selectedCustomer.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <>
              <div className="space-y-4 overflow-y-auto flex-1">
                {/* Personal Information Section */}
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name *</label>
                      <Input
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="mt-1"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="mt-1"
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <Input
                        type="date"
                        value={editForm.date_of_birth}
                        onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="mt-1"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mobile *</label>
                      <Input
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                        className="mt-1"
                        placeholder="Mobile"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Alternate Mobile</label>
                      <Input
                        value={editForm.alternate_mobile}
                        onChange={(e) => setEditForm({ ...editForm, alternate_mobile: e.target.value })}
                        className="mt-1"
                        placeholder="Alternate Mobile"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information Section */}
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-gray-900">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Customer Type *</label>
                      <select
                        value={editForm.customer_type}
                        onChange={(e) => setEditForm({ ...editForm, customer_type: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="Individual">Individual</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company Name</label>
                      <Input
                        value={editForm.company_name}
                        onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                        className="mt-1"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">PAN Number</label>
                      <Input
                        value={editForm.pan_number}
                        onChange={(e) => setEditForm({ ...editForm, pan_number: e.target.value })}
                        className="mt-1"
                        placeholder="PAN Number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">GST Number</label>
                      <Input
                        value={editForm.gst_number}
                        onChange={(e) => setEditForm({ ...editForm, gst_number: e.target.value })}
                        className="mt-1"
                        placeholder="GST Number"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-gray-900">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Lead Source</label>
                      <Input
                        value={editForm.lead_source}
                        onChange={(e) => setEditForm({ ...editForm, lead_source: e.target.value })}
                        className="mt-1"
                        placeholder="Lead Source"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 min-h-24"
                        placeholder="Additional notes"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  onClick={handleSaveCustomer}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this customer?
            </DialogDescription>
          </DialogHeader>
          {deletingCustomer && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Customer:</strong> {deletingCustomer.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Code:</strong> {deletingCustomer.customer_code}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  This action will deactivate the customer. You can reactivate them later if needed.
                </p>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteCustomer}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deactivating...' : 'Deactivate'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
