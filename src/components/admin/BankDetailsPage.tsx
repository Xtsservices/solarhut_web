import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, QrCode, Building2, CreditCard } from 'lucide-react';
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

interface BankDetail {
  id: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  branchName: string;
  upiId: string;
  qrCode: string | null;
  createdAt: string;
}

interface EmployeePermission {
  id: number;
  name: string;
  email: string;
  role: string;
  hasPermission: boolean;
}

// Mock data for bank details
const mockBankDetails: BankDetail[] = [
  {
    id: 1,
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Solar Hut Pvt Ltd',
    branchName: 'Mumbai Main Branch',
    upiId: 'solarhut@hdfcbank',
    qrCode: null,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    bankName: 'ICICI Bank',
    accountNumber: '012345678901',
    ifscCode: 'ICIC0001234',
    accountHolderName: 'Solar Hut Pvt Ltd',
    branchName: 'Delhi Branch',
    upiId: 'solarhut@icici',
    qrCode: '/qr-sample.png',
    createdAt: '2024-01-10'
  }
];

// Mock data for employees
const mockEmployees: EmployeePermission[] = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@solarhut.com', role: 'Sales Manager', hasPermission: false },
  { id: 2, name: 'Priya Sharma', email: 'priya@solarhut.com', role: 'Accountant', hasPermission: false },
  { id: 3, name: 'Amit Patel', email: 'amit@solarhut.com', role: 'Field Engineer', hasPermission: false },
  { id: 4, name: 'Neha Desai', email: 'neha@solarhut.com', role: 'Sales Executive', hasPermission: false }
];

export function BankDetailsPage() {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>(mockBankDetails);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);
  const [employees, setEmployees] = useState<EmployeePermission[]>(mockEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankDetail | null>(null);

  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    qrCode: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, qrCode: e.target.files![0] }));
    }
  };

  const handleAddBank = () => {
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      toast.error('Please fill all required fields');
      return;
    }

    const newBank: BankDetail = {
      id: bankDetails.length + 1,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountHolderName: formData.accountHolderName,
      branchName: formData.branchName,
      upiId: formData.upiId,
      qrCode: formData.qrCode ? URL.createObjectURL(formData.qrCode) : null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBankDetails([...bankDetails, newBank]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Bank details added successfully');
  };

  const handleEditBank = () => {
    if (!editingBank) return;

    const updatedBanks = bankDetails.map(bank =>
      bank.id === editingBank.id
        ? {
            ...bank,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            accountHolderName: formData.accountHolderName,
            branchName: formData.branchName,
            upiId: formData.upiId,
            qrCode: formData.qrCode ? URL.createObjectURL(formData.qrCode) : bank.qrCode
          }
        : bank
    );

    setBankDetails(updatedBanks);
    setIsEditDialogOpen(false);
    setEditingBank(null);
    resetForm();
    toast.success('Bank details updated successfully');
  };

  const handleDeleteBank = (id: number) => {
    if (window.confirm('Are you sure you want to delete this bank detail?')) {
      setBankDetails(bankDetails.filter(bank => bank.id !== id));
      toast.success('Bank details deleted successfully');
    }
  };

  const openEditDialog = (bank: BankDetail) => {
    setEditingBank(bank);
    setFormData({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      accountHolderName: bank.accountHolderName,
      branchName: bank.branchName,
      upiId: bank.upiId,
      qrCode: null
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      branchName: '',
      upiId: '',
      qrCode: null
    });
  };

  const handleBankSelect = (bankId: number) => {
    setSelectedBank(selectedBank === bankId ? null : bankId);
  };

  const handleEmployeePermissionToggle = (employeeId: number) => {
    if (!selectedBank) {
      toast.error('Please select a bank first');
      return;
    }

    setEmployees(employees.map(emp =>
      emp.id === employeeId ? { ...emp, hasPermission: !emp.hasPermission } : emp
    ));
    toast.success('Permission updated');
  };

  const BankForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            value={formData.bankName}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            placeholder="Enter bank name"
          />
        </div>
        <div>
          <Label htmlFor="accountNumber">Account Number *</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="Enter account number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ifscCode">IFSC Code *</Label>
          <Input
            id="ifscCode"
            value={formData.ifscCode}
            onChange={(e) => handleInputChange('ifscCode', e.target.value)}
            placeholder="Enter IFSC code"
          />
        </div>
        <div>
          <Label htmlFor="accountHolderName">Account Holder Name</Label>
          <Input
            id="accountHolderName"
            value={formData.accountHolderName}
            onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
            placeholder="Enter account holder name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            value={formData.branchName}
            onChange={(e) => handleInputChange('branchName', e.target.value)}
            placeholder="Enter branch name"
          />
        </div>
        <div>
          <Label htmlFor="upiId">UPI ID</Label>
          <Input
            id="upiId"
            value={formData.upiId}
            onChange={(e) => handleInputChange('upiId', e.target.value)}
            placeholder="Enter UPI ID"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="qrCode">Upload QR Code</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="qrCode"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="flex-1"
          />
          {formData.qrCode && (
            <Badge variant="outline" className="whitespace-nowrap">
              {formData.qrCode.name}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bank Details</h1>
          <p className="text-gray-500 mt-1">Manage bank accounts and payment methods</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Details
        </Button>
      </div>

      {/* Bank Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankDetails.map((bank) => (
          <Card
            key={bank.id}
            className={`cursor-pointer transition-all ${
              selectedBank === bank.id ? 'ring-2 ring-orange-500 shadow-lg' : ''
            }`}
            onClick={() => handleBankSelect(bank.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">{bank.bankName}</CardTitle>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(bank)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBank(bank.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Account Holder</p>
                <p className="text-sm font-medium">{bank.accountHolderName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Number</p>
                <p className="text-sm font-mono">{bank.accountNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">IFSC Code</p>
                <p className="text-sm font-mono">{bank.ifscCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Branch</p>
                <p className="text-sm">{bank.branchName}</p>
              </div>
              {bank.upiId && (
                <div>
                  <p className="text-xs text-gray-500">UPI ID</p>
                  <p className="text-sm font-mono flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {bank.upiId}
                  </p>
                </div>
              )}
              {bank.qrCode && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">QR Code</p>
                  <div className="bg-gray-100 p-2 rounded flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Permissions</CardTitle>
          <p className="text-sm text-gray-500">
            {selectedBank
              ? `Select employees who can use ${bankDetails.find(b => b.id === selectedBank)?.bankName} in invoices`
              : 'Select a bank above to manage permissions'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      disabled={!selectedBank}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={employee.hasPermission}
                        onChange={() => handleEmployeePermissionToggle(employee.id)}
                        disabled={!selectedBank}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{employee.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{employee.role}</td>
                    <td className="py-3 px-4">
                      {employee.hasPermission ? (
                        <Badge className="bg-green-100 text-green-700">Permitted</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">No Access</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Bank Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Bank Details</DialogTitle>
            <DialogDescription>
              Enter bank account information and upload QR code for payments
            </DialogDescription>
          </DialogHeader>
          <BankForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBank} className="bg-orange-500 hover:bg-orange-600">
              Add Bank
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bank Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bank Details</DialogTitle>
            <DialogDescription>
              Update bank account information
            </DialogDescription>
          </DialogHeader>
          <BankForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBank} className="bg-orange-500 hover:bg-orange-600">
              Update Bank
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
