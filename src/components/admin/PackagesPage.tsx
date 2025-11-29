import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Package, Plus, Edit, Trash2, RefreshCw, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SolarPackage {
  id?: string | number;
  name: string;
  capacity: string;
  price: string;
  originalPrice: string;
  savings: string;
  monthlyGeneration: string;
  features: string[];
  recommended?: boolean;
  status?: string;
}

export function PackagesPage() {
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Added for inline errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price: '',
    originalPrice: '',
    savings: '',
    monthlyGeneration: '',
    features: '',
    recommended: false,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const getToken = () => localStorage.getItem('authToken');

  const loadPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setPackages(result.data.map((pkg: any) => ({
          ...pkg,
          features: typeof pkg.features === 'string' ? pkg.features.split(',').map((f: string) => f.trim()) : pkg.features || [],
          price: pkg.price !== undefined && pkg.price !== null ? String(pkg.price) : '',
          originalPrice: pkg.original_price !== undefined && pkg.original_price !== null ? String(pkg.original_price) : '',
          savings: pkg.savings !== undefined && pkg.savings !== null ? String(pkg.savings) : '',
          monthlyGeneration: pkg.monthly_generation !== undefined && pkg.monthly_generation !== null ? String(pkg.monthly_generation) : '',
          recommended: pkg.recommended === true,
        })));
      } else {
        setPackages([]);
      }
    } catch (error) {
      toast.error('Failed to load packages');
      setPackages([]);
    }
  };

  const handleAdd = async () => {
    // Reset previous errors
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Package name is required';
    if (!formData.capacity.trim()) newErrors.capacity = 'Capacity is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';

    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (featuresArray.length === 0) {
      newErrors.features = 'Please add at least one feature';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors below');
      return;
    }

    const token = getToken();
    const payload = {
      name: formData.name,
      capacity: formData.capacity,
      price: formData.price,
      original_price: formData.originalPrice,
      savings: formData.savings,
      monthly_generation: formData.monthlyGeneration,
      features: featuresArray.join(', '),
      status: 'Active',
    };

    try {
      let url = `${API_BASE_URL}/api/packages`;
      let method = 'POST';
      if (editMode && editingId) {
        url = `${API_BASE_URL}/api/packages/${editingId}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(editMode ? 'Package updated successfully' : 'Package added successfully');
        loadPackages();
        handleDialogClose();
      } else {
        toast.error(result.message || 'Failed to save package');
      }
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const handleEdit = (pkg: SolarPackage) => {
    setFormData({
      name: pkg.name,
      capacity: pkg.capacity,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      savings: pkg.savings,
      monthlyGeneration: pkg.monthlyGeneration,
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : pkg.features,
      recommended: pkg.recommended === true,
    });
    setEditingId(pkg.id?.toString() ?? '');
    setEditMode(true);
    setDialogOpen(true);
    setErrors({}); // clear errors when editing
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      const token = getToken();
      try {
        const response = await fetch(`${API_BASE_URL}/api/packages/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        const result = await response.json();
        if (result.success) {
          toast.success('Package deleted successfully');
          loadPackages();
        } else {
          toast.error(result.message || 'Failed to delete package');
        }
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleReset = () => {
    toast.info('Reset to defaults is not available for backend API.');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      name: '',
      capacity: '',
      price: '',
      originalPrice: '',
      savings: '',
      monthlyGeneration: '',
      features: '',
      recommended: false,
    });
    setErrors({});
    setEditMode(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {(() => {
        const activePackages = packages.filter(pkg => String(pkg.status).toLowerCase() === 'active');
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-gray-900 mb-1 sm:mb-2">Solar Packages</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage packages displayed on the website</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FFA500] hover:bg-[#FF8C00] gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Package</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader className="space-y-1 sm:space-y-2">
                      <DialogTitle className="text-base sm:text-lg">
                        {editMode ? 'Edit Package' : 'Add New Package'}
                      </DialogTitle>
                      <DialogDescription className="text-xs sm:text-sm">
                        {editMode ? 'Update the package details' : 'Create a new solar package for your website'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4 mt-4">
                      {/* Package Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs sm:text-sm" htmlFor="package-name">Package Name </Label>
                          <Input
                            id="package-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Starter Home"
                            className={`mt-1 text-sm ${errors.name ? 'border-red-600' : ''}`}
                          />
                          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>
                        {/* Capacity */}
                        <div>
                          <Label className="text-xs sm:text-sm" htmlFor="package-capacity">Capacity </Label>
                          <Input
                            id="package-capacity"
                            value={formData.capacity}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                setFormData({ ...formData, capacity: value });
                              }
                            }}
                            placeholder="e.g., 3"
                            className={`mt-1 text-sm ${errors.capacity ? 'border-red-600' : ''}`}
                            inputMode="decimal"
                            type="text"
                          />
                          {errors.capacity && <p className="text-red-600 text-xs mt-1">{errors.capacity}</p>}
                        </div>
                      </div>

                      {/* Price, Original Price, Savings */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-xs sm:text-sm" htmlFor="package-price">Price (₹) </Label>
                          <Input
                            id="package-price"
                            value={formData.price}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ ...formData, price: value });
                            }}
                            placeholder="e.g., 180000"
                            className={`mt-1 text-sm ${errors.price ? 'border-red-600' : ''}`}
                            inputMode="numeric"
                            type="text"
                          />
                          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm" htmlFor="package-original-price">Original Price (₹)</Label>
                          <Input
                            id="package-original-price"
                            value={formData.originalPrice}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ ...formData, originalPrice: value });
                            }}
                            placeholder="e.g., 240000"
                            className="mt-1 text-sm"
                            inputMode="numeric"
                            type="text"
                          />
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm" htmlFor="package-savings">Savings Text</Label>
                          <Input
                            id="package-savings"
                            value={formData.savings}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData({ ...formData, savings: value });
                            }}
                            placeholder="e.g., 60000"
                            className="mt-1 text-sm"
                            inputMode="numeric"
                            type="text"
                          />
                        </div>
                      </div>

                      {/* Monthly Generation */}
                      <div>
                        <Label className="text-xs sm:text-sm" htmlFor="package-monthly-generation">Monthly Generation</Label>
                        <Input
                          id="package-monthly-generation"
                          value={formData.monthlyGeneration}
                          onChange={(e) => setFormData({ ...formData, monthlyGeneration: e.target.value })}
                          placeholder="e.g., 360-450 units"
                          className="mt-1 text-sm"
                        />
                      </div>

                      {/* Features */}
                      <div>
                        <Label className="text-xs sm:text-sm" htmlFor="package-features">Features</Label>
                        <Textarea
                          id="package-features"
                          value={formData.features}
                          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                          placeholder={`12 High-efficiency solar panels\n3 kW string inverter\nNet metering setup`}
                          rows={6}
                          className={`mt-1 text-sm font-mono ${errors.features ? 'border-red-600' : ''}`}
                        />
                        {errors.features && <p className="text-red-600 text-xs mt-1">{errors.features}</p>}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={handleDialogClose}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAdd}
                          className="flex-1 bg-[#FFA500] hover:bg-[#FF8C00]"
                        >
                          {editMode ? 'Update Package' : 'Add Package'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Rest of your UI (cards, table, mobile view, empty state) remains 100% unchanged */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-8 w-8 text-[#FFA500]" />
                    <div>
                      <p className="text-xs text-gray-600">Total Packages</p>
                      <p className="text-xl sm:text-2xl text-gray-900">{activePackages.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="hidden md:block">
              <CardHeader className="p-3 sm:p-4 md:p-5">
                <CardTitle className="text-sm sm:text-base md:text-lg">All Packages</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Capacity</TableHead>
                        <TableHead className="text-xs sm:text-sm">Price</TableHead>
                        <TableHead className="text-xs sm:text-sm">Monthly Gen.</TableHead>
                        {/* <TableHead className="text-xs sm:text-sm">Status</TableHead> */}
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activePackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="text-xs sm:text-sm font-medium">{pkg.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{pkg.capacity}KW</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center">
                              <IndianRupee className="h-3 w-3" />
                              {pkg.price}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">{pkg.monthlyGeneration}</TableCell>
                          {/* <TableCell className="text-xs sm:text-sm">
                            {pkg.recommended && (
                              <Badge variant="secondary" className="bg-[#FFA500] text-white text-xs">
                                Popular
                              </Badge>
                            )}
                          </TableCell> */}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(pkg)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(pkg.id ?? '')}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
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

            <div className="md:hidden space-y-2">
              {activePackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{pkg.name}</p>
                          <p className="text-xs text-gray-500">{pkg.capacity}</p>
                        </div>
                        {pkg.recommended && (
                          <Badge className="bg-[#FFA500] text-white text-xs">Popular</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                        <div>
                          <p className="text-gray-500 mb-0.5">Price</p>
                          <p className="text-gray-900 font-medium flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {pkg.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Generation</p>
                          <p className="text-gray-900 font-medium">{pkg.monthlyGeneration}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs text-red-600"
                          onClick={() => handleDelete(pkg.id !== undefined && pkg.id !== null ? pkg.id : '')}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activePackages.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">No active packages yet</h3>
                  <p className="text-gray-600 mb-4">Create your first active solar package to display on the website</p>
                  <Button onClick={() => setDialogOpen(true)} className="bg-[#FFA500] hover:bg-[#FF8C00]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        );
      })()}
    </div>
  );
}