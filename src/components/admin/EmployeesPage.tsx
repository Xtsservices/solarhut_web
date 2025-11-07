import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserPlus, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedEnquiries } from '../sales/AssignedEnquiries';
import { AssignedJobs } from '../field/AssignedJobs';
import { API_BASE_URL } from '../website/ip';

// 🔹 Type Definitions
type RoleResponse = {
  role_id: number;
  role_name: string;
};

type Role = {
  id: number;
  role_name: string;
};

type EmployeeRole = 'Sales Person' | 'Field Executive';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  // 🔹 Fetch Roles
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching roles from:', `${API_BASE_URL}/api/roles/`);
      const response = await fetch(`${API_BASE_URL}/api/roles/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch roles response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 Fetch roles result:', result);
      
      if (result.success && Array.isArray(result.data)) {
        // Handle both response formats: role_id/role_name and id/role_name
        const formatted: Role[] = (result.data as (RoleResponse | Role)[]).map((r: any) => ({
          id: r.role_id || r.id,
          role_name: r.role_name,
        }));
        setRoleData(formatted);
        setRoles(formatted.map((r) => r.role_name));
        console.log('✅ Roles loaded:', { roleData: formatted, roleNames: formatted.map(r => r.role_name) });
      } else {
        console.log('❌ No roles found or API returned unsuccessful response');
        setRoleData([]);
        setRoles([]);
      }
    } catch (error) {
      console.error('💥 Error fetching roles:', error);
      setRoleData([]);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch Employees
  const fetchEmployees = async () => {
    try {
      setIsLoadingEmployees(true);
      console.log('🔍 Fetching employees from:', `${API_BASE_URL}/api/employees/`);
      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch employees response status:', response.status);

      if (!response.ok) {
        console.log('⚠️ Employees API not available, using empty array');
        setEmployees([]);
        return;
      }

      const result = await response.json();
      console.log('📊 Fetch employees result:', result);
      
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data);
        console.log('✅ Employees loaded:', result.data.length);
      } else {
        console.log('❌ No employees found or API returned unsuccessful response');
        setEmployees([]);
      }
    } catch (error) {
      console.error('💥 Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    roles: [] as number[],
    joining_date: '',
  });

  // Fetch roles and employees on component mount
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
  }, []);

  const handleAdd = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.mobile || !formData.password || formData.roles.length === 0 || !formData.joining_date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editMode && editingId) {
        // Update existing employee via API
        const response = await fetch(`${API_BASE_URL}/api/employees/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            roles: formData.roles,
            joining_date: formData.joining_date,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Update local state
          setEmployees(employees.map((emp) =>
            emp.id === editingId
              ? { ...emp, first_name: formData.first_name, last_name: formData.last_name, email: formData.email, mobile: formData.mobile, roles: formData.roles, joining_date: formData.joining_date }
              : emp
          ));
          toast.success('Employee updated successfully');
        } else {
          toast.error(result.message || 'Failed to update employee');
        }
      } else {
        // Add new employee via API
        const response = await fetch(`${API_BASE_URL}/api/employees/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
            roles: formData.roles,
            joining_date: formData.joining_date,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Refresh employees list to get the new employee with proper ID
          await fetchEmployees();
          toast.success('Employee added successfully');
        } else {
          toast.error(result.message || 'Failed to add employee');
        }
      }

      setDialogOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', mobile: '', password: '', roles: [], joining_date: '' });
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (employee: any, role: string) => {
    // Convert role name to role ID if needed
    const roleInfo = roleData.find(r => r.role_name === role);
    const roleIds = employee.roles || (roleInfo ? [roleInfo.id] : []);
    
    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      mobile: employee.mobile || '',
      password: '', // Don't populate password for security
      roles: roleIds,
      joining_date: employee.joining_date || '',
    });
    setEditingId(employee.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, role: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setEmployees(employees.filter((emp) => emp.id !== id));
        toast.success('Employee removed successfully');
      } else {
        toast.error(result.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee. Please try again.');
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ first_name: '', last_name: '', email: '', mobile: '', password: '', roles: [], joining_date: '' });
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    // Capitalize first letter of each word
    const capitalizedRole = newRole.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (roles.includes(capitalizedRole)) {
      toast.error('Role already exists');
      return;
    }

    setIsCreatingRole(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/roles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_name: capitalizedRole
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Refresh the roles list to get the new role with its ID
      await fetchRoles();
      toast.success(`Role "${capitalizedRole}" created successfully`);
      setNewRole('');
      setRoleDialogOpen(false);
      
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role. Please try again.');
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleRoleDialogChange = (open: boolean) => {
    setRoleDialogOpen(open);
    if (!open) {
      setNewRole('');
    }
  };

  // 🔹 Delete Role
  const handleDeleteRole = async (roleToDelete: string) => {
    // Check if any employees have this role
    const hasEmployees = employees.filter(emp => emp.role === roleToDelete).length > 0;

    if (hasEmployees) {
      toast.error('Cannot delete role that is assigned to employees');
      return;
    }

    // Find the role ID from roleData using case-insensitive comparison
    console.log('🗑️ Attempting to delete role:', roleToDelete);
    console.log('📊 Available roleData:', roleData);
    
    const roleInfo = roleData.find(
      (r) => r.role_name.trim().toLowerCase() === roleToDelete.trim().toLowerCase()
    );
    console.log('🔍 Found roleInfo:', roleInfo);
    
    if (!roleInfo) {
      toast.error(`Role "${roleToDelete}" not found in database.`);
      console.error('❌ Role not found in roleData:', { roleToDelete, roleData });
      
      // Still remove from local state since it doesn't exist on server
      setRoles(roles.filter(role => role !== roleToDelete));
      // Remove employees with this role from local state
      setEmployees(employees.filter(emp => emp.role !== roleToDelete));
      return;
    }

    setIsDeletingRole(roleToDelete);

    try {
      const deleteUrl = `${API_BASE_URL}/api/roles/${roleInfo.id}`;
      console.log('🗑️ Deleting role:', { roleToDelete, roleId: roleInfo.id, deleteUrl });
      
      const response = await fetch(deleteUrl, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Delete role error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Role "${roleToDelete}" deleted successfully`);
        await fetchRoles();
        
        // Remove employees with this role from local state
        setEmployees(employees.filter(emp => emp.role !== roleToDelete));
      } else {
        toast.error(result.message || 'Failed to delete role');
      }
      
    } catch (error) {
      console.error('💥 Error deleting role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Role not found')) {
        toast.error(`Role "${roleToDelete}" not found on server. It may have been already deleted.`);
        await fetchRoles(); // Refresh to sync with server
      } else {
        toast.error(`Failed to delete role: ${errorMessage}`);
      }
    } finally {
      setIsDeletingRole(null);
    }
  };



  const handleView = (employee: any, role: string) => {
    setSelectedEmployee({ ...employee, role });
    setViewingDetails(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      available: { label: 'Available', color: 'bg-green-100 text-green-700' },
      'on-job': { label: 'On Job', color: 'bg-blue-100 text-blue-700' },
      busy: { label: 'Busy', color: 'bg-orange-100 text-orange-700' },
    };
    const config = variants[status] || variants.available;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // 🔹 Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading roles...
      </div>
    );
  }

  // If viewing employee details, show their specific page
  if (viewingDetails && selectedEmployee) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-gray-900 mb-2">
              {selectedEmployee.role === 'Sales Person' ? 'Assigned Enquiries' : 'Assigned Jobs'}
            </h1>
            <p className="text-gray-600">
              {selectedEmployee.role === 'Sales Person' 
                ? 'Manage assigned customer enquiries'
                : 'Manage assigned field jobs'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{selectedEmployee.name}</p>
            <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
          </div>
        </div>
        {selectedEmployee.role === 'Sales Person' ? <AssignedEnquiries /> : <AssignedJobs />}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1 sm:mb-2">Employees</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your sales and field teams</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Test API Button - Temporary for debugging */}
         

          {/* Create Role Button */}
          <Dialog open={roleDialogOpen} onOpenChange={handleRoleDialogChange}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-md">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl">Create New Role</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Enter a name for the new employee role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Enter Role Name</Label>
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g., HR Manager"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setRoleDialogOpen(false)} className="flex-1" disabled={isCreatingRole}>
                  Cancel
                  </Button>
                  <Button onClick={handleCreateRole} className="flex-1" disabled={isCreatingRole}>
                  {isCreatingRole ? 'Creating...' : 'Create Role'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create New Employee Button */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Employee
              </Button>
            </DialogTrigger>
          <DialogContent className="p-6 max-w-lg">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl">{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {editMode ? 'Update the employee details' : 'Fill in the employee information below'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Enter first name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Enter last name"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Mobile</Label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Roles</Label>
                <Select
                  value={formData.roles[0]?.toString() || ''}
                  onValueChange={(value: string) => {
                    // Find the role ID from roleData
                    const roleInfo = roleData.find(r => r.role_name === value);
                    if (roleInfo) {
                      setFormData({ ...formData, roles: [roleInfo.id] });
                    }
                  }}
                  disabled={editMode}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleData.map((roleInfo) => (
                      <SelectItem key={roleInfo.id} value={roleInfo.role_name}>{roleInfo.role_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editMode && (
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed when editing</p>
                )}
                {formData.roles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Selected Role IDs: {formData.roles.join(', ')}</p>
                  </div>
                )}
              </div>
              
              {/* <div>
                <Label className="text-sm font-medium">Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                  className="mt-1"
                />
              </div> */}
              
                            <div>
                <Label className="text-sm font-medium">Joining Date</Label>
                <Input
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="flex-1">
                  {editMode ? 'Update Employee' : 'Submit'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Employees</p>
            <p className="text-gray-900">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Sales Persons</p>
            <p className="text-gray-900">{employees.filter(emp => emp.role === 'Sales Person').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Field Executives</p>
            <p className="text-gray-900">{employees.filter(emp => emp.role === 'Field Executive').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Available Executives</p>
            <p className="text-gray-900">
              {employees.filter(emp => emp.role === 'Field Executive' && emp.status === 'available').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={roles.includes('Sales Person') ? 'sales' : roles.includes('Field Executive') ? 'field' : 'roles'} className="space-y-6">
        <TabsList>
          {roles.includes('Sales Person') && (
            <TabsTrigger value="sales">Sales Persons ({employees.filter(emp => emp.role === 'Sales Person').length})</TabsTrigger>
          )}
          {roles.includes('Field Executive') && (
            <TabsTrigger value="field">Field Executives ({employees.filter(emp => emp.role === 'Field Executive').length})</TabsTrigger>
          )}
          {/* Dynamic tabs for custom roles */}
          {roles.filter(role => role !== 'Sales Person' && role !== 'Field Executive').map((role) => {
            const roleEmployeeCount = employees.filter(emp => emp.role === role).length;
            return (
              <TabsTrigger key={role} value={role.toLowerCase()}>
                {role}s ({roleEmployeeCount})
              </TabsTrigger>
            );
          })}
          <TabsTrigger value="roles">Manage Roles</TabsTrigger>
        </TabsList>

        {roles.includes('Sales Person') && (
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Sales Team</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filter by Role:</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees
                      .filter(emp => emp.role === 'Sales Person')
                      .filter(emp => roleFilter === 'All' || roleFilter === 'Sales Person')
                      .map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>{emp.id}</TableCell>
                        <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.mobile}</TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-700">Sales Person</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{emp.assignedEnquiries || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{emp.pendingQuotations || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(emp, 'Sales Person')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(emp, 'Sales Person')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(emp.id, emp.role)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {roles.includes('Field Executive') && (
          <TabsContent value="field" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Field Team</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filter by Role:</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees
                      .filter(emp => emp.role === 'Field Executive')
                      .filter(emp => roleFilter === 'All' || roleFilter === 'Field Executive')
                      .map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>{emp.id}</TableCell>
                        <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.mobile}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">Field Executive</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{emp.totalWorks || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{emp.pendingWorks || 0}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(emp.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(emp, 'Field Executive')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(emp, 'Field Executive')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(emp.id, emp.role)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Dynamic TabsContent for custom roles */}
        {roles.filter(role => role !== 'Sales Person' && role !== 'Field Executive').map((role) => {
          const roleEmployees = employees.filter(emp => emp.role === role);
          const tabValue = role.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <TabsContent key={role} value={tabValue} className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>{role} Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        {/* <TableHead>Department</TableHead> */}
                        <TableHead>Joining Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roleEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.id}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.mobile}</TableCell>
                          <TableCell>
                            <Badge className="bg-orange-100 text-orange-700">{employee.role}</Badge>
                          </TableCell>
                          {/* <TableCell>{employee.department}</TableCell> */}
                          <TableCell>{employee.joiningDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleView(employee, employee.role)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(employee, employee.role)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(employee.id, employee.role)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {roleEmployees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No {role.toLowerCase()} employees yet. Add employees with this role to see them here.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Role ID</TableHead>
                    <TableHead className="text-center">Role Name</TableHead>
                    <TableHead className="text-center">Employee Count</TableHead>
                    <TableHead className="text-center">Created Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleData.map((roleInfo) => {
                    const role = roleInfo.role_name;
                    const employeeCount = employees.filter(emp => emp.role === role).length;
                    
                    return (
                      <TableRow key={roleInfo.id}>
                        <TableCell className="text-center">
                          <span className="text-xs text-gray-600">
                            {roleInfo.id}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-center">{role}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{employeeCount}</Badge>
                        </TableCell>
                        <TableCell className="text-center">Custom Role</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-100 text-blue-700">Custom</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRole(role)}
                              disabled={employeeCount > 0 || isDeletingRole === role}
                              title={employeeCount > 0 ? 'Cannot delete role with assigned employees' : 'Delete role'}
                            >
                              {isDeletingRole === role ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {roleData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>No roles created yet. Create roles to manage employees.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
