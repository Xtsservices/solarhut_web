import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: string;
  role_name: string;
  created_date: string;
}

interface Feature {
  id: string;
  feature_name: string;
  created_date: string;
}

interface Permission {
  id: string;
  role_id: string;
  feature_id: string;
  create: boolean;
  read: boolean;
  edit: boolean;
  delete: boolean;
  created_date: string;
}


const initialFeatures: Feature[] = [
  { id: '1', feature_name: 'Enquiries', created_date: '2025-01-10' },
  { id: '2', feature_name: 'Payments', created_date: '2025-01-10' },
  { id: '3', feature_name: 'Reports', created_date: '2025-01-10' },
  { id: '4', feature_name: 'Employees', created_date: '2025-01-10' },
];

const initialPermissions: Permission[] = [
  {
    id: '1',
    role_id: '1',
    feature_id: '1',
    create: true,
    read: true,
    edit: true,
    delete: true,
    created_date: '2025-01-10',
  },
  {
    id: '2',
    role_id: '1',
    feature_id: '2',
    create: true,
    read: true,
    edit: true,
    delete: false,
    created_date: '2025-01-10',
  },
  {
    id: '3',
    role_id: '2',
    feature_id: '1',
    create: true,
    read: true,
    edit: true,
    delete: false,
    created_date: '2025-01-10',
  },
];

