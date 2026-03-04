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
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  gst?: string;
  address?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ExpenseType {
  id: string;
  name: string;
  description?: string;
}

interface ItemType {
  id: string;
  name: string;
  description?: string;
}

const MOCK_VENDORS: Vendor[] = [
  { id: 'v-1', name: 'SunTech Suppliers', contact: 'Rajesh', email: 'rajesh@suntech.com', gst: '29ABCDE1234F1Z5', address: 'Mumbai' },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'c-1', name: 'PV Modules', description: 'Solar photovoltaic modules' },
  { id: 'c-2', name: 'Inverters', description: 'Power inverters' },
];

const MOCK_EXPENSE_TYPES: ExpenseType[] = [
  { id: 'e-1', name: 'Salary', description: 'Employee salary' },
  { id: 'e-2', name: 'Commission', description: 'Sales commission' },
];

const MOCK_ITEM_TYPES: ItemType[] = [
  { id: 'it-1', name: 'Equipment', description: 'Solar equipment' },
  { id: 'it-2', name: 'Materials', description: 'Raw materials' },
];

const VENDORS_KEY = 'inventory_vendors';
const CATEGORIES_KEY = 'inventory_categories';
const EXPENSE_TYPES_KEY = 'inventory_expense_types';
const ITEM_TYPES_KEY = 'inventory_item_types';

