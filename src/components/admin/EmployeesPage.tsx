import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockSalesPersons, mockFieldExecutives } from '../../lib/mockData';
import { UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedEnquiries } from '../sales/AssignedEnquiries';
import { AssignedJobs } from '../field/AssignedJobs';

type EmployeeRole = 'Sales Person' | 'Field Executive';

export function EmployeesPage() {
  const [salesPersons, setSalesPersons] = useState(mockSalesPersons);
  const [executives, setExecutives] = useState(mockFieldExecutives);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    role: '' as EmployeeRole | '',
  });

  const handleAdd = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.role) {
      toast.error('Please fill all fields');
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;

    if (editMode && editingId) {
      // Update existing employee
      if (formData.role === 'Sales Person') {
        setSalesPersons(salesPersons.map((sp) =>
          sp.id === editingId
            ? { ...sp, name: fullName, email: formData.email, mobile: formData.mobile }
            : sp
        ));
      } else {
        setExecutives(executives.map((exec) =>
          exec.id === editingId
            ? { ...exec, name: fullName, email: formData.email, mobile: formData.mobile }
            : exec
        ));
      }
      toast.success('Employee updated successfully');
    } else {
      // Add new employee
      if (formData.role === 'Sales Person') {
        const newSalesPerson = {
          id: `SP${String(salesPersons.length + 1).padStart(3, '0')}`,
          name: fullName,
          email: formData.email,
          mobile: formData.mobile,
          assignedEnquiries: 0,
          completedJobs: 0,
          pendingQuotations: 0,
        };
        setSalesPersons([...salesPersons, newSalesPerson]);
      } else {
        const newExecutive = {
          id: `FE${String(executives.length + 1).padStart(3, '0')}`,
          name: fullName,
          email: formData.email,
          mobile: formData.mobile,
          totalWorks: 0,
          pendingWorks: 0,
          completedWorks: 0,
          status: 'available' as const,
        };
        setExecutives([...executives, newExecutive]);
      }
      toast.success(`${formData.role} added successfully`);
    }

    setDialogOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', mobile: '', role: '' });
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (employee: any, role: EmployeeRole) => {
    const [firstName, ...lastNameParts] = employee.name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    setFormData({
      firstName,
      lastName,
      email: employee.email,
      mobile: employee.mobile,
      role,
    });
    setEditingId(employee.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string, role: EmployeeRole) => {
    if (role === 'Sales Person') {
      setSalesPersons(salesPersons.filter((sp) => sp.id !== id));
    } else {
      setExecutives(executives.filter((e) => e.id !== id));
    }
    toast.success('Employee removed');
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', role: '' });
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleView = (employee: any, role: EmployeeRole) => {
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
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Add Employee</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4 sm:p-6 max-w-md">
            <DialogHeader className="space-y-1 sm:space-y-2">
              <DialogTitle className="text-base sm:text-lg">{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {editMode ? 'Update the employee details' : 'Enter the details for the new employee'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm">First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: EmployeeRole) => setFormData({ ...formData, role: value })}
                  disabled={editMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales Person">Sales Person</SelectItem>
                    <SelectItem value="Field Executive">Field Executive</SelectItem>
                  </SelectContent>
                </Select>
                {editMode && (
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed when editing</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1">
                  {editMode ? 'Update Employee' : 'Add Employee'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Employees</p>
            <p className="text-gray-900">{salesPersons.length + executives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Sales Persons</p>
            <p className="text-gray-900">{salesPersons.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Field Executives</p>
            <p className="text-gray-900">{executives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Available Executives</p>
            <p className="text-gray-900">
              {executives.filter((e) => e.status === 'available').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Sales Persons ({salesPersons.length})</TabsTrigger>
          <TabsTrigger value="field">Field Executives ({executives.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Team</CardTitle>
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
                  {salesPersons.map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell>{sp.id}</TableCell>
                      <TableCell>{sp.name}</TableCell>
                      <TableCell>{sp.email}</TableCell>
                      <TableCell>{sp.mobile}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-700">Sales Person</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sp.assignedEnquiries}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sp.pendingQuotations}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(sp, 'Sales Person')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(sp, 'Sales Person')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(sp.id, 'Sales Person')}
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

        <TabsContent value="field" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Team</CardTitle>
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
                  {executives.map((executive) => (
                    <TableRow key={executive.id}>
                      <TableCell>{executive.id}</TableCell>
                      <TableCell>{executive.name}</TableCell>
                      <TableCell>{executive.email}</TableCell>
                      <TableCell>{executive.mobile}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">Field Executive</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{executive.totalWorks}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{executive.pendingWorks}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(executive.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(executive, 'Field Executive')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(executive, 'Field Executive')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(executive.id, 'Field Executive')}
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
      </Tabs>
    </div>
  );
}
