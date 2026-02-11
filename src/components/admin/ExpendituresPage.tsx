import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

type Vendor = {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  gst?: string;
  address?: string;
};

type Item = {
  id: string;
  name: string;
  vendorId: string;
  quantity: number;
  category?: string;
  stockOnHold: number;
  price: number;
  purchasePrice: number;
};

type Expense = {
  id: string;
  date: string;
  type: string;
  description?: string;
  amount: number;
};

const MOCK_VENDORS: Vendor[] = [
  { id: 'v-1', name: 'SunTech Suppliers', contact: 'Rajesh', email: 'rajesh@suntech.com', gst: '29ABCDE1234F1Z5', address: 'Mumbai' },
];

const MOCK_ITEMS: Item[] = [
  { id: 'i-1', name: 'PV Module 330W', vendorId: 'v-1', quantity: 50, category: 'PV Modules', stockOnHold: 5, price: 15000, purchasePrice: 12000 },
  { id: 'i-2', name: 'Inverter 5kW', vendorId: 'v-1', quantity: 10, category: 'Inverters', stockOnHold: 1, price: 45000, purchasePrice: 38000 },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'e-1', date: new Date().toISOString().slice(0,10), type: 'salary', description: 'Jan salaries', amount: 120000 },
  { id: 'e-2', date: new Date().toISOString().slice(0,10), type: 'commission', description: 'Sales commission', amount: 15000 },
];

const VENDORS_KEY = 'expenditures_vendors';
const ITEMS_KEY = 'expenditures_items';
const EXPENSES_KEY = 'expenditures_expenses';

