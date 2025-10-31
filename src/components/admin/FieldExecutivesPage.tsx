import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { mockFieldExecutives } from '../../lib/mockData';

type FieldExecutive = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  totalWorks: number;
  pendingWorks: number;
  completedWorks: number;
  status: 'available' | 'on-job' | 'busy';
};
import { UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedJobs } from '../field/AssignedJobs';

export function FieldExecutivesPage() {
  const [executives, setExecutives] = useState<FieldExecutive[]>(mockFieldExecutives);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedExecutive, setSelectedExecutive] = useState<FieldExecutive | null>(null);
  const [viewingJobs, setViewingJobs] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string; mobile: string }>({
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
      setExecutives(executives.map((exec) =>
        exec.id === editingId
          ? { ...exec, ...formData } as FieldExecutive
          : exec
      ));
      toast.success('Field executive updated successfully');
    } else {
      const newExecutive: FieldExecutive = {
        id: `FE${String(executives.length + 1).padStart(3, '0')}`,
        ...formData,
        totalWorks: 0,
        pendingWorks: 0,
        completedWorks: 0,
        status: 'available',
      };
      setExecutives([...executives, newExecutive]);
      toast.success('Field executive added successfully');
    }
    setDialogOpen(false);
    setFormData({ name: '', email: '', mobile: '' });
    setEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (executive: FieldExecutive) => {
    setFormData({
      name: executive.name,
      email: executive.email,
      mobile: executive.mobile,
    });
    setEditingId(executive.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExecutives(executives.filter((e) => e.id !== id));
    toast.success('Field executive removed');
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ name: '', email: '', mobile: '' });
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleView = (executive: FieldExecutive) => {
    setSelectedExecutive(executive);
    setViewingJobs(true);
  };

  const handleBackToList = () => {
    setViewingJobs(false);
    setSelectedExecutive(null);
  };

  const getStatusBadge = (status: FieldExecutive['status']) => {
    const variants: Record<FieldExecutive['status'], { label: string; color: string }> = {
      available: { label: 'Available', color: 'bg-green-100 text-green-700' },
      'on-job': { label: 'On Job', color: 'bg-blue-100 text-blue-700' },
      busy: { label: 'Busy', color: 'bg-orange-100 text-orange-700' },
    };
    const config = variants[status] || variants.available;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (viewingJobs && selectedExecutive) {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Assigned Jobs</h1>
            <p className="text-gray-600">Manage your assigned field jobs</p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{selectedExecutive?.name}</p>
            <p className="text-sm text-gray-600">{selectedExecutive?.email}</p>
          </div>
        </div>
        <AssignedJobs />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Field Executives</h1>
          <p className="text-gray-600">Manage your field team</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Field Executive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Field Executive' : 'Add New Field Executive'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the details for the field executive' : 'Enter the details for the new field executive'}
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
                {editMode ? 'Update Field Executive' : 'Add Field Executive'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Executives</p>
            <p className="text-gray-900">{executives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Available</p>
            <p className="text-gray-900">
              {executives.filter((e) => e.status === 'available').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">On Job</p>
            <p className="text-gray-900">
              {executives.filter((e) => e.status === 'on-job').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Completed</p>
            <p className="text-gray-900">
              {executives.reduce((sum, e) => sum + e.completedWorks, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Team ({executives.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Completed</TableHead>
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
                    <Badge variant="secondary">{executive.totalWorks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{executive.pendingWorks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{executive.completedWorks}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(executive.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleView(executive)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEdit(executive)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(executive.id)}
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