export default function InventoryPage() {
  // Data states
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const raw = localStorage.getItem(VENDORS_KEY);
      return raw ? JSON.parse(raw) : MOCK_VENDORS;
    } catch {
      return MOCK_VENDORS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const raw = localStorage.getItem(CATEGORIES_KEY);
      return raw ? JSON.parse(raw) : MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  });

  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>(() => {
    try {
      const raw = localStorage.getItem(EXPENSE_TYPES_KEY);
      return raw ? JSON.parse(raw) : MOCK_EXPENSE_TYPES;
    } catch {
      return MOCK_EXPENSE_TYPES;
    }
  });

  const [itemTypes, setItemTypes] = useState<ItemType[]>(() => {
    try {
      const raw = localStorage.getItem(ITEM_TYPES_KEY);
      return raw ? JSON.parse(raw) : MOCK_ITEM_TYPES;
    } catch {
      return MOCK_ITEM_TYPES;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState('vendors');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ type: string; id: string } | null>(null);

  // Form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    contact: '',
    email: '',
    gst: '',
    address: '',
  });
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [expenseTypeForm, setExpenseTypeForm] = useState({
    name: '',
    description: '',
  });
  const [editingExpenseType, setEditingExpenseType] = useState<ExpenseType | null>(null);

  const [itemTypeForm, setItemTypeForm] = useState({
    name: '',
    description: '',
  });
  const [editingItemType, setEditingItemType] = useState<ItemType | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(EXPENSE_TYPES_KEY, JSON.stringify(expenseTypes));
  }, [expenseTypes]);

  useEffect(() => {
    localStorage.setItem(ITEM_TYPES_KEY, JSON.stringify(itemTypes));
  }, [itemTypes]);

  // VENDOR HANDLERS
  const handleAddVendor = () => {
    if (!vendorForm.name.trim()) {
      toast.error('Vendor name is required');
      return;
    }

    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...editingVendor, ...vendorForm } : v));
      toast.success('Vendor updated successfully');
    } else {
      const newVendor: Vendor = {
        id: 'v-' + Date.now(),
        ...vendorForm,
      };
      setVendors([...vendors, newVendor]);
      toast.success('Vendor added successfully');
    }

    setVendorForm({ name: '', contact: '', email: '', gst: '', address: '' });
    setEditingVendor(null);
    setDialogOpen(false);
  };

  // CATEGORY HANDLERS
  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...editingCategory, ...categoryForm } : c));
      toast.success('Category updated successfully');
    } else {
      const newCategory: Category = {
        id: 'c-' + Date.now(),
        ...categoryForm,
      };
      setCategories([...categories, newCategory]);
      toast.success('Category added successfully');
    }

    setCategoryForm({ name: '', description: '' });
    setEditingCategory(null);
    setDialogOpen(false);
  };

  // EXPENSE TYPE HANDLERS
  const handleAddExpenseType = () => {
    if (!expenseTypeForm.name.trim()) {
      toast.error('Expense type name is required');
      return;
    }

    if (editingExpenseType) {
      setExpenseTypes(expenseTypes.map(e => e.id === editingExpenseType.id ? { ...editingExpenseType, ...expenseTypeForm } : e));
      toast.success('Expense type updated successfully');
    } else {
      const newExpenseType: ExpenseType = {
        id: 'e-' + Date.now(),
        ...expenseTypeForm,
      };
      setExpenseTypes([...expenseTypes, newExpenseType]);
      toast.success('Expense type added successfully');
    }

    setExpenseTypeForm({ name: '', description: '' });
    setEditingExpenseType(null);
    setDialogOpen(false);
  };

  // ITEM TYPE HANDLERS
  const handleAddItemType = () => {
    if (!itemTypeForm.name.trim()) {
      toast.error('Item type name is required');
      return;
    }

    if (editingItemType) {
      setItemTypes(itemTypes.map(i => i.id === editingItemType.id ? { ...editingItemType, ...itemTypeForm } : i));
      toast.success('Item type updated successfully');
    } else {
      const newItemType: ItemType = {
        id: 'it-' + Date.now(),
        ...itemTypeForm,
      };
      setItemTypes([...itemTypes, newItemType]);
      toast.success('Item type added successfully');
    }

    setItemTypeForm({ name: '', description: '' });
    setEditingItemType(null);
    setDialogOpen(false);
  };

  // EDIT HANDLERS
  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVendorForm({
      name: vendor.name,
      contact: vendor.contact || '',
      email: vendor.email || '',
      gst: vendor.gst || '',
      address: vendor.address || '',
    });
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
    });
    setDialogOpen(true);
  };

  const handleEditExpenseType = (expenseType: ExpenseType) => {
    setEditingExpenseType(expenseType);
    setExpenseTypeForm({
      name: expenseType.name,
      description: expenseType.description || '',
    });
    setDialogOpen(true);
  };

  const handleEditItemType = (itemType: ItemType) => {
    setEditingItemType(itemType);
    setItemTypeForm({
      name: itemType.name,
      description: itemType.description || '',
    });
    setDialogOpen(true);
  };

  // DELETE HANDLERS
  const handleDelete = () => {
    if (!deleteItem) return;

    switch (deleteItem.type) {
      case 'vendor':
        setVendors(vendors.filter(v => v.id !== deleteItem.id));
        toast.success('Vendor deleted successfully');
        break;
      case 'category':
        setCategories(categories.filter(c => c.id !== deleteItem.id));
        toast.success('Category deleted successfully');
        break;
      case 'expenseType':
        setExpenseTypes(expenseTypes.filter(e => e.id !== deleteItem.id));
        toast.success('Expense type deleted successfully');
        break;
      case 'itemType':
        setItemTypes(itemTypes.filter(i => i.id !== deleteItem.id));
        toast.success('Item type deleted successfully');
        break;
    }

    setDeleteItem(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setVendorForm({ name: '', contact: '', email: '', gst: '', address: '' });
      setEditingVendor(null);
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      setExpenseTypeForm({ name: '', description: '' });
      setEditingExpenseType(null);
      setItemTypeForm({ name: '', description: '' });
      setEditingItemType(null);
    }
  };

  // TABLE RENDERING FUNCTIONS
  const renderVendorsTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>GST</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No vendors found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            vendors.map((vendor, index) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.contact || '-'}</TableCell>
                <TableCell>{vendor.email || '-'}</TableCell>
                <TableCell>{vendor.gst || '-'}</TableCell>
                <TableCell>{vendor.address || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteItem({ type: 'vendor', id: vendor.id })}
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
                            Are you sure you want to delete "{vendor.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
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

  const renderCategoriesTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No categories found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteItem({ type: 'category', id: category.id })}
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
                            Are you sure you want to delete "{category.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
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

  const renderExpenseTypesTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Expense Type Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No expense types found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            expenseTypes.map((expenseType, index) => (
              <TableRow key={expenseType.id}>
                <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                <TableCell>{expenseType.name}</TableCell>
                <TableCell>{expenseType.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditExpenseType(expenseType)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteItem({ type: 'expenseType', id: expenseType.id })}
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
                            Are you sure you want to delete "{expenseType.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
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

  const renderItemTypesTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Item Type Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No item types found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            itemTypes.map((itemType, index) => (
              <TableRow key={itemType.id}>
                <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
                <TableCell>{itemType.name}</TableCell>
                <TableCell>{itemType.description || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditItemType(itemType)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteItem({ type: 'itemType', id: itemType.id })}
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
                            Are you sure you want to delete "{itemType.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
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

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Inventory Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage vendors, categories, expense types, and item types.</p>
      </div>

      <Tabs defaultValue="vendors" value={activeTab} onValueChange={setActiveTab} style={{ width: '100%' }}>
        <TabsList style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%', marginBottom: '1rem' }}>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="expenseTypes">Expense Types</TabsTrigger>
          <TabsTrigger value="itemTypes">Item Types</TabsTrigger>
        </TabsList>

        {/* ========== VENDORS TAB ========== */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Vendors</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setVendorForm({ name: '', contact: '', email: '', gst: '', address: '' });
                      setEditingVendor(null);
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add New Vendor
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddVendor();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="vendor-name">Vendor Name *</Label>
                      <Input
                        id="vendor-name"
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-contact">Contact Person</Label>
                      <Input
                        id="vendor-contact"
                        value={vendorForm.contact}
                        onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })}
                        placeholder="Enter contact person name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-email">Email</Label>
                      <Input
                        id="vendor-email"
                        type="email"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-gst">GST Number</Label>
                      <Input
                        id="vendor-gst"
                        value={vendorForm.gst}
                        onChange={(e) => setVendorForm({ ...vendorForm, gst: e.target.value })}
                        placeholder="Enter GST number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendor-address">Address</Label>
                      <Input
                        id="vendor-address"
                        value={vendorForm.address}
                        onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>

                    <Button type="submit" style={{ backgroundColor: '#F97316', color: 'white', width: '100%' }}>
                      {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderVendorsTable()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== CATEGORIES TAB ========== */}
        <TabsContent value="categories">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Categories</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setCategoryForm({ name: '', description: '' });
                      setEditingCategory(null);
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add New Category
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddCategory();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="category-name">Category Name *</Label>
                      <Input
                        id="category-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-description">Description</Label>
                      <Input
                        id="category-description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        placeholder="Enter description"
                      />
                    </div>

                    <Button type="submit" style={{ backgroundColor: '#F97316', color: 'white', width: '100%' }}>
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderCategoriesTable()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== EXPENSE TYPES TAB ========== */}
        <TabsContent value="expenseTypes">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Expense Types</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setExpenseTypeForm({ name: '', description: '' });
                      setEditingExpenseType(null);
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add New Expense Type
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editingExpenseType ? 'Edit Expense Type' : 'Add New Expense Type'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddExpenseType();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="expensetype-name">Expense Type Name *</Label>
                      <Input
                        id="expensetype-name"
                        value={expenseTypeForm.name}
                        onChange={(e) => setExpenseTypeForm({ ...expenseTypeForm, name: e.target.value })}
                        placeholder="Enter expense type name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expensetype-description">Description</Label>
                      <Input
                        id="expensetype-description"
                        value={expenseTypeForm.description}
                        onChange={(e) => setExpenseTypeForm({ ...expenseTypeForm, description: e.target.value })}
                        placeholder="Enter description"
                      />
                    </div>

                    <Button type="submit" style={{ backgroundColor: '#F97316', color: 'white', width: '100%' }}>
                      {editingExpenseType ? 'Update Expense Type' : 'Add Expense Type'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderExpenseTypesTable()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== ITEM TYPES TAB ========== */}
        <TabsContent value="itemTypes">
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
              <CardTitle>Item Types</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setItemTypeForm({ name: '', description: '' });
                      setEditingItemType(null);
                    }}
                    style={{ backgroundColor: '#F97316', color: 'white' }}
                  >
                    <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
                    Add New Item Type
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6 max-w-lg max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{editingItemType ? 'Edit Item Type' : 'Add New Item Type'}</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddItemType();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="itemtype-name">Item Type Name *</Label>
                      <Input
                        id="itemtype-name"
                        value={itemTypeForm.name}
                        onChange={(e) => setItemTypeForm({ ...itemTypeForm, name: e.target.value })}
                        placeholder="Enter item type name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemtype-description">Description</Label>
                      <Input
                        id="itemtype-description"
                        value={itemTypeForm.description}
                        onChange={(e) => setItemTypeForm({ ...itemTypeForm, description: e.target.value })}
                        placeholder="Enter description"
                      />
                    </div>

                    <Button type="submit" style={{ backgroundColor: '#F97316', color: 'white', width: '100%' }}>
                      {editingItemType ? 'Update Item Type' : 'Add Item Type'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {renderItemTypesTable()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
