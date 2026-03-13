import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, QrCode, Building2, CreditCard, Loader2 } from 'lucide-react';
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
import { createBankDetail, getBankDetails, updateBankDetail, deleteBankDetail } from '../../api/api';

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
  status: string;
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
    createdAt: '2024-01-15',
    status: 'Active'
  },
  {
    id: 2,
    bankName: 'ICICI Bank',
    accountNumber: '012345678901',
    ifscCode: 'ICIC0001234',
    accountHolderName: 'Solar Hut Pvt Ltd',
    branchName: 'Delhi Branch',
    upiId: 'solarhut@icici',
    qrCode: null,
    createdAt: '2024-01-10',
    status: 'Active'
  }
];

// Mock data for employees
const mockEmployees: EmployeePermission[] = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@solarhut.com', role: 'Sales Manager', hasPermission: false },
  { id: 2, name: 'Priya Sharma', email: 'priya@solarhut.com', role: 'Accountant', hasPermission: false },
  { id: 3, name: 'Amit Patel', email: 'amit@solarhut.com', role: 'Field Engineer', hasPermission: false },
  { id: 4, name: 'Neha Desai', email: 'neha@solarhut.com', role: 'Sales Executive', hasPermission: false }
];

// Bank Form Component - moved outside to prevent recreation on every render
interface BankFormProps {
  formData: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    branchName: string;
    upiId: string;
    qrCode: File | null;
  };
  formErrors: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    branchName: string;
    upiId: string;
    qrCode: string;
  };
  onInputChange: (field: string, value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BankForm = ({ formData, formErrors, onInputChange, onFileUpload }: BankFormProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="bankName">Bank Name *</Label>
        <Input
          id="bankName"
          value={formData.bankName}
          onChange={(e) => onInputChange('bankName', e.target.value)}
          placeholder="Enter bank name"
          className={formErrors.bankName ? 'border-red-500' : ''}
        />
        {formErrors.bankName && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.bankName}</p>
        )}
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number *</Label>
        <Input
          id="accountNumber"
          value={formData.accountNumber}
          onChange={(e) => onInputChange('accountNumber', e.target.value)}
          placeholder="Enter account number"
          className={formErrors.accountNumber ? 'border-red-500' : ''}
        />
        {formErrors.accountNumber && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.accountNumber}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="ifscCode">IFSC Code *</Label>
        <Input
          id="ifscCode"
          value={formData.ifscCode}
          onChange={(e) => onInputChange('ifscCode', e.target.value)}
          placeholder="Enter IFSC code (e.g., SBIN0012948)"
          className={formErrors.ifscCode ? 'border-red-500' : ''}
        />
        {formErrors.ifscCode && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.ifscCode}</p>
        )}
      </div>
      <div>
        <Label htmlFor="accountHolderName">Account Holder Name</Label>
        <Input
          id="accountHolderName"
          value={formData.accountHolderName}
          onChange={(e) => onInputChange('accountHolderName', e.target.value)}
          placeholder="Enter account holder name"
          className={formErrors.accountHolderName ? 'border-red-500' : ''}
        />
        {formErrors.accountHolderName && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.accountHolderName}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="branchName">Branch Name</Label>
        <Input
          id="branchName"
          value={formData.branchName}
          onChange={(e) => onInputChange('branchName', e.target.value)}
          placeholder="Enter branch name"
          className={formErrors.branchName ? 'border-red-500' : ''}
        />
        {formErrors.branchName && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.branchName}</p>
        )}
      </div>
      <div>
        <Label htmlFor="upiId">UPI ID</Label>
        <Input
          id="upiId"
          value={formData.upiId}
          onChange={(e) => onInputChange('upiId', e.target.value)}
          placeholder="Enter UPI ID (e.g., username@bankname)"
          className={formErrors.upiId ? 'border-red-500' : ''}
        />
        {formErrors.upiId && (
          <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.upiId}</p>
        )}
      </div>
    </div>

    <div>
      <Label htmlFor="qrCode">Upload QR Code</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          id="qrCode"
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className={`flex-1 ${formErrors.qrCode ? 'border-red-500' : ''}`}
        />
        {formData.qrCode && (
          <Badge variant="outline" className="whitespace-nowrap">
            {formData.qrCode.name}
          </Badge>
        )}
      </div>
      {formErrors.qrCode && (
        <p className="text-red-600 text-sm font-semibold mt-1">{formErrors.qrCode}</p>
      )}
    </div>
  </div>
);

