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
import { getPackages, addPackage, updatePackage, deletePackage, resetToDefaults, type SolarPackage } from '../../lib/packagesData';

export function PackagesPage() {
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    const loadedPackages = getPackages();
    setPackages(loadedPackages);
  }, []);

  const loadPackages = () => {
    const loadedPackages = getPackages();
    setPackages(loadedPackages);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.capacity || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (featuresArray.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    try {
      if (editMode && editingId) {
        updatePackage(editingId, {
          name: formData.name,
          capacity: formData.capacity,
          price: formData.price,
          originalPrice: formData.originalPrice,
          savings: formData.savings,
          monthlyGeneration: formData.monthlyGeneration,
          features: featuresArray,
          recommended: formData.recommended,
        });
        toast.success('Package updated successfully');
      } else {
        addPackage({
          name: formData.name,
          capacity: formData.capacity,
          price: formData.price,
          originalPrice: formData.originalPrice,
          savings: formData.savings,
          monthlyGeneration: formData.monthlyGeneration,
          features: featuresArray,
          recommended: formData.recommended,
        });
        toast.success('Package added successfully');
      }

      loadPackages();
      handleDialogClose();
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
      features: pkg.features.join('\n'),
      recommended: pkg.recommended,
    });
    setEditingId(pkg.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      if (deletePackage(id)) {
        toast.success('Package deleted successfully');
        loadPackages();
      } else {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default packages? This will remove all custom packages.')) {
      resetToDefaults();
      toast.success('Packages reset to defaults');
      loadPackages();
    }
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
    setEditMode(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1 sm:mb-2">Solar Packages</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage packages displayed on the website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset to Defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Package Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Starter Home"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Capacity *</Label>
                    <Input
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="e.g., 3 kW"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm">Price (₹) *</Label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., 1,80,000"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Original Price (₹)</Label>
                    <Input
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g., 2,40,000"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Savings Text</Label>
                    <Input
                      value={formData.savings}
                      onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                      placeholder="e.g., Save ₹60,000"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Monthly Generation</Label>
                  <Input
                    value={formData.monthlyGeneration}
                    onChange={(e) => setFormData({ ...formData, monthlyGeneration: e.target.value })}
                    placeholder="e.g., 360-450 units"
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Features (one per line) *</Label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="12 High-efficiency solar panels&#10;3 kW string inverter&#10;Net metering setup"
                    rows={6}
                    className="mt-1 text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Switch
                    id="recommended"
                    checked={formData.recommended}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, recommended: checked })}
                  />
                  <Label htmlFor="recommended" className="text-xs sm:text-sm cursor-pointer">
                    Mark as "Most Popular" / Recommended
                  </Label>
                </div>

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

    
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-[#FFA500]" />
              <div>
                <p className="text-xs text-gray-600">Total Packages</p>
                <p className="text-xl sm:text-2xl text-gray-900">{packages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FFA500] text-white">Popular</Badge>
              <div>
                <p className="text-xs text-gray-600">Recommended</p>
                <p className="text-xl sm:text-2xl text-gray-900">
                  {packages.filter(p => p.recommended).length}
                </p>
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
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="text-xs sm:text-sm font-medium">{pkg.name}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{pkg.capacity}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div className="flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {pkg.price}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{pkg.monthlyGeneration}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {pkg.recommended && (
                        <Badge variant="secondary" className="bg-[#FFA500] text-white text-xs">
                          Popular
                        </Badge>
                      )}
                    </TableCell>
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
                          onClick={() => handleDelete(pkg.id)}
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
        {packages.map((pkg) => (
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
                    onClick={() => handleDelete(pkg.id)}
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

      {packages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No packages yet</h3>
            <p className="text-gray-600 mb-4">Create your first solar package to display on the website</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-[#FFA500] hover:bg-[#FF8C00]">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
