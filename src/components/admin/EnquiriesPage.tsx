import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { mockFieldExecutives } from '../../lib/mockData';
import { Eye, UserPlus, Search, ChevronDown, ChevronUp, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '../ui/utils';
import { useSelector } from 'react-redux';
// import { API_BASE_URL } from '../website/ip';
// Add this type declaration at the top of your file (or in a global .d.ts file)
interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  // add other env variables here if needed
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignToEmployeeId, setAssignToEmployeeId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [createEmployeeDialogOpen, setCreateEmployeeDialogOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeMobile, setNewEmployeeMobile] = useState('');
  const [newEmployeeRole, setNewEmployeeRole] = useState('Sales Person');
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const itemsPerPage = 10;
 const user = useSelector((state: any) => state.currentUserData);
 const userId = user?.id ||  '';
 console.log('Current User in EnquiriesPage:', user);
  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching leads from:', `${API_BASE_URL}/api/leads/`);
      const response = await fetch(`${API_BASE_URL}/api/leads/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch leads response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Raw API result:', result);
      console.log('📊 Result type:', typeof result);
      console.log('📊 Result.success:', result.success);
      console.log('📊 Result.data:', result.data);
      console.log('📊 Result.data type:', Array.isArray(result.data));
      
      if (result.success && Array.isArray(result.data)) {
        console.log('✅ Data is valid array, length:', result.data.length);
        console.log('📋 Sample data structure:', result.data[0]);
        
        // Don't filter by type - load all leads as enquiries for now
        const enquiryData = result.data;
        setEnquiries(enquiryData);
        console.log('🎯 Enquiries set in state:', enquiryData.length);
      } else if (result.success && result.data) {
        console.log('⚠️ Data exists but not array format:', result.data);
        // Try to handle if data is not an array
        const dataArray = Array.isArray(result.data) ? result.data : [result.data];
        setEnquiries(dataArray);
        console.log('🔄 Converted to array and set:', dataArray.length);
      } else {
        console.log('❌ No valid data found:', { success: result.success, data: result.data });
        setEnquiries([]);
      }
    } catch (error) {
      console.error('💥 Error fetching enquiries:', error);
      toast.error('Failed to fetch enquiries. Please check console for details.');
      setEnquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sales persons from API
  const fetchSalesPersons = async () => {
    try {
      console.log('🔍 Fetching sales persons from API...');
      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.log('⚠️ Sales persons API not available, using empty array');
        setSalesPersons([]);
        return;
      }

      const result = await response.json();
      console.log('📊 Sales persons result:', result);
      
      if (result.success && Array.isArray(result.data)) {
        // Filter only sales persons/employees with sales role
        const salesPersonsData = result.data.filter((emp: any) => 
          emp.role === 'sales' || emp.role === 'salesperson' || emp.role === 'Sales Person'
        );
        setSalesPersons(salesPersonsData);
        console.log('✅ Sales persons loaded:', salesPersonsData.length);
      } else {
        setSalesPersons([]);
      }
    } catch (error) {
      console.log('⚠️ Error fetching sales persons, using empty array:', error);
      setSalesPersons([]);
    }
  };

  // Fetch all employees from API (using same method as EmployeesPage)
  const fetchAllEmployees = async () => {
    try {
      console.log('🔍 Fetching employees from:', `${API_BASE_URL}/api/employees/`);
      
      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch employees response status:', response.status, response.statusText);

      if (!response.ok) {
        console.log('⚠️ Employees API not available, using empty array');
        setEmployees([]);
        return;
      }

      const result = await response.json();
      console.log('📊 COMPLETE EMPLOYEES API Response:', JSON.stringify(result, null, 2));
      
      if (result.success && Array.isArray(result.data)) {
        // Process employees to ensure consistent role structure
        const processedEmployees = result.data.map((emp: any) => {
          console.log('👤 Processing employee:', emp);
          
          // Handle different role formats from API
          let processedRoles = [];
          if (emp.roles && Array.isArray(emp.roles)) {
            processedRoles = emp.roles;
          } else if (emp.role && typeof emp.role === 'string') {
            processedRoles = [emp.role];
          }
          
          return {
            ...emp,
            roles: processedRoles,
            // Keep original role for backward compatibility
            role: emp.role || (processedRoles.length > 0 ? processedRoles[0] : '')
          };
        });
        
        setEmployees(processedEmployees);
        console.log('✅ All employees loaded and processed:', processedEmployees.length);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.log('⚠️ Error fetching employees, using empty array:', error);
      setEmployees([]);
    }
  };

  // Fetch roles from API (using same method as EmployeesPage)
  const fetchRoles = async () => {
    try {
      console.log('🔍 Fetching roles from:', `${API_BASE_URL}/api/roles`);
      
      const response = await fetch(`${API_BASE_URL}/api/roles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 COMPLETE ROLES API Response:', JSON.stringify(result, null, 2));
      
      if (result.data && Array.isArray(result.data)) {
        // Process roles to handle different response formats
        const processedRoles = result.data.map((role: any) => {
          if (typeof role === 'string') {
            return role;
          } else if (role && typeof role === 'object' && role.role_name) {
            return role.role_name;
          } else if (role && typeof role === 'object' && role.name) {
            return role.name;
          }
          return String(role);
        }).filter(Boolean); // Remove any null/undefined values
        
        setRoles(processedRoles);
        console.log('✅ Roles loaded:', processedRoles);
      } else {
        // Fallback to default roles if API doesn't return expected format
        const defaultRoles = ['Sales Person', 'Field Executive', 'Manager', 'Admin'];
        setRoles(defaultRoles);
        console.log('📊 Using default roles:', defaultRoles);
      }
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      // Fallback to default roles
      const defaultRoles = ['Sales Person', 'Field Executive', 'Manager', 'Admin'];
      setRoles(defaultRoles);
      console.log('📊 Using default roles after error:', defaultRoles);
    }
  };



  // Refresh employees and roles list
  const refreshSalesPersons = async () => {
    console.log('🔄 Refreshing employees and roles list...');
    await fetchSalesPersons();
    await fetchAllEmployees();
    await fetchRoles();
    toast.success('Employees and roles list refreshed');
  };

  // Function to filter employees by selected role (using same logic as EmployeesPage)
  const getEmployeesByRole = (role: string) => {
    if (!role) return [];
    
    return employees.filter((emp: any) => {
      // Check direct role match
      if (emp.role === role) return true;
      
      // Check if employee has multiple roles containing the selected role
      if (emp.roles && Array.isArray(emp.roles)) {
        return emp.roles.some((empRole: string) => empRole === role);
      }
      
      // Handle case where roles might be a string instead of array
      if (typeof emp.roles === 'string' && emp.roles === role) {
        return true;
      }
      
      return false;
    });
  };

  // Create new employee function
  const handleCreateEmployee = async () => {
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim() || !newEmployeeMobile.trim()) {
      toast.error('Please fill all employee details');
      return;
    }

    try {
      setIsCreatingEmployee(true);
      console.log('🆕 Creating new employee:', {
        name: newEmployeeName,
        email: newEmployeeEmail,
        mobile: newEmployeeMobile,
        role: newEmployeeRole
      });

      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEmployeeName.trim(),
          email: newEmployeeEmail.trim(),
          mobile: newEmployeeMobile.trim(),
          role: newEmployeeRole
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Employee created successfully');
        
        // Add new employee to local state if it's a sales person
        if (newEmployeeRole === 'Sales Person') {
          const newEmployee = {
            id: result.data?.id || Date.now().toString(),
            name: newEmployeeName.trim(),
            email: newEmployeeEmail.trim(),
            mobile: newEmployeeMobile.trim(),
            role: newEmployeeRole
          };
          
          setSalesPersons(prev => [...prev, newEmployee]);
          
          // Auto-select the newly created employee
          setSelectedSalesPerson(newEmployee.id);
          toast.info('Employee created and selected for assignment');
        } else {
          // Refresh the sales persons list to get updated data
          await fetchSalesPersons();
          toast.info('Employee created successfully');
        }
        
        // Clear form and close dialog
        setNewEmployeeName('');
        setNewEmployeeEmail('');
        setNewEmployeeMobile('');
        setNewEmployeeRole('Sales Person');
        setCreateEmployeeDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Failed to create employee. Please try again.');
    } finally {
      setIsCreatingEmployee(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeads();
    fetchSalesPersons();
    fetchAllEmployees();
    fetchRoles();
  }, []);

  // Add visibility change listener to refresh sales persons when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Page became visible, refreshing employees and roles...');
        fetchSalesPersons();
        fetchAllEmployees();
        fetchRoles();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> ={
      new: { variant: 'secondary', label: 'New' },
      assigned: { variant: 'default', label: 'Assigned' },
      scheduled: { variant: 'outline', label: 'Scheduled' },
      completed: { variant: 'default', label: 'Completed' },
    };
    const config = variants[status] || variants.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Helper function to get service type
  const getServiceType = (enquiry: any) => {
    const serviceType = enquiry.service_type || enquiry.serviceType || enquiry.services_type || enquiry.type || '';
    
    // Format service type for display
    if (serviceType) {
      return serviceType.charAt(0).toUpperCase() + serviceType.slice(1).toLowerCase();
    }
    
    return 'General';
  };

  // Helper function to get full name from various name fields
  const getFullName = (enquiry: any) => {
    console.log('👤 Getting name for enquiry:', {
      id: enquiry.id || enquiry.lead_id,
      fullName: enquiry.fullName,
      full_name: enquiry.full_name,
      name: enquiry.name,
      customer_name: enquiry.customer_name,
      firstName: enquiry.firstName,
      first_name: enquiry.first_name,
      lastName: enquiry.lastName,
      last_name: enquiry.last_name,
      fname: enquiry.fname,
      lname: enquiry.lname
    });
    
    // Try direct full name fields first
    if (enquiry.fullName) return enquiry.fullName;
    if (enquiry.full_name) return enquiry.full_name;
    if (enquiry.name) return enquiry.name;
    if (enquiry.customer_name) return enquiry.customer_name;
    
    // Try to combine first and last name
    const firstName = enquiry.firstName || enquiry.first_name || '';
    const lastName = enquiry.lastName || enquiry.last_name || '';
    
    if (firstName && lastName) {
      const combinedName = `${firstName} ${lastName}`.trim();
      console.log('✅ Combined name:', combinedName);
      return combinedName;
    }
    
    if (firstName) return firstName;
    if (lastName) return lastName;
    
    // Try other possible name combinations
    if (enquiry.fname && enquiry.lname) {
      const combinedName = `${enquiry.fname} ${enquiry.lname}`.trim();
      console.log('✅ Combined fname/lname:', combinedName);
      return combinedName;
    }
    
    if (enquiry.fname) return enquiry.fname;
    if (enquiry.lname) return enquiry.lname;
    
    console.log('⚠️ No name found, returning Unknown');
    return 'Unknown';
  };

  const filteredEnquiries = enquiries.filter((enquiry: any) => {
    // Admin should see all leads, not just assigned ones
    // Remove the assigned_to filter for admin view

    const name = getFullName(enquiry);
    const phone = enquiry.mobile || enquiry.phone || enquiry.contact || '';
    const id = (enquiry.id || enquiry.lead_id || '').toString();

    const matchesSearch = searchTerm === '' || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());

    const status = (enquiry.status || 'new').toLowerCase();
    const matchesStatus = statusFilter === 'all' || status === statusFilter.toLowerCase();

    const serviceType = (enquiry.service_type || enquiry.serviceType || enquiry.services_type || enquiry.type || '').toLowerCase();
    const matchesServiceType = serviceTypeFilter === 'all' || 
      serviceType === serviceTypeFilter ||
      (serviceTypeFilter === 'maintenance' && (serviceType === 'maintenance' || serviceType === 'repair' || serviceType === 'service')) ||
      (serviceTypeFilter === 'installation' && (serviceType === 'installation' || serviceType === 'install' || serviceType === 'setup' || serviceType === 'new'));

    const createdDate = enquiry.createdAt || enquiry.created_at || enquiry.date_created;
    const matchesDate = !dateFilter || !createdDate ||
      new Date(createdDate).toDateString() === dateFilter.toDateString();

    const result = matchesSearch && matchesStatus && matchesServiceType && matchesDate;
    return result;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceTypeFilter, searchTerm, dateFilter]);

  // Assign lead using assignleads API
  const handleAssignTo = async () => {
    if (!assignToEmployeeId) {
      toast.error('Please select an employee');
      return;
    }
    if (!selectedEnquiry) {
      toast.error('No enquiry selected');
      return;
    }
    setIsAssigning(true);
    try {
      const enquiryId = selectedEnquiry.id || selectedEnquiry.lead_id;
      // Get token from localStorage or context
      const token = localStorage.getItem('authToken');
      console.log(token,"authToken");
      const response = await fetch(`${API_BASE_URL}/api/assignleads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          leadId: enquiryId,
          employeeId: parseInt(assignToEmployeeId, 10),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        const emp = employees.find(e => e.id === assignToEmployeeId);
        toast.success(`Successfully assigned to ${emp ? emp.name : 'Employee'}`);
        // Update table status and assigned_to
        setEnquiries(prev => prev.map(enquiry =>
          (enquiry.id || enquiry.lead_id) === enquiryId
            ? { ...enquiry, status: 'Assigned', assigned_to: assignToEmployeeId }
            : enquiry
        ));
        setSelectedEnquiry((prev: any) => ({
          ...prev,
          status: 'Assigned',
          assigned_to: assignToEmployeeId
        }));
        setAssignToEmployeeId('');
        setViewDialogOpen(false);
      } else {
        toast.error(result.message || 'Failed to assign');
      }
    } catch (error) {
      toast.error('Failed to assign. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading enquiries...
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1 sm:mb-2">Leads</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage all customer leads</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 sm:justify-end">
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
          
          <div className="flex-1 sm:flex-none sm:w-48">
            <Label className="text-sm">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 sm:flex-none sm:w-48">
            <Label className="text-sm">Service Type</Label>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 sm:flex-none sm:w-56">
            <Label className="text-sm">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left mt-1 text-sm',
                    !dateFilter && 'text-gray-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}</span>
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

      <Card className="hidden md:block">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="text-base sm:text-lg">All Leads ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">ID</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Mobile</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Service Type</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">KW</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm text-left px-3 py-2 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEnquiries.map((enquiry: any, index: number) => (
                  <TableRow key={enquiry.id || enquiry.lead_id || (startIndex + index)} className="align-middle">
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{enquiry.id || enquiry.lead_id || `#${startIndex + index + 1}`}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{getFullName(enquiry)}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{enquiry.mobile || enquiry.phone || enquiry.contact || 'N/A'}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{getServiceType(enquiry)}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{enquiry.kv || enquiry.system_size || enquiry.capacity || 'N/A'}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">
                      <div className="flex items-center h-full">{getStatusBadge(enquiry.status || 'new')}</div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-left px-3 py-2 whitespace-nowrap align-middle">{enquiry.createdAt || enquiry.created_at || enquiry.date_created 
                      ? new Date(enquiry.createdAt || enquiry.created_at || enquiry.date_created).toLocaleDateString()
                      : 'N/A'
                    }</TableCell>
                    <TableCell className="text-left px-3 py-2 whitespace-nowrap align-middle">
                      <div className="flex items-center justify-start h-full">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="flex items-center justify-center"
                          onClick={() => {
                            console.log('👁️ Viewing enquiry:', enquiry);
                            setSelectedEnquiry(enquiry);
                            setViewDialogOpen(true);
                            setShowAssignForm(false);
                            setSelectedSalesPerson('');
                            setSelectedRole('');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedEnquiries.length === 0 && filteredEnquiries.length === 0 && enquiries.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No enquiries match your current filters. ({enquiries.length} total enquiries loaded)
                    </TableCell>
                  </TableRow>
                )}
                {enquiries.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No enquiries found in database. Check your API connection.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {filteredEnquiries.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const showPage = page === 1 || page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[32px]"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="md:hidden space-y-2">
        <div className="bg-white rounded-lg border p-2 mb-2">
          <p className="text-xs text-gray-600">
            Total: <span className="font-medium text-gray-900">{filteredEnquiries.length}</span> enquiries
            {filteredEnquiries.length > itemsPerPage && (
              <span className="ml-2 text-gray-500">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </p>
        </div>
        {paginatedEnquiries.map((enquiry: any, index: number) => (
          <Card key={enquiry.id || enquiry.lead_id || (startIndex + index)} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">
                      {enquiry.id || enquiry.lead_id || `#${startIndex + index + 1}`}
                    </p>
                    <p className="font-medium text-sm mt-0.5 truncate">
                      {getFullName(enquiry)}
                    </p>
                  </div>
                  {getStatusBadge(enquiry.status || 'new')}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                  <div>
                    <p className="text-gray-500 mb-0.5">Mobile</p>
                    <p className="text-gray-900 font-medium">
                      {enquiry.mobile || enquiry.phone || enquiry.contact || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-0.5">Service Type</p>
                    <p className="text-gray-900 font-medium">
                      {getServiceType(enquiry)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs pt-2">
                  <div>
                    <p className="text-gray-500 mb-0.5">Capacity</p>
                    <p className="text-gray-900 font-medium">
                      {enquiry.kv || enquiry.system_size || enquiry.capacity || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 pt-1">
                  {enquiry.createdAt || enquiry.created_at || enquiry.date_created
                    ? new Date(enquiry.createdAt || enquiry.created_at || enquiry.date_created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Date N/A'
                  }
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-1 h-8 text-xs"
                  onClick={() => {
                    console.log('👁️ Viewing enquiry (mobile):', enquiry);
                    setSelectedEnquiry(enquiry);
                    setViewDialogOpen(true);
                    setShowAssignForm(false);
                    setSelectedSalesPerson('');
                    setSelectedRole('');
                  }}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {paginatedEnquiries.length === 0 && filteredEnquiries.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No enquiries found. Try adjusting your filters.
            </CardContent>
          </Card>
        )}
        
        {/* Mobile Pagination Controls */}
        {filteredEnquiries.length > itemsPerPage && (
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col items-center space-y-3">
                <div className="text-xs text-gray-600 text-center">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  
                  <span className="text-sm font-medium px-3">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        setViewDialogOpen(open);
        if (!open) {
          setSelectedSalesPerson('');
          setSelectedRole('');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="text-base sm:text-lg">Enquiry Details</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">View and manage enquiry information</DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (() => {
            const salesPerson = salesPersons.find((sp: any) => sp.id === selectedEnquiry.salesPersonId);
            const fieldExecutive = mockFieldExecutives.find(fe => fe.id === selectedEnquiry.fieldExecutiveId);
            
            // Function to format field names for display
            const formatFieldName = (key: string) => {
              return key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
            };

            // Function to format field values
            const formatFieldValue = (key: string, value: any) => {
              if (value === null || value === undefined || value === '') return 'N/A';
              
              // Handle dates
              if ((key.includes('date') || key.includes('Date') || key.includes('created') || key.includes('updated')) && 
                  typeof value === 'string' && !isNaN(Date.parse(value))) {
                return new Date(value).toLocaleString();
              }
              
              // Handle booleans
              if (typeof value === 'boolean') {
                return value ? 'Yes' : 'No';
              }
              
              // Handle numbers
              if (typeof value === 'number') {
                return value.toLocaleString();
              }
              
              // Handle arrays
              if (Array.isArray(value)) {
                return value.join(', ') || 'Empty';
              }
              
              // Handle objects
              if (typeof value === 'object') {
                return JSON.stringify(value, null, 2);
              }
              
              return String(value);
            };

            // Get all fields from the enquiry object
            const excludeFields = [
              'salesPersonId', 
              'fieldExecutiveId',
              // Exclude fields already shown in primary section
              'id',
              'lead_id', 
              'status',
              'mobile',
              'phone',
              'contact',
              // Exclude name fields as they're handled by getFullName
              'fullName',
              'full_name',
              'name',
              'customer_name',
              'firstName',
              'first_name',
              'lastName',
              'last_name',
              'fname',
              'lname',
              // Exclude channel field
              'channel'
            ];
            
            // Define custom field order
            const fieldOrder = [
              'email',
              'kv', 'system_size', 'capacity',
              'home_type', 'homeType', 'property_type',
              'service_type', 'serviceType', 'services_type',
              'createdAt', 'created_at', 'date_created',
              'updatedAt', 'updated_at', 'date_updated',
              'location', 'address', 'city', 'state', 'pincode',
              'message', 'description', 'notes', 'comments'
            ];
            
            const availableFields = Object.keys(selectedEnquiry)
              .filter(key => !excludeFields.includes(key));
            
            // Sort fields according to custom order, then alphabetically for remaining fields
            const allFields = availableFields.sort((a, b) => {
              const aIndex = fieldOrder.indexOf(a);
              const bIndex = fieldOrder.indexOf(b);
              
              if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
              } else if (aIndex !== -1) {
                return -1;
              } else if (bIndex !== -1) {
                return 1;
              } else {
                return a.localeCompare(b);
              }
            });

            console.log('🎯 All available fields in selectedEnquiry:', allFields);
            console.log('📋 Complete enquiry object:', selectedEnquiry);
            
            return (
              <div className="space-y-3 sm:space-y-4">
                {/* Primary Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Essential Fields First */}
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-blue-700">Enquiry ID</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 font-medium">
                      {selectedEnquiry.id || selectedEnquiry.lead_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-blue-700">Status</Label>
                    <div className="mt-1">
                      {selectedEnquiry.status === 'Assigned'
                        ? <Badge className="bg-green-100 text-green-700">Assigned</Badge>
                        : <Badge className="bg-gray-100 text-gray-700">Unassigned</Badge>
                      }
                    </div>
                  </div>
                {/* ...existing code... */}
                {/* Move Assign To dropdown to the bottom of the modal for better alignment */}
                {/* ...existing code... */}
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-blue-700">Full Name</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1 font-medium">{getFullName(selectedEnquiry)}</p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold text-blue-700">Contact Number</Label>
                    <p className="text-sm sm:text-base text-gray-900 mt-1">
                      {selectedEnquiry.mobile || selectedEnquiry.phone || selectedEnquiry.contact || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Additional Dynamic Fields */}
                <div className="space-y-4">
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Additional Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {allFields.map((key) => {
                        const value = selectedEnquiry[key];
                        const displayValue = formatFieldValue(key, value);
                        
                        // Skip empty or null values for cleaner display
                        if (displayValue === 'N/A' && !['status', 'id', 'lead_id'].includes(key)) {
                          return null;
                        }
                        
                        return (
                          <div key={key} className={`${
                            key === 'message' || key === 'description' || key === 'address' || 
                            key === 'notes' || key === 'comments' || key === 'requirements' ||
                            (typeof value === 'object' && value !== null) || 
                            (typeof value === 'string' && value.length > 50)
                              ? 'sm:col-span-2' : ''
                          }`}>
                            <Label className="text-xs sm:text-sm text-gray-600">
                              {formatFieldName(key)}
                            </Label>
                            <div className="text-sm sm:text-base text-gray-900 mt-1">
                              {typeof value === 'object' && value !== null ? (
                                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto max-h-24">
                                  {displayValue}
                                </pre>
                              ) : (
                                <p className={`${
                                  (typeof value === 'string' && value.length > 100) ? 'text-xs' : ''
                                } break-words`}>
                                  {displayValue}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Assignment Section with Role and Employee Selection */}
                      {(() => {
                        const currentStatus = selectedEnquiry.status || 'new';
                        const canAssign = currentStatus === 'new' || currentStatus === 'pending' || !currentStatus || currentStatus === '';
                        console.log('🎯 Assignment dropdown check:', {
                          currentStatus,
                          canAssign,
                          salesPersonsCount: salesPersons.length,
                          enquiryId: selectedEnquiry.id || selectedEnquiry.lead_id
                        });
                        
                        return canAssign && (
                          <div className="sm:col-span-2 mt-4 pt-4 border-t">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs sm:text-sm text-gray-600">Assign Enquiry</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={refreshSalesPersons}
                                  className="text-xs px-2 py-1 h-auto"
                                  title="Refresh employees list"
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Refresh
                                </Button>
                              </div>
                              <div className="text-xs text-blue-600 mb-2">
                                Current Status: <span className="font-medium">{currentStatus}</span>
                              </div>
                              
                              {/* Role Selection Dropdown */}
                              <div>
                                <Label className="text-xs sm:text-sm text-gray-600 mb-2 block">Select Role</Label>
                                <Select 
                                  value={selectedRole} 
                                  onValueChange={setSelectedRole}
                                  disabled={roles.length === 0}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={roles.length === 0 ? "Loading roles..." : "Choose role..."} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.length > 0 ? (
                                      roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                          {role}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      // Fallback options if roles haven't loaded yet
                                      <>
                                        <SelectItem value="Sales Person">Sales Person</SelectItem>
                                        <SelectItem value="Field Executive">Field Executive</SelectItem>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Employee Selection Dropdown - Shows only when role is selected */}
                              {selectedRole && (
                                <div>
                                  <Label className="text-xs sm:text-sm text-gray-600 mb-2 block">Select Employee</Label>
                                  <Select 
                                    value={selectedSalesPerson} 
                                    disabled={employees.length === 0}
                                    onValueChange={(value) => {
                                      if (value === 'create_new') {
                                        // Set the role for the new employee based on selected role
                                        const roleToSet = selectedRole || (roles.length > 0 ? roles[0] : 'Sales Person');
                                        setNewEmployeeRole(roleToSet);
                                        setCreateEmployeeDialogOpen(true);
                                        setSelectedSalesPerson('');
                                      } else {
                                        setSelectedSalesPerson(value);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={
                                        getEmployeesByRole(selectedRole).length > 0 
                                          ? `Choose ${selectedRole.toLowerCase()}...` 
                                          : `No ${selectedRole.toLowerCase()}s available - Click to create`
                                      } />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getEmployeesByRole(selectedRole).length > 0 ? (
                                        <>
                                          {getEmployeesByRole(selectedRole).map((emp: any) => {
                                            // Ensure name and role are strings
                                            const displayName = typeof emp.name === 'string' && emp.name.trim().length > 0
                                              ? emp.name
                                              : `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
                                            const displayRole = typeof emp.role === 'string' ? emp.role : '';
                                            return (
                                              <SelectItem key={emp.id} value={String(emp.id)}>
                                                {`${displayName}${displayRole ? ` (${displayRole})` : ''}`}
                                              </SelectItem>
                                            );
                                          })}
                                          <hr className="my-1" />
                                          <SelectItem value="create_new">
                                            <div className="flex items-center text-blue-600">
                                              <UserPlus className="h-4 w-4 mr-2" />
                                              Create New {selectedRole}
                                            </div>
                                          </SelectItem>
                                        </>
                                      ) : (
                                        <SelectItem value="create_new">
                                          <div className="flex items-center text-blue-600">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Create New {selectedRole}
                                          </div>
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {/* Show assign button only if both role and employee are selected */}
                              {selectedRole && selectedSalesPerson && selectedSalesPerson !== 'create_new' && (
                                <Button 
                                  onClick={handleAssignTo} 
                                  className="w-full"
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assign to {selectedRole}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Additional Status-Based Information */}
                {(selectedEnquiry.status === 'assigned' || 
                  selectedEnquiry.status === 'scheduled' || 
                  selectedEnquiry.status === 'completed') && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Assignment & Work Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {salesPerson && (
                        <div className="sm:col-span-2">
                          <Label className="text-xs sm:text-sm text-gray-600">Assigned Sales Person</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">{salesPerson.name}</p>
                        </div>
                      )}
                      
                      {selectedEnquiry.quotationAmount && (
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-600">Quotation Amount</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">
                            ₹{selectedEnquiry.quotationAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      
                      {fieldExecutive && (
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-600">Field Executive</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">{fieldExecutive.name}</p>
                        </div>
                      )}
                      
                      {selectedEnquiry.workDate && (
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-600">Work Date</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">
                            {new Date(selectedEnquiry.workDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {selectedEnquiry.workTime && (
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-600">Work Time</Label>
                          <p className="text-sm sm:text-base text-gray-900 mt-1">{selectedEnquiry.workTime}</p>
                        </div>
                      )}
                      
                      {(selectedEnquiry.status === 'scheduled' || selectedEnquiry.status === 'completed') && (
                        <div>
                          <Label className="text-xs sm:text-sm text-gray-600">Payment Status</Label>
                          <div className="mt-1">
                            {selectedEnquiry.paymentStatus === 'paid' ? (
                              <Badge className="bg-green-100 text-green-700">Paid</Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}


              {/* Assign To dropdown always visible if not assigned */}
              {selectedEnquiry.status !== 'Assigned' && (
                <div className="pt-6 mt-8 border-t">
                  <Label className="text-xs sm:text-sm text-gray-600 mb-2 block">Assign To</Label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={assignToEmployeeId}
                    onChange={e => setAssignToEmployeeId(e.target.value)}
                    disabled={isAssigning}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => {
                      // Ensure name and role are strings
                      const displayName = typeof emp.name === 'string' && emp.name.trim().length > 0
                        ? emp.name
                        : `${emp.first_name || ''} ${emp.last_name || ''}`.trim();
                      const displayRole = typeof emp.role === 'string' ? emp.role : '';
                      return (
                        <option key={emp.id} value={String(emp.id)}>
                          {`${displayName}${displayRole ? ` (${displayRole})` : ''}`}
                        </option>
                      );
                    })}
                  </select>
                  <Button
                    onClick={handleAssignTo}
                    className="w-full mt-3"
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                    disabled={isAssigning || !assignToEmployeeId}
                  >
                    {isAssigning ? 'Assigning...' : 'Submit'}
                  </Button>
                </div>
              )}
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Create Employee Dialog - Same as in Employees screen */}
      <Dialog open={createEmployeeDialogOpen} onOpenChange={setCreateEmployeeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Employee</DialogTitle>
            <DialogDescription>Add a new employee to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee-name">Full Name</Label>
              <Input
                id="employee-name"
                placeholder="Enter employee full name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="employee-email">Email Address</Label>
              <Input
                id="employee-email"
                type="email"
                placeholder="Enter email address"
                value={newEmployeeEmail}
                onChange={(e) => setNewEmployeeEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="employee-mobile">Mobile Number</Label>
              <Input
                id="employee-mobile"
                placeholder="Enter mobile number"
                value={newEmployeeMobile}
                onChange={(e) => setNewEmployeeMobile(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="employee-role">Role</Label>
              <Select value={newEmployeeRole} onValueChange={setNewEmployeeRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))
                  ) : (
                    // Fallback options if roles haven't loaded yet
                    <>
                      <SelectItem value="Sales Person">Sales Person</SelectItem>
                      <SelectItem value="Field Executive">Field Executive</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateEmployeeDialogOpen(false);
                  setNewEmployeeName('');
                  setNewEmployeeEmail('');
                  setNewEmployeeMobile('');
                  setNewEmployeeRole('Sales Person');
                }}
                className="flex-1"
                disabled={isCreatingEmployee}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEmployee}
                className="flex-1"
                disabled={isCreatingEmployee || !newEmployeeName.trim() || !newEmployeeEmail.trim() || !newEmployeeMobile.trim()}
              >
                {isCreatingEmployee ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Employee
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Employee will be created and available for assignment immediately.
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