export function BankDetailsPage() {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>(mockBankDetails);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);
  const [employees, setEmployees] = useState<EmployeePermission[]>(mockEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddPermissionDialogOpen, setIsAddPermissionDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [deletingBankId, setDeletingBankId] = useState<number | null>(null);

  // Fetch bank details on component mount
  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    setIsFetchingData(true);
    try {
      const response = await getBankDetails();
      
      if (response.ok && response.data?.data) {
        // Convert API response to component format and filter out inactive banks
        const formattedBanks: BankDetail[] = response.data.data
          .filter((bank: any) => bank.status === 'Active')
          .map((bank: any) => ({
            id: bank.id,
            bankName: bank.bank_name,
            accountNumber: bank.account_number,
            ifscCode: bank.ifsc,
            accountHolderName: bank.account_name,
            branchName: bank.branch,
            upiId: bank.upi_id,
            qrCode: bank.qr_code_signed_url || bank.qr_code_url || null,
            createdAt: bank.created_at ? new Date(bank.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: bank.status
          }));
        setBankDetails(formattedBanks);
      } else {
        console.error('Failed to fetch bank details:', response.error);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    } finally {
      setIsFetchingData(false);
    }
  };
  const [newPermissionData, setNewPermissionData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    qrCode: null as File | null
  });

  const [formErrors, setFormErrors] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    qrCode: ''
  });

  // Validation function
  const validateForm = (data: typeof formData): boolean => {
    const errors = {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      branchName: '',
      upiId: '',
      qrCode: ''
    };

    // Bank Name validation
    if (!data.bankName.trim()) {
      errors.bankName = 'Bank name is required';
    } else if (data.bankName.trim().length < 2) {
      errors.bankName = 'Bank name must be at least 2 characters';
    } else if (data.bankName.trim().length > 100) {
      errors.bankName = 'Bank name must not exceed 100 characters';
    }

    // Account Number validation
    if (!data.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
    } else if (data.accountNumber.trim().length < 8) {
      errors.accountNumber = 'Account number must be at least 8 characters';
    } else if (data.accountNumber.trim().length > 20) {
      errors.accountNumber = 'Account number must not exceed 20 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(data.accountNumber.trim())) {
      errors.accountNumber = 'Account number can only contain letters and numbers';
    }

    // IFSC Code validation
    if (!data.ifscCode.trim()) {
      errors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode.trim())) {
      errors.ifscCode = 'IFSC code must be in format: XXXX0XXXXXX (e.g., SBIN0012948)';
    }

    // Account Holder Name validation (optional but validate if provided)
    if (data.accountHolderName.trim() && data.accountHolderName.trim().length < 2) {
      errors.accountHolderName = 'Account holder name must be at least 2 characters';
    } else if (data.accountHolderName.trim().length > 100) {
      errors.accountHolderName = 'Account holder name must not exceed 100 characters';
    }

    // Branch Name validation (optional but validate if provided)
    if (data.branchName.trim() && data.branchName.trim().length < 2) {
      errors.branchName = 'Branch name must be at least 2 characters';
    } else if (data.branchName.trim().length > 100) {
      errors.branchName = 'Branch name must not exceed 100 characters';
    }

    // UPI ID validation (optional but validate if provided)
    if (data.upiId.trim()) {
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(data.upiId.trim())) {
        errors.upiId = 'UPI ID must be in format: username@bankname';
      } else if (data.upiId.trim().length > 255) {
        errors.upiId = 'UPI ID must not exceed 255 characters';
      }
    }

    // QR Code validation (optional but validate if provided)
    if (data.qrCode) {
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedFormats.includes(data.qrCode.type)) {
        errors.qrCode = 'QR code must be an image file (JPEG, PNG, or GIF)';
      } else if (data.qrCode.size > 5 * 1024 * 1024) {
        errors.qrCode = 'QR code file size must not exceed 5MB';
      }
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, qrCode: e.target.files![0] }));
      // Clear error for QR code when user uploads a file
      if (formErrors.qrCode) {
        setFormErrors(prev => ({ ...prev, qrCode: '' }));
      }
    }
  };

  const handleAddBank = async () => {
    if (!validateForm(formData)) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for multipart request
      const apiFormData = new FormData();
      apiFormData.append('bank_name', formData.bankName);
      apiFormData.append('account_name', formData.accountHolderName);
      apiFormData.append('account_number', formData.accountNumber);
      apiFormData.append('ifsc', formData.ifscCode);
      apiFormData.append('branch', formData.branchName);
      apiFormData.append('upi_id', formData.upiId);
      
      // Append QR code file if provided
      if (formData.qrCode) {
        apiFormData.append('qr_code', formData.qrCode);
      }

      // Call API
      const response = await createBankDetail(apiFormData);

      if (response.ok && response.data?.data) {
        // Convert API response to component format
        const newBank: BankDetail = {
          id: response.data.data.id,
          bankName: response.data.data.bank_name,
          accountNumber: response.data.data.account_number,
          ifscCode: response.data.data.ifsc,
          accountHolderName: response.data.data.account_name,
          branchName: response.data.data.branch,
          upiId: response.data.data.upi_id,
          qrCode: response.data.data.qr_code_signed_url || response.data.data.qr_code_url || null,
          createdAt: new Date().toISOString().split('T')[0],
          status: response.data.data.status
        };

        setBankDetails([...bankDetails, newBank]);
        setIsAddDialogOpen(false);
        resetForm();
        // Refresh the bank details list
        fetchBankDetails();
      } else {
        toast.error(response.error || 'Failed to add bank details');
      }
    } catch (error) {
      console.error('Error adding bank:', error);
      toast.error('An error occurred while adding bank details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBank = async () => {
    if (!editingBank) return;
    if (!validateForm(formData)) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for multipart request
      const apiFormData = new FormData();
      apiFormData.append('bank_name', formData.bankName);
      apiFormData.append('account_name', formData.accountHolderName);
      apiFormData.append('account_number', formData.accountNumber);
      apiFormData.append('ifsc', formData.ifscCode);
      apiFormData.append('branch', formData.branchName);
      apiFormData.append('upi_id', formData.upiId);
      
      // Append QR code file if provided
      if (formData.qrCode) {
        apiFormData.append('qr_code', formData.qrCode);
      }

      // Call API
      const response = await updateBankDetail(editingBank.id, apiFormData);

      if (response.ok && response.data?.data) {
        // Convert API response to component format
        const updatedBank: BankDetail = {
          id: response.data.data.id,
          bankName: response.data.data.bank_name,
          accountNumber: response.data.data.account_number,
          ifscCode: response.data.data.ifsc,
          accountHolderName: response.data.data.account_name,
          branchName: response.data.data.branch,
          upiId: response.data.data.upi_id,
          qrCode: response.data.data.qr_code_signed_url || response.data.data.qr_code_url || null,
          createdAt: new Date().toISOString().split('T')[0],
          status: response.data.data.status
        };

        const updatedBanks = bankDetails.map(bank =>
          bank.id === editingBank.id ? updatedBank : bank
        );

        setBankDetails(updatedBanks);
        setIsEditDialogOpen(false);
        setEditingBank(null);
        resetForm();
        toast.success('Bank details updated successfully');
        // Refresh the bank details list
        fetchBankDetails();
      } else {
        toast.error(response.error || 'Failed to update bank details');
      }
    } catch (error) {
      console.error('Error updating bank:', error);
      toast.error('An error occurred while updating bank details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBank = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this bank detail?')) {
      return;
    }

    setDeletingBankId(id);
    try {
      const response = await deleteBankDetail(id);

      if (response.ok) {
        setBankDetails(bankDetails.filter(bank => bank.id !== id));
        if (selectedBank === id) {
          setSelectedBank(null);
        }
        toast.success('Bank details deleted successfully');
        // Refresh the bank details list
        fetchBankDetails();
      } else {
        toast.error(response.error || 'Failed to delete bank details');
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('An error occurred while deleting bank details');
    } finally {
      setDeletingBankId(null);
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
    setFormErrors({
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      branchName: '',
      upiId: '',
      qrCode: ''
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
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
    setFormErrors({
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      branchName: '',
      upiId: '',
      qrCode: ''
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

  const handleAddPermission = () => {
    if (!newPermissionData.name || !newPermissionData.email || !newPermissionData.role) {
      toast.error('Please fill all required fields');
      return;
    }

    const newEmployee: EmployeePermission = {
      id: employees.length + 1,
      name: newPermissionData.name,
      email: newPermissionData.email,
      role: newPermissionData.role,
      hasPermission: false
    };

    setEmployees([...employees, newEmployee]);
    setIsAddPermissionDialogOpen(false);
    setNewPermissionData({ name: '', email: '', role: '' });
    toast.success('Employee added successfully');
  };

  const resetPermissionForm = () => {
    setNewPermissionData({ name: '', email: '', role: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bank Details</h1>
          <p className="text-gray-500 mt-1">Manage bank accounts and payment methods</p>
        </div>
        <div className="flex gap-2">
          {/* {!isFetchingData && (
            // <Button 
            //   onClick={fetchBankDetails}
            //   variant="outline"
            //   size="sm"
            //   title="Refresh bank details"
            // >
            //   <Loader2 className="h-4 w-4" />
            // </Button>
          )} */}
          <Button onClick={openAddDialog} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Bank Details
          </Button>
        </div>
      </div>

      {/* Bank Details Cards */}
      {isFetchingData ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-gray-500">Loading bank details...</p>
          </div>
        </div>
      ) : bankDetails.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bank details found. Click 'Add Bank Details' to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    disabled={deletingBankId === bank.id}
                  >
                    {deletingBankId === bank.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 items-start">
              <div className="space-y-3">
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
              </div>
              <div className="flex justify-center">
                {bank.qrCode ? (
                  <img src={bank.qrCode} alt="QR Code" className="h-64 w-64 object-contain" />
                ) : (
                  <div className="bg-gray-100 p-4 rounded flex items-center justify-center h-64 w-64">
                    <QrCode className="h-32 w-32 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Employee Permissions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Employee Permissions</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {selectedBank
                  ? `Select employees who can use ${bankDetails.find(b => b.id === selectedBank)?.bankName} in invoices`
                  : 'Select a bank above to manage permissions'}
              </p>
            </div>
            <Button 
              onClick={() => setIsAddPermissionDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
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
          <BankForm formData={formData} formErrors={formErrors} onInputChange={handleInputChange} onFileUpload={handleFileUpload} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddBank} className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Bank'
              )}
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
          <BankForm formData={formData} formErrors={formErrors} onInputChange={handleInputChange} onFileUpload={handleFileUpload} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBank} className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Bank'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Permission Dialog */}
      <Dialog open={isAddPermissionDialogOpen} onOpenChange={setIsAddPermissionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Employee Permission</DialogTitle>
            <DialogDescription>
              Add a new employee to the system and assign permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="empName">Employee Name *</Label>
              <Input
                id="empName"
                value={newPermissionData.name}
                onChange={(e) => setNewPermissionData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <Label htmlFor="empEmail">Email Address *</Label>
              <Input
                id="empEmail"
                type="email"
                value={newPermissionData.email}
                onChange={(e) => setNewPermissionData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="empRole">Role *</Label>
              <Input
                id="empRole"
                value={newPermissionData.role}
                onChange={(e) => setNewPermissionData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Enter employee role"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddPermissionDialogOpen(false);
              resetPermissionForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddPermission} className="bg-orange-500 hover:bg-orange-600">
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