export default function MastersPage() {
  // State for Roles
  const [roles, setRoles] = useState<Role[]>([]);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormData, setRoleFormData] = useState({ role_name: '' });
  const [roleFormErrors, setRoleFormErrors] = useState({ role_name: '' });
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  // Pagination state for Roles (must be after roles state)
  const [rolesPage, setRolesPage] = useState(1);
  const rolesPerPage = 10;
  const totalRolesPages = Math.ceil(roles.length / rolesPerPage);
  const paginatedRoles = roles.slice((rolesPage - 1) * rolesPerPage, rolesPage * rolesPerPage);
  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch roles from API
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const result = await response.json();
      let data = Array.isArray(result) ? result : result.data;
      if (!Array.isArray(data) && result.roles) data = result.roles;
      const mappedRoles = (data || []).map((r: any, idx: number) => {
        if (typeof r === 'string') {
          return {
            id: (idx + 1).toString(),
            role_name: r,
            created_date: '',
          };
        } else {
          return {
            id: r.id?.toString() || r.role_id?.toString() || r._id?.toString() || (idx + 1).toString(),
            role_name: r.role_name || r.name || r.role || '',
            created_date: r.created_date || r.created_at || '',
          };
        }
      });
      setRoles(mappedRoles);
    } catch (err) {
      toast.error('Error loading roles');
      setRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Fetch features from API
  const fetchFeatures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/features`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch features');
      const result = await response.json();
      let data = Array.isArray(result) ? result : result.data;
      if (!Array.isArray(data) && result.features) data = result.features;
      const mappedFeatures = (data || []).map((f: any, idx: number) => ({
        id: f.id?.toString() || f.feature_id?.toString() || f._id?.toString() || (idx + 1).toString(),
        feature_name: f.feature_name || f.name || '',
        created_date: f.created_date || f.created_at || '',
      }));
      setFeatures(mappedFeatures);
    } catch (err) {
      toast.error('Error loading features');
      setFeatures([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchFeatures();
  }, []);

  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureFormData, setFeatureFormData] = useState({ feature_name: '' });
  const [featureFormErrors, setFeatureFormErrors] = useState({ feature_name: '' });
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  // State for Permissions
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');
  const [permissionChecks, setPermissionChecks] = useState({
    create: false,
    read: false,
    edit: false,
    delete: false,
  });
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null);

  // ========== ROLES FUNCTIONS ==========

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleFormData({ role_name: '' });
    setRoleFormErrors({ role_name: '' });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({ role_name: role.role_name });
    setRoleFormErrors({ role_name: '' });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    // Validate
    if (!roleFormData.role_name.trim()) {
      setRoleFormErrors({ role_name: 'Role name is required' });
      return;
    }
    try {
      if (editingRole) {
        // Edit role
        const response = await fetch(`${API_BASE_URL}/api/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_name: roleFormData.role_name }),
        });
        if (!response.ok) throw new Error('Failed to update role');
        toast.success('Role updated successfully');
      } else {
        // Create role
        const response = await fetch(`${API_BASE_URL}/api/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_name: roleFormData.role_name }),
        });
        if (!response.ok) throw new Error('Failed to add role');
        toast.success('Role added successfully');
      }
      fetchRoles();
      setIsRoleDialogOpen(false);
      setRoleFormData({ role_name: '' });
      setEditingRole(null);
    } catch (err) {
      toast.error('Error saving role');
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete role');
      toast.success('Role deleted successfully');
      fetchRoles();
      setPermissions(permissions.filter((p) => p.role_id !== id));
    } catch (err) {
      toast.error('Error deleting role');
    } finally {
      setRoleToDelete(null);
    }
  };

  // ========== FEATURES FUNCTIONS ==========

  const handleAddFeature = () => {
    setEditingFeature(null);
    setFeatureFormData({ feature_name: '' });
    setFeatureFormErrors({ feature_name: '' });
    setIsFeatureDialogOpen(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setFeatureFormData({ feature_name: feature.feature_name });
    setFeatureFormErrors({ feature_name: '' });
    setIsFeatureDialogOpen(true);
  };

  const handleSaveFeature = async () => {
    // Validate
    if (!featureFormData.feature_name.trim()) {
      setFeatureFormErrors({ feature_name: 'Feature name is required' });
      return;
    }
    const token = localStorage.getItem('authtoken');
     console.log(token,"authToken");
    try {
      if (editingFeature) {
        // Update existing feature via backend
        const response = await fetch(`${API_BASE_URL}/api/features/${editingFeature.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ feature_name: featureFormData.feature_name }),
        });
        const result = await response.json();
        if (result.success) {
          toast.success('Feature updated successfully');
          fetchFeatures();
        } else {
          toast.error(result.message || 'Failed to update feature');
        }
      } else {
        // Add new feature via backend
        const response = await fetch(`${API_BASE_URL}/api/features`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ feature_name: featureFormData.feature_name }),
        });
        const result = await response.json();
        if (result.success) {
          toast.success('Feature added successfully');
          fetchFeatures();
        } else {
          toast.error(result.message || 'Failed to add feature');
        }
      }
    } catch (err) {
      toast.error('Error saving feature');
    }
    setIsFeatureDialogOpen(false);
    setFeatureFormData({ feature_name: '' });
    setEditingFeature(null);
  };

  const handleDeleteFeature = async (id: string) => {
    const token = localStorage.getItem('authtoken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/features/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Feature deleted successfully');
        fetchFeatures();
        setPermissions(permissions.filter((p) => p.feature_id !== id));
      } else {
        toast.error(result.message || 'Failed to delete feature');
      }
    } catch (err) {
      toast.error('Error deleting feature');
    }
    setFeatureToDelete(null);
  };

  // ========== PERMISSIONS FUNCTIONS ==========

  const handlePermissionCheckChange = (field: keyof typeof permissionChecks, checked: boolean) => {
    setPermissionChecks({ ...permissionChecks, [field]: checked });
  };

  const handleRoleFeatureSelect = (roleId: string, featureId: string) => {
    setSelectedRoleId(roleId);
    setSelectedFeatureId(featureId);

    // Load existing permission if exists
    const existingPermission = permissions.find(
      (p) => p.role_id === roleId && p.feature_id === featureId
    );

    if (existingPermission) {
      setPermissionChecks({
        create: existingPermission.create,
        read: existingPermission.read,
        edit: existingPermission.edit,
        delete: existingPermission.delete,
      });
    } else {
      setPermissionChecks({
        create: false,
        read: false,
        edit: false,
        delete: false,
      });
    }
  };

  const handleSubmitPermission = () => {
    // Validate
    if (!selectedRoleId) {
      toast.error('Please select a role');
      return;
    }
    if (!selectedFeatureId) {
      toast.error('Please select a feature');
      return;
    }

    const existingPermission = permissions.find(
      (p) => p.role_id === selectedRoleId && p.feature_id === selectedFeatureId
    );

    // Check if at least one permission is selected
    const hasAnyPermission = Object.values(permissionChecks).some((v) => v);

    if (existingPermission) {
      if (hasAnyPermission) {
        // Update existing permission
        setPermissions(
          permissions.map((p) =>
            p.id === existingPermission.id
              ? {
                  ...p,
                  create: permissionChecks.create,
                  read: permissionChecks.read,
                  edit: permissionChecks.edit,
                  delete: permissionChecks.delete,
                }
              : p
          )
        );
        toast.success('Permission updated successfully');
      } else {
        // Delete if no permissions selected
        setPermissions(permissions.filter((p) => p.id !== existingPermission.id));
        toast.info('Permission removed');
      }
    } else {
      if (hasAnyPermission) {
        // Create new permission
        const newPermission: Permission = {
          id: Date.now().toString(),
          role_id: selectedRoleId,
          feature_id: selectedFeatureId,
          create: permissionChecks.create,
          read: permissionChecks.read,
          edit: permissionChecks.edit,
          delete: permissionChecks.delete,
          created_date: new Date().toISOString().split('T')[0],
        };
        setPermissions([...permissions, newPermission]);
        toast.success('Permission added successfully');
      } else {
        toast.error('Please select at least one permission');
        return;
      }
    }

    // Reset form
    setSelectedRoleId('');
    setSelectedFeatureId('');
    setPermissionChecks({
      create: false,
      read: false,
      edit: false,
      delete: false,
    });
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionChecks({
      create: permission.create,
      read: permission.read,
      edit: permission.edit,
      delete: permission.delete,
    });
    setIsPermissionDialogOpen(true);
  };

  const handleSavePermissionEdit = () => {
    if (!editingPermission) return;

    setPermissions(
      permissions.map((p) =>
        p.id === editingPermission.id
          ? {
              ...p,
              create: permissionChecks.create,
              read: permissionChecks.read,
              edit: permissionChecks.edit,
              delete: permissionChecks.delete,
            }
          : p
      )
    );

    toast.success('Permission updated successfully');
    setIsPermissionDialogOpen(false);
    setEditingPermission(null);
    setPermissionChecks({ create: false, read: false, edit: false, delete: false });
  };

  const handleDeletePermission = (id: string) => {
    setPermissions(permissions.filter((p) => p.id !== id));
    toast.success('Permission deleted successfully');
    setPermissionToDelete(null);
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.role_name || 'Unknown';
  };


  // Format date as DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFeatureName = (featureId: string) => {
    return features.find((f) => f.id === featureId)?.feature_name || 'Unknown';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ color: '#111827', margin: 0 }}>Masters</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Manage roles, features, and permissions
        </p>
      </div>

      <Tabs defaultValue="roles" style={{ width: '100%' }}>
        <TabsList style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%', marginBottom: '1rem' }}>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* ========== ROLES TAB ========== */}
        <TabsContent value="roles">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Roles List</CardTitle>
              <Button
                onClick={handleAddRole}
                style={{ backgroundColor: '#F97316', color: 'white' }}
              >
                <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px', textAlign: 'center' }}>Role ID</TableHead>
                      <TableHead style={{ textAlign: 'center' }}>Role Name</TableHead>
                      <TableHead style={{ textAlign: 'center' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingRoles ? (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                          Loading roles...
                        </TableCell>
                      </TableRow>
                    ) : roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                          No roles found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRoles.map((role, index) => (
                        <TableRow key={role.id}>
                          <TableCell style={{ textAlign: 'center' }}>{role.id}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{role.role_name}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRoleToDelete(role.id)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
              {/* Table info and pagination controls - flex row, left/right alignment */}
              <tr>
                <td colSpan={3} style={{ padding: '0.5rem 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* Left side: Showing X to Y of Z entries */}
                    <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {roles.length === 0
                        ? 'Showing 0 entries'
                        : `Showing ${(rolesPage - 1) * rolesPerPage + 1} to ${Math.min(rolesPage * rolesPerPage, roles.length)} of ${roles.length} entries`}
                    </span>
                    {/* Right side: Pagination Controls */}
                    {roles.length > rolesPerPage && (
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={rolesPage === 1}
                          onClick={() => setRolesPage(rolesPage - 1)}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: totalRolesPages }, (_, i) => (
                          <Button
                            key={i + 1}
                            variant={rolesPage === i + 1 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setRolesPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={rolesPage === totalRolesPages}
                          onClick={() => setRolesPage(rolesPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== FEATURES TAB ========== */}
        <TabsContent value="features">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Features List</CardTitle>
              <Button
                onClick={handleAddFeature}
                style={{ backgroundColor: '#F97316', color: 'white' }}
              >
                <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                Add Feature
              </Button>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '80px', textAlign: 'center' }}>S.No</TableHead>
                      <TableHead style={{ textAlign: 'center' }}>Feature Name</TableHead>
                      <TableHead style={{ textAlign: 'center' }}>Created Date</TableHead>
                      <TableHead style={{ textAlign: 'center' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature, index) => (
                      <TableRow key={feature.id}>
                        <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{feature.feature_name}</TableCell>
                        <TableCell style={{ textAlign: 'center', color: '#6B7280' }}>{formatDate(feature.created_date)}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFeature(feature)}
                              style={{ padding: 0, height: '2rem', width: '2rem' }}
                            >
                              <Pencil style={{ height: '1rem', width: '1rem', color: '#2563EB' }} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFeatureToDelete(feature.id)}
                              style={{ padding: 0, height: '2rem', width: '2rem' }}
                            >
                              <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== PERMISSIONS TAB ========== */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader style={{ paddingBottom: '1rem' }}>
              <CardTitle>Role-Based Permissions</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Form Container */}
              <div style={{ padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem', alignItems: 'end' }}>
                  {/* Role Dropdown */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label>
                      Role <span style={{ color: '#EF4444' }}>*</span>
                    </Label>
                    <Select
                      value={selectedRoleId}
                      onValueChange={(value) => {
                        if (selectedFeatureId) {
                          handleRoleFeatureSelect(value, selectedFeatureId);
                        } else {
                          setSelectedRoleId(value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feature Dropdown */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label>
                      Feature <span style={{ color: '#EF4444' }}>*</span>
                    </Label>
                    <Select
                      value={selectedFeatureId}
                      onValueChange={(value) => {
                        if (selectedRoleId) {
                          handleRoleFeatureSelect(selectedRoleId, value);
                        } else {
                          setSelectedFeatureId(value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Feature" />
                      </SelectTrigger>
                      <SelectContent>
                        {features.map((feature) => (
                          <SelectItem key={feature.id} value={feature.id}>
                            {feature.feature_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Permissions Checkboxes */}
                  <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label>Permissions</Label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', paddingTop: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Checkbox
                          id="create"
                          checked={permissionChecks.create}
                          onCheckedChange={(checked: boolean) =>
                            handlePermissionCheckChange('create', checked)
                          }
                          disabled={!selectedRoleId || !selectedFeatureId}
                        />
                        <label htmlFor="create" style={{ cursor: 'pointer', userSelect: 'none' }}>
                          Create
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Checkbox
                          id="read"
                          checked={permissionChecks.read}
                          onCheckedChange={(checked: boolean) =>
                            handlePermissionCheckChange('read', checked)
                          }
                          disabled={!selectedRoleId || !selectedFeatureId}
                        />
                        <label htmlFor="read" style={{ cursor: 'pointer', userSelect: 'none' }}>
                          Read
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Checkbox
                          id="edit"
                          checked={permissionChecks.edit}
                          onCheckedChange={(checked: boolean) =>
                            handlePermissionCheckChange('edit', checked)
                          }
                          disabled={!selectedRoleId || !selectedFeatureId}
                        />
                        <label htmlFor="edit" style={{ cursor: 'pointer', userSelect: 'none' }}>
                          Edit
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Checkbox
                          id="delete"
                          checked={permissionChecks.delete}
                          onCheckedChange={(checked: boolean) =>
                            handlePermissionCheckChange('delete', checked)
                          }
                          disabled={!selectedRoleId || !selectedFeatureId}
                        />
                        <label htmlFor="delete" style={{ cursor: 'pointer', userSelect: 'none' }}>
                          Delete
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label style={{ opacity: 0, visibility: 'hidden' }}>Action</Label>
                    <Button
                      onClick={handleSubmitPermission}
                      style={{ backgroundColor: '#F97316', color: 'white', width: '100%' }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Permissions Table */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: '#374151' }}>
                  Permissions List
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ width: '64px', textAlign: 'center' }}>S.No</TableHead>
                        <TableHead style={{ textAlign: 'center' }}>Role</TableHead>
                        <TableHead style={{ textAlign: 'center' }}>Feature</TableHead>
                        <TableHead style={{ textAlign: 'center', width: '64px' }}>C</TableHead>
                        <TableHead style={{ textAlign: 'center', width: '64px' }}>R</TableHead>
                        <TableHead style={{ textAlign: 'center', width: '64px' }}>E</TableHead>
                        <TableHead style={{ textAlign: 'center', width: '64px' }}>D</TableHead>
                        <TableHead style={{ textAlign: 'center' }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission, index) => (
                        <TableRow key={permission.id}>
                          <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{getRoleName(permission.role_id)}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{getFeatureName(permission.feature_id)}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {permission.create ? (
                              <Check style={{ height: '1rem', width: '1rem', color: '#16A34A', margin: '0 auto' }} />
                            ) : (
                              <X style={{ height: '1rem', width: '1rem', color: '#DC2626', margin: '0 auto' }} />
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {permission.read ? (
                              <Check style={{ height: '1rem', width: '1rem', color: '#16A34A', margin: '0 auto' }} />
                            ) : (
                              <X style={{ height: '1rem', width: '1rem', color: '#DC2626', margin: '0 auto' }} />
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {permission.edit ? (
                              <Check style={{ height: '1rem', width: '1rem', color: '#16A34A', margin: '0 auto' }} />
                            ) : (
                              <X style={{ height: '1rem', width: '1rem', color: '#DC2626', margin: '0 auto' }} />
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {permission.delete ? (
                              <Check style={{ height: '1rem', width: '1rem', color: '#16A34A', margin: '0 auto' }} />
                            ) : (
                              <X style={{ height: '1rem', width: '1rem', color: '#DC2626', margin: '0 auto' }} />
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPermission(permission)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Pencil style={{ height: '1rem', width: '1rem', color: '#2563EB' }} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPermissionToDelete(permission.id)}
                                style={{ padding: 0, height: '2rem', width: '2rem' }}
                              >
                                <Trash2 style={{ height: '1rem', width: '1rem', color: '#DC2626' }} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========== ROLE ADD/EDIT DIALOG ========== */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
            <DialogDescription>
              {editingRole ? 'Update the role name below.' : 'Enter a name for the new role.'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="role_name">
                Role Name <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="role_name"
                value={roleFormData.role_name}
                onChange={(e) => {
                  setRoleFormData({ role_name: e.target.value });
                  setRoleFormErrors({ role_name: '' });
                }}
                placeholder="Enter role name"
                style={roleFormErrors.role_name ? { borderColor: '#EF4444' } : {}}
              />
              {roleFormErrors.role_name && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>
                  {roleFormErrors.role_name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} style={{ backgroundColor: '#F97316', color: 'white' }}>
              {editingRole ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== FEATURE ADD/EDIT DIALOG ========== */}
      <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeature ? 'Edit Feature' : 'Add Feature'}</DialogTitle>
            <DialogDescription>
              {editingFeature
                ? 'Update the feature name below.'
                : 'Enter a name for the new feature (e.g., Payments, Contacts).'}
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="feature_name">
                Feature Name <span style={{ color: '#EF4444' }}>*</span>
              </Label>
              <Input
                id="feature_name"
                value={featureFormData.feature_name}
                onChange={(e) => {
                  setFeatureFormData({ feature_name: e.target.value });
                  setFeatureFormErrors({ feature_name: '' });
                }}
                placeholder="Enter feature name (e.g., Payments, Contacts)"
                style={featureFormErrors.feature_name ? { borderColor: '#EF4444' } : {}}
              />
              {featureFormErrors.feature_name && (
                <p style={{ fontSize: '0.875rem', color: '#EF4444', margin: 0 }}>
                  {featureFormErrors.feature_name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsFeatureDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeature} style={{ backgroundColor: '#F97316', color: 'white' }}>
              {editingFeature ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== PERMISSION EDIT DIALOG ========== */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the CRED permissions for this role-feature combination.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id="edit_create"
                  checked={permissionChecks.create}
                  onCheckedChange={(checked: boolean) =>
                    setPermissionChecks({ ...permissionChecks, create: checked })
                  }
                />
                <label htmlFor="edit_create" style={{ cursor: 'pointer' }}>
                  Create
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id="edit_read"
                  checked={permissionChecks.read}
                  onCheckedChange={(checked: boolean) =>
                    setPermissionChecks({ ...permissionChecks, read: checked })
                  }
                />
                <label htmlFor="edit_read" style={{ cursor: 'pointer' }}>
                  Read
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id="edit_edit"
                  checked={permissionChecks.edit}
                  onCheckedChange={(checked: boolean) =>
                    setPermissionChecks({ ...permissionChecks, edit: checked })
                  }
                />
                <label htmlFor="edit_edit" style={{ cursor: 'pointer' }}>
                  Edit
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkbox
                  id="edit_delete"
                  checked={permissionChecks.delete}
                  onCheckedChange={(checked: boolean) =>
                    setPermissionChecks({ ...permissionChecks, delete: checked })
                  }
                />
                <label htmlFor="edit_delete" style={{ cursor: 'pointer' }}>
                  Delete
                </label>
              </div>
            </div>
          </div>
          <DialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissionEdit} style={{ backgroundColor: '#F97316', color: 'white' }}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========== DELETE CONFIRMATIONS ========== */}
      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? This will also remove all associated
              permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roleToDelete && handleDeleteRole(roleToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!featureToDelete} onOpenChange={() => setFeatureToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feature? This will also remove all associated
              permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => featureToDelete && handleDeleteFeature(featureToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!permissionToDelete} onOpenChange={() => setPermissionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this permission?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter style={{ display: 'flex', gap: '0.5rem' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => permissionToDelete && handleDeletePermission(permissionToDelete)}
              style={{ backgroundColor: '#EF4444', color: 'white' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};