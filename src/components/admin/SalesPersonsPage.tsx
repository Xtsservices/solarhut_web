import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { mockSalesPersons } from '../../lib/mockData';
import { UserPlus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedEnquiries } from '../sales/AssignedEnquiries';

export function SalesPersonsPage() {
  const [salesPersons, setSalesPersons] = useState(mockSalesPersons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<any>(null);
  const [viewingEnquiries, setViewingEnquiries] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (editMode && editingId) {
      setSalesPersons(salesPersons.map((sp) =>
        sp.id === editingId
          ? { ...sp, ...formData }
          : sp
      ));
      toast.success('Sales person updated successfully');
    } else {
      const newSalesPerson = {
        id: `SP${String(salesPersons.length + 1).padStart(3, '0')}`,
        ...formData,
        assignedEnquiries: 0,
        completedJobs: 0,
        pendingQuotations: 0,
      };
      setSalesPersons([...salesPersons, newSalesPerson]);
      toast.success('Sales person added successfully');
    }
    
    setDialogOpen(false);
    setFormData({ name: '', email: '', mobile: '' });
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (salesPerson: any) => {
    setFormData({
      name: salesPerson.name,
      email: salesPerson.email,
      mobile: salesPerson.mobile,
    });
    setEditingId(salesPerson.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSalesPersons(salesPersons.filter((sp) => sp.id !== id));
    toast.success('Sales person removed');
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ name: '', email: '', mobile: '' });
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleView = (salesPerson: any) => {
    setSelectedSalesPerson(salesPerson);
    setViewingEnquiries(true);
  };

  const handleBackToList = () => {
    setViewingEnquiries(false);
    setSelectedSalesPerson(null);
  };

  // If viewing enquiries, show the full screen
  if (viewingEnquiries && selectedSalesPerson) {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Assigned Enquiries</h1>
            <p className="text-gray-600">Manage your assigned customer enquiries</p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{selectedSalesPerson.name}</p>
            <p className="text-sm text-gray-600">{selectedSalesPerson.email}</p>
          </div>
        </div>
        <AssignedEnquiries />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Sales Persons</h1>
          <p className="text-gray-600">Manage your sales team</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Sales Person
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Sales Person' : 'Add New Sales Person'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the details for the sales person' : 'Enter the details for the new sales person'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile"
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                {editMode ? 'Update Sales Person' : 'Add Sales Person'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Sales Persons</p>
            <p className="text-gray-900">{salesPersons.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Assigned</p>
            <p className="text-gray-900">
              {salesPersons.reduce((sum, sp) => sum + sp.assignedEnquiries, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Completed</p>
            <p className="text-gray-900">
              {salesPersons.reduce((sum, sp) => sum + sp.completedJobs, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Pending Quotations</p>
            <p className="text-gray-900">
              {salesPersons.reduce((sum, sp) => sum + sp.pendingQuotations, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle>Sales Team ({salesPersons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Completed</TableHead>
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
                    <Badge variant="secondary">{sp.assignedEnquiries}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{sp.completedJobs}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sp.pendingQuotations}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleView(sp)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEdit(sp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(sp.id)}
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
    </div>
  );
}
