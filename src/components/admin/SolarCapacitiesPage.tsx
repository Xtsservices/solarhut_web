import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
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
  const [formData, setFormData] = useState<Capacity>({ id: '', category: 'product_descriptions', name: '' });
  const [editing, setEditing] = useState<Capacity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Capacity | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const itemsPerPage = 10;

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
            } else {
              console.log('Error loading categories:', categoryResponse.error);
              // Set default categories if fetch fails
              setCategories([
                { value: 'inverter_types', table: 'inverter_types' },
                { value: 'product_descriptions', table: 'product_descriptions' },
                { value: 'structures', table: 'structures' }
              ]);
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
                    flattenedItems.push({
                      id: String(item.id),
                      category: categoryKey,
                      name: item.name
                    });
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
    if (!formData.category.trim()) errors.category = 'Category is required';
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

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1 sm:mb-2">Product Descriptions</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage product descriptions for solar systems and estimations.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                setFormData({ id: '', category: 'product_descriptions', name: '' });
                setEditing(null);
                setValidationErrors({});
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>

          <DialogContent className="p-6 max-w-lg max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
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
                  Category <span style={{ color: '#FF0000' }}>*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-black ring-0 text-black">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.value.replace(/_/g, ' ')}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="product_descriptions" disabled>
                        Loading categories...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <div style={{ color: '#FF0000' }} className="text-xs mt-1">{validationErrors.category}</div>
                )}
              </div>

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
                  {isSubmitting ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update Product Description' : 'Add Product Description')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Product Descriptions</CardTitle>
            <div className="w-full sm:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-black ring-0 text-black">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.value.replace(/_/g, ' ')}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  {/* <TableHead>ID</TableHead> */}
                  <TableHead>Category</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingItems ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Loading items...
                    </TableCell>
                  </TableRow>
                ) : (() => {
                  const filteredItems = categoryFilter === 'all' 
                    ? items 
                    : items.filter(item => item.category === categoryFilter);
                  
                  if (filteredItems.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {items.length === 0 
                            ? 'No product descriptions defined. Add one to get started.'
                            : 'No items found in this category.'}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedItems = filteredItems.slice(startIndex, endIndex);
                  
                  return paginatedItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-gray-600">{startIndex + index + 1}</TableCell>
                      {/* <TableCell className="font-medium">{item.id}</TableCell> */}
                      <TableCell>{item.category}</TableCell>
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
                  ));
                })()}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {items.length > 0 && (() => {
            const filteredItems = categoryFilter === 'all' 
              ? items 
              : items.filter(item => item.category === categoryFilter);
            const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(currentPage * itemsPerPage, filteredItems.length);
            
            return (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {filteredItems.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredItems.length} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(index + 1)}
                        className="min-w-10"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
