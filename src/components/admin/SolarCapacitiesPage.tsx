import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { fetchCategories, addSolarCapacityItem, getAllSolarCapacityItems, updateSolarCapacityItem, deleteSolarCapacityItem } from '../../api/api';

type Capacity = {
  id: string;
  category: string;
  name: string;
};

const MOCK_CAPACITIES: Capacity[] = [
  { id: 'cap-1', category: 'product_descriptions', name: 'High Efficiency Solar Panel 650W' },
  { id: 'cap-2', category: 'product_descriptions', name: 'Residential Solar System 3kW' },
  { id: 'cap-3', category: 'product_descriptions', name: 'Commercial Solar System 10kW' },
];

export default function SolarCapacitiesPage() {
  const [items, setItems] = useState<Capacity[]>([]);
  const [categories, setCategories] = useState<Array<{ value: string; table: string }>>([]);
  const [formData, setFormData] = useState<Capacity>({ id: '', category: 'inverter_types', name: '' });
  const [editing, setEditing] = useState<Capacity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Capacity | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('inverter_types');

  // Fetch categories and items on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Loading initial data...');
        
        // Fetch categories
        try {
          setIsLoadingCategories(true);
          const categoryResponse = await fetchCategories(token || undefined);
          
          if (isMounted) {
            if (categoryResponse.ok && Array.isArray(categoryResponse.data)) {
              setCategories(categoryResponse.data);
              console.log('Categories loaded successfully:', categoryResponse.data);
              // Set the first category as active
              if (categoryResponse.data && categoryResponse.data.length > 0) {
                setActiveTab(categoryResponse.data[0].value);
                setFormData(prev => ({ ...prev, category: categoryResponse.data![0].value }));
              }
            } else {
              console.log('Error loading categories:', categoryResponse.error);
              // Set default categories if fetch fails
              const defaultCategories = [
                { value: 'inverter_types', table: 'inverter_types' },
                { value: 'product_descriptions', table: 'product_descriptions' },
                { value: 'structures', table: 'structures' }
              ];
              setCategories(defaultCategories);
              setActiveTab('inverter_types');
              setFormData(prev => ({ ...prev, category: 'inverter_types' }));
            }
          }
        } finally {
          if (isMounted) setIsLoadingCategories(false);
        }
        
        // Fetch items
        try {
          setIsLoadingItems(true);
          const itemsResponse = await getAllSolarCapacityItems(token || undefined);
          
          if (isMounted) {
            if (itemsResponse.ok && itemsResponse.data) {
              // Flatten the response data (inverter_types, product_descriptions, structures)
              const flattenedItems: Capacity[] = [];
              const categoriesData = itemsResponse.data;
              
              // Process each category group
              Object.entries(categoriesData).forEach(([categoryKey, categoryItems]: [string, any]) => {
                if (Array.isArray(categoryItems)) {
                  categoryItems.forEach((item: any) => {
                    // Only include items with "Active" status
                    if (item.status === "Active") {
                      flattenedItems.push({
                        id: String(item.id),
                        category: categoryKey,
                        name: item.name
                      });
                    }
                  });
                }
              });
              
              setItems(flattenedItems);
              console.log('All items loaded successfully:', flattenedItems);
            } else {
              console.log('Error loading items:', itemsResponse.error);
              setItems(MOCK_CAPACITIES);
            }
          }
        } finally {
          if (isMounted) setIsLoadingItems(false);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (isMounted) {
          setItems(MOCK_CAPACITIES);
        }
      }
    };
    
    loadInitialData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Save items to localStorage as backup only when adding new items
    if (items.length > 0 && items !== MOCK_CAPACITIES) {
      localStorage.setItem('solar_capacities', JSON.stringify(items));
    }
  }, [items.length]); // Only depend on items.length to avoid excessive updates

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken');
      let response;

      if (editing) {
        // Update existing item
        response = await updateSolarCapacityItem(
          editing.id,
          { category: formData.category, name: formData.name },
          token || undefined
        );

        if (response.ok && response.data) {
          // Update the item in the list
          setItems(prev =>
            prev.map(item =>
              item.id === editing.id
                ? { ...item, category: formData.category, name: formData.name }
                : item
            )
          );
          setDialogOpen(false);
          setFormData({ id: '', category: 'product_descriptions', name: '' });
          setEditing(null);
          setValidationErrors({});
          toast.success('Product description updated successfully');
        } else {
          toast.error(response.error || 'Failed to update product description');
        }
      } else {
        // Create new item
        response = await addSolarCapacityItem(
          { category: formData.category, name: formData.name },
          token || undefined
        );

        if (response.ok && response.data) {
          // Add the new item to the list
          const newItem: Capacity = {
            id: String(response.data.id),
            category: formData.category,
            name: formData.name
          };

          setItems(prev => [newItem, ...prev]);
          setDialogOpen(false);
          setFormData({ id: '', category: 'product_descriptions', name: '' });
          setEditing(null);
          setValidationErrors({});
          toast.success('Product description created successfully');
        } else {
          toast.error(response.error || 'Failed to create product description');
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Error saving product description');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Capacity) => {
    setFormData(item);
    setEditing(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = (item: Capacity) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await deleteSolarCapacityItem(
          itemToDelete.id,
          itemToDelete.category,
          token || undefined
        );

        if (response.ok) {
          setItems(prev => prev.filter(p => p.id !== itemToDelete.id));
          toast.success('Product description deleted successfully');
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        } else {
          toast.error(response.error || 'Failed to delete product description');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting product description');
      }
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ id: '', category: 'product_descriptions', name: '' });
      setEditing(null);
      setValidationErrors({});
    }
  };

  // Helper function to get category display name
  const getCategoryDisplayName = (value: string) => {
    return value.replace(/_/g, ' ').toUpperCase();
  };

  // Helper function to get items for a specific category
  const getItemsByCategory = (categoryValue: string) => {
    return items.filter(item => item.category === categoryValue);
  };

  // Render table content for a specific category
  const renderCategoryTable = (categoryValue: string) => {
    const categoryItems = getItemsByCategory(categoryValue);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingItems ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Loading items...
                </TableCell>
              </TableRow>
            ) : categoryItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No items found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              categoryItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              Confirm Delete
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-gray-900 mb-1 sm:mb-2">Solar Capacities</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage solar system capacities by category.</p>
      </div>

      <Tabs defaultValue="inverter_types" value={activeTab} onValueChange={setActiveTab} style={{ width: '100%' }}>
        <TabsList style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%', marginBottom: '1rem' }}>
          <TabsTrigger value="inverter_types">Inverter Types</TabsTrigger>
          <TabsTrigger value="product_descriptions">Product Descriptions</TabsTrigger>
          <TabsTrigger value="structures">Structures</TabsTrigger>
        </TabsList>

        {/* ========== INVERTER TYPES TAB ========== */}
        <TabsContent value="inverter_types">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Inverter Types</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setFormData({ id: '', category: 'inverter_types', name: '' });
                      setEditing(null);
                      setValidationErrors({});
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add Inverter Type
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editing ? 'Edit Inverter Type' : 'Add New Inverter Type'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <Label className="mb-2 block text-black">
                        Name <span style={{ color: '#FF0000' }}>*</span>
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mb-1 border-black ring-0 text-black"
                        placeholder="e.g., Hybrid Inverter 5kW"
                      />
                      {validationErrors.name && (
                        <div style={{ color: '#FF0000' }} className="text-xs mt-1">{validationErrors.name}</div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add')}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderCategoryTable('inverter_types')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== PRODUCT DESCRIPTIONS TAB ========== */}
        <TabsContent value="product_descriptions">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Product Descriptions</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setFormData({ id: '', category: 'product_descriptions', name: '' });
                      setEditing(null);
                      setValidationErrors({});
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add Product Description
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editing ? 'Edit Product Description' : 'Add New Product Description'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <Label className="mb-2 block text-black">
                        Name <span style={{ color: '#FF0000' }}>*</span>
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mb-1 border-black ring-0 text-black"
                        placeholder="e.g., High Efficiency Solar Panel 650W"
                      />
                      {validationErrors.name && (
                        <div style={{ color: '#FF0000' }} className="text-xs mt-1">{validationErrors.name}</div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add')}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderCategoryTable('product_descriptions')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== STRUCTURES TAB ========== */}
        <TabsContent value="structures">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Structures</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setFormData({ id: '', category: 'structures', name: '' });
                      setEditing(null);
                      setValidationErrors({});
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add Structure
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editing ? 'Edit Structure' : 'Add New Structure'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave();
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <Label className="mb-2 block text-black">
                        Name <span style={{ color: '#FF0000' }}>*</span>
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mb-1 border-black ring-0 text-black"
                        placeholder="e.g., Rooftop Mounting Structure"
                      />
                      {validationErrors.name && (
                        <div style={{ color: '#FF0000' }} className="text-xs mt-1">{validationErrors.name}</div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-8">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add')}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderCategoryTable('structures')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