export default function ExpendituresPage() {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const raw = localStorage.getItem(VENDORS_KEY);
      return raw ? JSON.parse(raw) : MOCK_VENDORS;
    } catch { return MOCK_VENDORS; }
  });

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = localStorage.getItem(ITEMS_KEY);
      return raw ? JSON.parse(raw) : MOCK_ITEMS;
    } catch { return MOCK_ITEMS; }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const raw = localStorage.getItem(EXPENSES_KEY);
      return raw ? JSON.parse(raw) : MOCK_EXPENSES;
    } catch { return MOCK_EXPENSES; }
  });

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorEditing, setVendorEditing] = useState<Vendor | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemEditing, setItemEditing] = useState<Item | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [vendorFormData, setVendorFormData] = useState({
    name: '',
    contact: '',
    email: '',
    gst: '',
    address: ''
  });

  const [itemFormData, setItemFormData] = useState({
    name: '',
    vendorId: '',
    quantity: 0,
    category: '',
    stockOnHold: 0,
    purchasePrice: 0,
    price: 0
  });

  const [expenseFormData, setExpenseFormData] = useState({
    date: new Date().toISOString().slice(0,10),
    type: 'salary',
    description: '',
    amount: 0
  });

  useEffect(() => { localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)); }, [expenses]);

  const addOrUpdateVendor = () => {
    if (!vendorFormData.name.trim()) {
      toast.error('Please enter vendor name');
      return;
    }

    const v: Vendor = {
      id: vendorEditing?.id || `v-${Date.now()}`,
      name: vendorFormData.name.trim(),
      contact: vendorFormData.contact.trim(),
      email: vendorFormData.email.trim(),
      gst: vendorFormData.gst.trim(),
      address: vendorFormData.address.trim(),
    };

    setVendors(prev => prev.some(p => p.id === v.id) ? prev.map(p => p.id === v.id ? v : p) : [v, ...prev]);
    setShowVendorForm(false);
    setVendorEditing(null);
    resetVendorForm();
    toast.success(vendorEditing ? 'Vendor updated successfully' : 'Vendor added successfully');
  };

  const addOrUpdateItem = () => {
    if (!itemFormData.name.trim()) {
      toast.error('Please enter item name');
      return;
    }
    if (!itemFormData.vendorId) {
      toast.error('Please select a vendor');
      return;
    }

    const it: Item = {
      id: itemEditing?.id || `i-${Date.now()}`,
      name: itemFormData.name.trim(),
      vendorId: itemFormData.vendorId,
      quantity: Number(itemFormData.quantity),
      category: itemFormData.category,
      stockOnHold: Number(itemFormData.stockOnHold),
      purchasePrice: Number(itemFormData.purchasePrice),
      price: Number(itemFormData.price),
    };

    setItems(prev => prev.some(p => p.id === it.id) ? prev.map(p => p.id === it.id ? it : p) : [it, ...prev]);
    setShowItemForm(false);
    setItemEditing(null);
    resetItemForm();
    toast.success(itemEditing ? 'Item updated successfully' : 'Item added successfully');
  };

  const addExpense = () => {
    if (!expenseFormData.amount || expenseFormData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const ex: Expense = {
      id: `e-${Date.now()}`,
      date: expenseFormData.date,
      type: expenseFormData.type,
      description: expenseFormData.description,
      amount: Number(expenseFormData.amount),
    };

    setExpenses(prev => [ex, ...prev]);
    setShowExpenseForm(false);
    resetExpenseForm();
    toast.success('Expense added successfully');
  };

  const deleteVendor = (id: string) => {
    if (window.confirm('Are you sure? This will also delete all items from this vendor.')) {
      setVendors(prev => prev.filter(v => v.id !== id));
      setItems(prev => prev.filter(i => i.vendorId !== id));
      toast.success('Vendor deleted successfully');
    }
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item deleted successfully');
    }
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('Expense deleted successfully');
    }
  };

  const openEditVendor = (vendor: Vendor) => {
    setVendorEditing(vendor);
    setVendorFormData({
      name: vendor.name,
      contact: vendor.contact || '',
      email: vendor.email || '',
      gst: vendor.gst || '',
      address: vendor.address || ''
    });
    setShowVendorForm(true);
  };

  const openEditItem = (item: Item) => {
    setItemEditing(item);
    setItemFormData({
      name: item.name,
      vendorId: item.vendorId,
      quantity: item.quantity,
      category: item.category || '',
      stockOnHold: item.stockOnHold,
      purchasePrice: item.purchasePrice,
      price: item.price
    });
    setShowItemForm(true);
  };

  const resetVendorForm = () => {
    setVendorFormData({ name: '', contact: '', email: '', gst: '', address: '' });
  };

  const resetItemForm = () => {
    setItemFormData({ name: '', vendorId: vendors[0]?.id || '', quantity: 0, category: '', stockOnHold: 0, purchasePrice: 0, price: 0 });
  };

  const resetExpenseForm = () => {
    setExpenseFormData({ date: new Date().toISOString().slice(0,10), type: 'salary', description: '', amount: 0 });
  };

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount || 0), 0), [expenses]);
  const totalSalaries = useMemo(() => expenses.filter(e => e.type === 'salary').reduce((s, e) => s + Number(e.amount || 0), 0), [expenses]);
  const totalCommissions = useMemo(() => expenses.filter(e => e.type === 'commission').reduce((s, e) => s + Number(e.amount || 0), 0), [expenses]);
  const totalStockValue = useMemo(() => items.reduce((s, it) => s + (it.quantity * it.purchasePrice), 0), [items]);
  const totalStockOnHold = useMemo(() => items.reduce((s, it) => s + (it.stockOnHold || 0), 0), [items]);

  const stockValue = itemFormData.quantity * itemFormData.purchasePrice;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenditures</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage vendors, stock items and record expenses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => { resetExpenseForm(); setShowExpenseForm(true); }} className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={() => { setItemEditing(null); resetItemForm(); setShowItemForm(true); }} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stock Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalStockValue.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Salaries</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSalaries.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Commissions</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalCommissions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Stock Items Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">Stock Items</CardTitle>
            <div className="flex gap-4 flex-wrap">
              <Badge variant="outline">{items.length} items</Badge>
              <Badge variant="outline">On hold: {totalStockOnHold}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">Item</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 hidden sm:table-cell">Vendor</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 hidden md:table-cell">Category</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700">Qty</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700 hidden sm:table-cell">On Hold</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700 hidden md:table-cell">Purchase ₹</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700 hidden lg:table-cell">Stock Value</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => {
                  const vendor = vendors.find(v => v.id === it.vendorId);
                  const stockValue = it.quantity * it.purchasePrice;
                  return (
                    <tr key={it.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">{it.name}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-600 hidden sm:table-cell text-sm">{vendor?.name || '—'}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-600 hidden md:table-cell text-sm">{it.category || '—'}</td>
                      <td className="py-3 px-2 sm:px-4 text-right text-gray-900 text-sm">{it.quantity}</td>
                      <td className="py-3 px-2 sm:px-4 text-right text-gray-900 hidden sm:table-cell text-sm">{it.stockOnHold}</td>
                      <td className="py-3 px-2 sm:px-4 text-right text-gray-900 hidden md:table-cell text-sm">₹{it.purchasePrice.toLocaleString()}</td>
                      <td className="py-3 px-2 sm:px-4 text-right font-medium text-gray-900 hidden lg:table-cell text-sm">₹{stockValue.toLocaleString()}</td>
                      <td className="py-3 px-2 sm:px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditItem(it)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteItem(it.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">Expenses</CardTitle>
            <Badge variant="outline">{expenses.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 hidden sm:table-cell">Description</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700">Amount (₹)</th>
                  <th className="text-right py-3 px-2 sm:px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">{e.date}</td>
                    <td className="py-3 px-2 sm:px-4">
                      <Badge className="capitalize text-xs sm:text-sm">{e.type}</Badge>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600 hidden sm:table-cell text-sm">{e.description || '—'}</td>
                    <td className="py-3 px-2 sm:px-4 text-right font-medium text-gray-900 text-sm">₹{Number(e.amount).toLocaleString()}</td>
                    <td className="py-3 px-2 sm:px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => deleteExpense(e.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Form Dialog */}
      <Dialog open={showVendorForm} onOpenChange={setShowVendorForm}>
        <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>{vendorEditing ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
            <DialogDescription>
              Enter vendor information and contact details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorName">Vendor Name *</Label>
                <Input
                  id="vendorName"
                  value={vendorFormData.name}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, name: e.target.value })}
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  value={vendorFormData.contact}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, contact: e.target.value })}
                  placeholder="Enter contact person"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={vendorFormData.email}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={vendorFormData.gst}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, gst: e.target.value })}
                  placeholder="Enter GST number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={vendorFormData.address}
                onChange={(e) => setVendorFormData({ ...vendorFormData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowVendorForm(false); setVendorEditing(null); }}>
              Cancel
            </Button>
            <Button onClick={addOrUpdateVendor} className="bg-orange-500 hover:bg-orange-600">
              {vendorEditing ? 'Update Vendor' : 'Add Vendor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Form Dialog */}
      <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
        <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>{itemEditing ? 'Edit Item' : 'Add Item'}</DialogTitle>
            <DialogDescription>
              Enter stock item details and pricing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <select
                  id="vendor"
                  value={itemFormData.vendorId}
                  onChange={(e) => setItemFormData({ ...itemFormData, vendorId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={itemFormData.category}
                  onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={itemFormData.quantity}
                  onChange={(e) => setItemFormData({ ...itemFormData, quantity: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockOnHold">Stock On Hold</Label>
                <Input
                  id="stockOnHold"
                  type="number"
                  value={itemFormData.stockOnHold}
                  onChange={(e) => setItemFormData({ ...itemFormData, stockOnHold: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={itemFormData.purchasePrice}
                  onChange={(e) => setItemFormData({ ...itemFormData, purchasePrice: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salePrice">Sale Price (₹)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={itemFormData.price}
                  onChange={(e) => setItemFormData({ ...itemFormData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <div className="bg-gray-100 px-4 py-2 rounded-md w-full">
                  <p className="text-xs text-gray-500">Stock Value</p>
                  <p className="text-lg font-semibold text-gray-900">₹{stockValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowItemForm(false); setItemEditing(null); }}>
              Cancel
            </Button>
            <Button onClick={addOrUpdateItem} className="bg-orange-500 hover:bg-orange-600">
              {itemEditing ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Form Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Record a new expense transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="expenseDate">Date</Label>
              <Input
                id="expenseDate"
                type="date"
                value={expenseFormData.date}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expenseType">Expense Type</Label>
              <select
                id="expenseType"
                value={expenseFormData.type}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="salary">Salary</option>
                <option value="stock">Stock Purchase</option>
                <option value="commission">Commission</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="expenseDescription">Description</Label>
              <Input
                id="expenseDescription"
                value={expenseFormData.description}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="expenseAmount">Amount (₹) *</Label>
              <Input
                id="expenseAmount"
                type="number"
                value={expenseFormData.amount}
                onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpenseForm(false)}>
              Cancel
            </Button>
            <Button onClick={addExpense} className="bg-orange-500 hover:bg-orange-600">
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
