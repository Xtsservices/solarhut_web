import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { UserPlus, Edit, Trash2, Eye, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedEnquiries } from '../sales/AssignedEnquiries';
import { AssignedJobs } from '../field/AssignedJobs';
import { API_BASE_URL } from '../website/ip';

// 🔹 Type Definitions
type RoleResponse = {
  role_id: number;
  role_name: string;
};

type Role = {
  id: number;
  role_name: string;
};

type EmployeeRole = 'Sales Person' | 'Field Executive';

export function EmployeesPage() {
  // Helper functions for role matching
  const isSalesRole = (employee: any) => {
    if (!employee) return false;
    
    // Check single role string
    if (typeof employee === 'string') {
      const roleLower = employee.toLowerCase();
      return roleLower.includes('sales') || roleLower.includes('sale') || roleLower.includes('selling');
    }
    
    // Check employee object with multiple roles
    const checkRole = (role: string) => {
      if (!role) return false;
      const roleLower = role.toLowerCase();
      return roleLower.includes('sales') || roleLower.includes('sale') || roleLower.includes('selling');
    };
    
    // Check primary role
    if (employee.role && checkRole(employee.role)) return true;
    
    // Check all roles array
    if (employee.roles && Array.isArray(employee.roles)) {
      for (const role of employee.roles) {
        const roleString = typeof role === 'object' ? (role.role_name || role.name) : role;
        if (roleString && checkRole(roleString)) return true;
      }
    }
    
    return false;
  };
  
  const isFieldRole = (employee: any) => {
    if (!employee) return false;
    
    // Check single role string
    if (typeof employee === 'string') {
      const roleLower = employee.toLowerCase();
      return roleLower.includes('field') || roleLower.includes('executive') || roleLower.includes('exec');
    }
    
    // Check employee object with multiple roles
    const checkRole = (role: string) => {
      if (!role) return false;
      const roleLower = role.toLowerCase();
      return roleLower.includes('field') || roleLower.includes('executive') || roleLower.includes('exec');
    };
    
    // Check primary role
    if (employee.role && checkRole(employee.role)) return true;
    
    // Check all roles array
    if (employee.roles && Array.isArray(employee.roles)) {
      for (const role of employee.roles) {
        const roleString = typeof role === 'object' ? (role.role_name || role.name) : role;
        if (roleString && checkRole(roleString)) return true;
      }
    }
    
    return false;
  };
  
  const matchesRoleTab = (employee: any, tabRole: string) => {
    if (!employee || !tabRole) return false;
    
    // Helper function to check a single role against tabRole
    const checkSingleRole = (empRole: string) => {
      if (!empRole) return false;
      
      // Special handling for standard roles
      if (tabRole === 'Sales Person') return isSalesRole(empRole);
      if (tabRole === 'Field Executive') return isFieldRole(empRole);
      
      // For custom roles, try various matching strategies
      const empRoleLower = empRole.toLowerCase();
      const tabRoleLower = tabRole.toLowerCase();
      
      // Exact match
      if (empRole === tabRole) return true;
      
      // Case insensitive exact match  
      if (empRoleLower === tabRoleLower) return true;
      
      // Partial match (either direction)
      if (empRoleLower.includes(tabRoleLower) || tabRoleLower.includes(empRoleLower)) return true;
      
      // Normalized matching (remove spaces)
      const empRoleNorm = empRoleLower.replace(/\s+/g, '');
      const tabRoleNorm = tabRoleLower.replace(/\s+/g, '');
      if (empRoleNorm === tabRoleNorm) return true;
      
      return false;
    };
    
    // Check the primary role field
    if (employee.role && checkSingleRole(employee.role)) {
      return true;
    }
    
    // Check all roles in the roles array if it exists
    if (employee.roles && Array.isArray(employee.roles)) {
      for (const role of employee.roles) {
        const roleString = typeof role === 'object' ? (role.role_name || role.name) : role;
        if (roleString && checkSingleRole(roleString)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Validation functions
  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (field) {
      case 'first_name':
        // Only alphabets, 2-50 characters
        if (!value) {
          errors.first_name = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
          errors.first_name = 'First name must contain only alphabets (no spaces, numbers, or special characters)';
        } else if (value.length < 2 || value.length > 50) {
          errors.first_name = 'First name must be between 2-50 characters';
        }
        break;
        
      case 'last_name':
        // Only alphabets, 2-50 characters  
        if (!value) {
          errors.last_name = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
          errors.last_name = 'Last name must contain only alphabets (no spaces, numbers, or special characters)';
        } else if (value.length < 2 || value.length > 50) {
          errors.last_name = 'Last name must be between 2-50 characters';
        }
        break;
        
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
        
      case 'mobile':
        if (!value) {
          errors.mobile = 'Mobile number is required';
        } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
          errors.mobile = 'Mobile number must be 10 digits';
        }
        break;
        
      case 'address':
        if (!value) {
          errors.address = 'Address is required';
        } else if (value.length < 5 || value.length > 200) {
          errors.address = 'Address must be between 5-200 characters';
        }
        break;
    }
    
    return errors;
  };
  
  const validateForm = (data: any) => {
    let allErrors: Record<string, string> = {};
    
    // Validate each field
    allErrors = { ...allErrors, ...validateField('first_name', data.first_name) };
    allErrors = { ...allErrors, ...validateField('last_name', data.last_name) };
    allErrors = { ...allErrors, ...validateField('email', data.email) };
    allErrors = { ...allErrors, ...validateField('mobile', data.mobile) };
    allErrors = { ...allErrors, ...validateField('address', data.address) };
    
    // Validate roles
    if (!data.roles || data.roles.length === 0) {
      allErrors.roles = 'Please select at least one role';
    }
    
    // Validate joining date
    if (!data.joining_date) {
      allErrors.joining_date = 'Joining date is required';
    }
    
    return allErrors;
  };
  
  const handleFieldChange = (field: string, value: string) => {
    // Update form data
    setFormData({ ...formData, [field]: value });
    
    // Real-time validation
    const fieldErrors = validateField(field, value);
    setValidationErrors(prev => {
      const updated = { ...prev };
      if (fieldErrors[field]) {
        updated[field] = fieldErrors[field];
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const [employees, setEmployees] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');
  const [salesFilter, setSalesFilter] = useState<string>('All');
  const [fieldFilter, setFieldFilter] = useState<string>('All');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('roles');

  // 🔹 Fetch Roles
  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching roles from:', `${API_BASE_URL}/api/roles`);
      
      const response = await fetch(`${API_BASE_URL}/api/roles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 COMPLETE API Response:', JSON.stringify(result, null, 2));
      console.log('📊 Response type:', typeof result);
      console.log('📊 Has success property:', 'success' in result);
      console.log('📊 Has data property:', 'data' in result);
      console.log('📊 Data is array:', Array.isArray(result.data));
      
      // Special handling for the actual API response structure
      if (result.data && Array.isArray(result.data)) {
        console.log('📊 Individual roles in response:');
        result.data.forEach((role: any, index: number) => {
          console.log(`📊 Role ${index}:`, {
            raw: role,
            type: typeof role,
            isString: typeof role === 'string',
            isObject: typeof role === 'object',
            keys: typeof role === 'object' ? Object.keys(role) : 'N/A',
            stringValue: typeof role === 'string' ? role : 'N/A'
          });
        });
      }
      
      // Try multiple possible response formats
      let rolesArray = [];
      
      if (result.success && Array.isArray(result.data)) {
        rolesArray = result.data;
      } else if (Array.isArray(result.data)) {
        rolesArray = result.data;
      } else if (Array.isArray(result)) {
        rolesArray = result;
      } else {
        console.log('❌ Unknown response format:', result);
      }

      console.log('📊 Extracted roles array:', rolesArray);

      if (rolesArray.length > 0) {
        // Handle different possible data formats
        const formatted: Role[] = rolesArray
          .filter((r: any) => {
            console.log('🔍 Checking role item:', r, 'type:', typeof r);
            // Handle string roles or object roles
            return r && (typeof r === 'string' || (typeof r === 'object' && (r.role_name || r.name)));
          })
          .map((r: any, index: number) => {
            let roleData;
            if (typeof r === 'string') {
              // If it's just a string (role name) - create a proper role object
              console.warn('⚠️ Role received as string:', r);
              
              // For string roles, we need to use the role name to find the actual ID
              // This is a temporary workaround - the API should return proper objects
              roleData = {
                id: index + 1, // Use index-based ID as fallback
                role_name: r,
              };
            } else if (r && typeof r === 'object') {
              // Extract ID from object
              const extractedId = r.role_id || r.id;
              
              console.log(`🔍 ID extraction for role "${r.role_name || r.name}":`, {
                raw_object: r,
                role_id: r.role_id,
                id: r.id,
                extractedId: extractedId,
                extractedType: typeof extractedId
              });
              
              roleData = {
                id: extractedId || (index + 1), // Use database ID or fallback
                role_name: r.role_name || r.name || `Role_${index + 1}`,
              };
            } else {
              // Fallback for any other case
              roleData = {
                id: index + 1,
                role_name: `Role_${index + 1}`,
              };
            }
            
            console.log('🔄 Final mapped role:', {
              original: r,
              mapped: roleData,
              id_type: typeof roleData.id
            });
            return roleData;
          });
        
        console.log('📊 Formatted roles for roleData:', formatted);
        setRoleData(formatted);
        
        const roleNames = formatted.map((r) => r.role_name).filter(name => name && name.trim());
        console.log('📊 Role names for dropdown:', roleNames);
        setRoles(roleNames);
        
        setLastUpdate(Date.now());
        console.log('✅ SUCCESS: Roles loaded successfully');
        console.log('✅ roleData has', formatted.length, 'items');
        console.log('✅ roles has', roleNames.length, 'items');
      } else {
        console.log('❌ No roles found in response');
        setRoleData([]);
        setRoles([]);
      }
    } catch (error) {
      console.error('💥 Error fetching roles:', error);
      setRoleData([]);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch Employee Roles (separate API call)
  const fetchEmployeeRoles = async () => {
    try {
      console.log('🔍 Checking for employee roles API...');
      const response = await fetch(`${API_BASE_URL}/api/employee-roles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Employee roles API response:', result);
        return result.data || result || [];
      } else {
        console.log('⚠️ Employee roles API not available or failed:', response.status);
        return [];
      }
    } catch (error) {
      console.log('⚠️ Employee roles API error:', error);
      return [];
    }
  };

  // 🔹 Fetch Employees
  const fetchEmployees = async () => {
    try {
      setIsLoadingEmployees(true);
      console.log('🔍 Fetching employees from:', `${API_BASE_URL}/api/employees/`);
      
      // Try to fetch employee roles first
      const employeeRoles = await fetchEmployeeRoles();
      console.log('📊 Employee roles from separate API:', employeeRoles);
      
      const response = await fetch(`${API_BASE_URL}/api/employees/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('📡 Fetch employees response status:', response.status, response.statusText);

      if (!response.ok) {
        console.log('⚠️ Employees API not available, using empty array');
        setEmployees([]);
        return;
      }

      const result = await response.json();
      console.log('📊 COMPLETE EMPLOYEES API Response:', JSON.stringify(result, null, 2));
      console.log('📊 Employees response type:', typeof result);
      console.log('📊 Has success property:', 'success' in result);
      console.log('📊 Has data property:', 'data' in result);
      console.log('📊 Data is array:', Array.isArray(result.data));
      
      // Check individual employee structure
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        console.log('📊 First employee structure:', result.data[0]);
        console.log('📊 Employee has roles field:', 'roles' in result.data[0]);
        console.log('📊 Employee has role field:', 'role' in result.data[0]);
        console.log('📊 Available employee fields:', Object.keys(result.data[0]));
      }

      // Try multiple possible response formats
      let employeesArray = [];
      
      if (result.success && Array.isArray(result.data)) {
        employeesArray = result.data;
      } else if (Array.isArray(result.data)) {
        employeesArray = result.data;
      } else if (Array.isArray(result)) {
        employeesArray = result;
      } else {
        console.log('❌ Unknown employees response format:', result);
      }

      console.log('📊 Extracted employees array:', employeesArray);
      console.log('📊 Number of employees found:', employeesArray.length);

      if (employeesArray.length > 0) {
        console.log('🔄 Processing employees...');
        // Process each employee to ensure consistent format
        const processedEmployees = employeesArray.map((emp: any, index: number) => {
          console.log('� Processing employee:', emp);
          
          // Handle different possible employee data formats
          const processedEmp = {
            id: emp.id || emp.user_id || emp.employee_id || index + 1,
            first_name: emp.first_name || emp.firstName || emp.name?.split(' ')[0] || 'Unknown',
            last_name: emp.last_name || emp.lastName || emp.name?.split(' ').slice(1).join(' ') || '',
            email: emp.email || emp.email_id || '',
            mobile: emp.mobile || emp.phone || emp.contact || '',
            address: emp.address || '',
            joining_date: emp.joining_date || emp.joinDate || emp.created_at || '',
            role: (() => {
              // Extract role information from nested roles array if present
              let employeeRole = 'General Employee'; // Default role for employees without specific roles
              
              if (emp.roles && Array.isArray(emp.roles) && emp.roles.length > 0) {
                console.log('🔍 Found roles array:', emp.roles);
                // If roles is an array of objects with role_name
                if (typeof emp.roles[0] === 'object' && emp.roles[0].role_name) {
                  employeeRole = emp.roles[0].role_name;
                  console.log('🎯 Extracted role from roles[0].role_name:', employeeRole);
                } 
                // If roles is an array of strings
                else if (typeof emp.roles[0] === 'string') {
                  employeeRole = emp.roles[0];
                  console.log('🎯 Extracted role from roles[0] string:', employeeRole);
                }
              } else if (emp.role) {
                employeeRole = emp.role;
                console.log('🎯 Extracted role from emp.role:', employeeRole);
              } else if (emp.role_name) {
                employeeRole = emp.role_name;
                console.log('🎯 Extracted role from emp.role_name:', employeeRole);
              } else if (emp.designation) {
                employeeRole = emp.designation;
                console.log('🎯 Extracted role from emp.designation:', employeeRole);
              } else {
                // For employees without specific roles, assign them based on user_id or other patterns
                console.log('⚠️ No role found for employee, using default:', employeeRole);
              }
              
              console.log('🎯 Final employee role for', emp.first_name, ':', employeeRole);
              return employeeRole;
            })(),
            roles: emp.roles || [emp.role || emp.role_name || emp.designation || 'General Employee'],
            status: emp.status || 'available',
            // Keep any additional fields
            ...emp
          };
          
          console.log('🔄 Processed employee:', emp, '→', processedEmp);
          return processedEmp;
        });

        console.log('📊 Final processed employees:', processedEmployees);
        setEmployees(processedEmployees);
        console.log('✅ SUCCESS: Employees loaded successfully');
        console.log('✅ employees has', processedEmployees.length, 'items');
        
        // Log role distribution
        const roleDistribution = processedEmployees.reduce((acc: any, emp: any) => {
          const role = emp.role || 'Unknown';
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        console.log('📊 Employee role distribution:', roleDistribution);
        
        // Add unique employee roles to roles list if they don't exist
        const uniqueEmployeeRoles = [...new Set(processedEmployees.map((emp: any) => emp.role))];
        console.log('📊 Unique roles from employees:', uniqueEmployeeRoles);
        
        // Update roles to include employee roles that might not be in the roles API
        setRoles(currentRoles => {
          const combinedRoles = [...new Set([...currentRoles, ...uniqueEmployeeRoles])]
            .filter((role): role is string => {
              return typeof role === 'string' && role.trim().length > 0;
            });
          console.log('📊 Combined roles (API + Employees):', combinedRoles);
          return combinedRoles;
        });
        
      } else {
        console.log('❌ No employees found in response');
        setEmployees([]);
      }
    } catch (error) {
      console.error('💥 Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
    joining_date: '',
    roles: [] as string[],
  });

  // Fetch roles and employees on component mount
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
  }, []);

  // Update active tab based on available roles
  useEffect(() => {
    if (roles.includes('Sales Person')) {
      setActiveTab('sales');
    } else if (roles.includes('Field Executive')) {
      setActiveTab('field');
    } else {
      setActiveTab('roles');
    }
  }, [roles]);



  const handleAdd = async () => {
    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    try {
      if (editMode && editingId) {
        // Update existing employee via API
        const response = await fetch(`${API_BASE_URL}/api/employees/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            roles: formData.roles,
            joining_date: formData.joining_date,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setEmployees(employees.map((emp) =>
            emp.id === editingId
              ? { ...emp, first_name: formData.first_name, last_name: formData.last_name, email: formData.email, mobile: formData.mobile, address: formData.address, roles: formData.roles, joining_date: formData.joining_date }
              : emp
          ));
          toast.success('Employee updated successfully');
        } else {
          toast.error(result.message || 'Failed to update employee');
        }
      } else {
        // Add new employee via API
        console.log('🚀 Creating employee with data:', {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          joining_date: formData.joining_date,
          roles: formData.roles
        });

        const response = await fetch(`${API_BASE_URL}/api/employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            joining_date: formData.joining_date,
            roles: formData.roles,
          }),
        });

        console.log('📡 Employee creation response status:', response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ Employee creation failed:', errorData);
          
          try {
            const parsedError = JSON.parse(errorData);
            if (parsedError.errors && Array.isArray(parsedError.errors)) {
              // Handle validation errors from backend
              toast.error(`Validation Error: ${parsedError.errors.join(', ')}`);
            } else if (parsedError.message) {
              toast.error(`Error: ${parsedError.message}`);
            } else {
              toast.error('Failed to create employee. Please check your input.');
            }
          } catch {
            toast.error('Failed to create employee. Please check your input.');
          }
          return;
        }

        const result = await response.json();
        console.log('📊 Employee creation result:', result);

        if (result.success) {
          // Refresh employees list to get the new employee with proper ID
          await fetchEmployees();
          toast.success(result.message || 'Employee created successfully');
        } else {
          toast.error(result.message || 'Failed to add employee');
        }
      }

      setDialogOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', mobile: '', address: '', roles: [], joining_date: '' });
      setValidationErrors({});
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (employee: any, role: string) => {
    // Convert role name to role names array for roles
    const roleNames = employee.roles || [role];

    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      mobile: employee.mobile || '',
      address: employee.address || '',
      roles: Array.isArray(roleNames) ? roleNames : [roleNames],
      joining_date: employee.joining_date || '',
    });
    setEditingId(employee.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, role: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setEmployees(employees.filter((emp) => emp.id !== id));
        toast.success('Employee removed successfully');
      } else {
        toast.error(result.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee. Please try again.');
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setFormData({ first_name: '', last_name: '', email: '', mobile: '', address: '', roles: [], joining_date: '' });
      setValidationErrors({});
      setEditMode(false);
      setEditingId(null);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    // Capitalize first letter of each word
    const capitalizedRole = newRole.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('🔄 Creating role:', { originalRole: newRole, capitalizedRole });

    if (roles.includes(capitalizedRole)) {
      toast.error('Role already exists');
      return;
    }

    if (!API_BASE_URL) {
      toast.error('API configuration error: Base URL not found');
      return;
    }

    setIsCreatingRole(true);

    try {
      const createRoleUrl = `${API_BASE_URL}/api/roles`;
      const requestBody = { role_name: capitalizedRole };

      console.log('🚀 Creating role with:', {
        url: createRoleUrl,
        body: requestBody,
        apiBaseUrl: API_BASE_URL,
        headers: { 'Content-Type': 'application/json' }
      });

      // First test if the server is reachable
      console.log('🔍 Testing server connectivity...');

      const response = await fetch(createRoleUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Create role response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create role failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: createRoleUrl
        });

        // Provide specific error messages based on status
        if (response.status === 404) {
          const port = API_BASE_URL.includes(':') ? API_BASE_URL.split(':').pop() : 'unknown';
          throw new Error(`API endpoint not found: ${createRoleUrl}. Check if your backend server is running on port ${port}`);
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorText}`);
        } else if (response.status === 0 || !response.status) {
          throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please check if your backend server is running.`);
        } else {
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('📊 Create role result:', result);

      // Handle different possible response formats
      if (result.success || result.message || result.role_id || result.id || response.status === 201) {
        console.log('✅ Role creation successful, API returned:', {
          success: result.success,
          role_id: result.role_id,
          id: result.id,
          message: result.message,
          full_response: result
        });
        
        // Refresh the roles list to get the new role with its ID
        console.log('🔄 Refreshing roles after creation...');
        await fetchRoles();
        console.log('✅ Role creation completed, roleData should be updated now');

        const successMessage = result.message || `Role "${capitalizedRole}" created successfully`;
        toast.success(successMessage);
        setNewRole('');
        setRoleDialogOpen(false);

        // Switch to roles tab to show the newly created role
        setActiveTab('roles');
      } else {
        console.error('❌ Create role API returned unexpected format:', result);
        toast.error(result.error || result.message || 'Role creation failed - unexpected response format');
      }

    } catch (error) {
      console.error('💥 Error creating role:', error);

      let errorMessage = 'Unknown error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }

      // Show user-friendly error message
      if (errorMessage.includes('fetch')) {
        toast.error('Network error: Cannot connect to server. Please check if your backend is running.');
      } else if (errorMessage.includes('404')) {
        toast.error('API endpoint not found. Please check your backend server.');
      } else if (errorMessage.includes('500')) {
        toast.error('Server error occurred. Please try again.');
      } else {
        toast.error(`Failed to create role: ${errorMessage}`);
      }

    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleRoleDialogChange = (open: boolean) => {
    setRoleDialogOpen(open);
    if (!open) {
      setNewRole('');
    }
  };

  // 🔹 Delete Role
  const handleDeleteRole = async (roleId: number | string, roleName: string) => {
    console.log('🗑️ Delete role called with:', { roleId, roleName, type: typeof roleId });

    // Check if any employees have this role
    const hasEmployees = employees.filter(emp => emp.role === roleName).length > 0;

    if (hasEmployees) {
      toast.error('Cannot delete role that is assigned to employees');
      return;
    }

    setIsDeletingRole(roleName);

    try {
      // Since your API returns role names as strings, try multiple delete approaches
      console.log('🗑️ Attempting to delete role:', { roleId, roleName, roleIdType: typeof roleId });

      let response;
      let deleteAttempted = false;

      // Method 1: Try DELETE with role name in URL (most common pattern)
      try {
        const deleteUrl = `${API_BASE_URL}/api/roles/${encodeURIComponent(roleName)}`;
        console.log('🔄 Trying Method 1 - DELETE by name in URL:', deleteUrl);
        
        response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log('📡 Method 1 response:', response.status, response.statusText);
        deleteAttempted = true;

        if (response.ok) {
          console.log('✅ Method 1 succeeded');
        } else {
          throw new Error('Method 1 failed');
        }
      } catch (error) {
        console.log('❌ Method 1 failed:', error);
        
        // Method 2: Try DELETE with role name in request body
        try {
          console.log('🔄 Trying Method 2 - DELETE with role name in body');
          response = await fetch(`${API_BASE_URL}/api/roles`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_name: roleName })
          });
          
          console.log('📡 Method 2 response:', response.status, response.statusText);
          deleteAttempted = true;

          if (response.ok) {
            console.log('✅ Method 2 succeeded');
          } else {
            throw new Error('Method 2 failed');
          }
        } catch (error2) {
          console.log('❌ Method 2 failed:', error2);
          
          // Method 3: Try with roleId if it exists and is valid
          if (roleId && typeof roleId === 'number') {
            try {
              console.log('🔄 Trying Method 3 - DELETE by ID');
              response = await fetch(`${API_BASE_URL}/api/roles/${roleId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });
              
              console.log('📡 Method 3 response:', response.status, response.statusText);
              deleteAttempted = true;

              if (!response.ok) {
                throw new Error('Method 3 failed');
              }
              console.log('✅ Method 3 succeeded');
            } catch (error3) {
              console.log('❌ Method 3 failed:', error3);
              throw new Error(`All delete methods failed for role: ${roleName}`);
            }
          } else {
            throw new Error(`All available delete methods failed for role: ${roleName}`);
          }
        }
      }

      if (!deleteAttempted || !response || !response.ok) {
        // Try to get the error message from the response
        let errorMessage = `Failed to delete role: ${roleName}`;
        
        if (response) {
          try {
            const errorData = await response.text();
            console.log('🔍 Error response body:', errorData);
            
            // Check if it's a JSON error message
            try {
              const parsedError = JSON.parse(errorData);
              errorMessage = parsedError.message || parsedError.error || errorMessage;
            } catch {
              // If not JSON, use the text directly (removing quotes)
              if (errorData && errorData.length > 0) {
                errorMessage = errorData.replace(/^"|"$/g, ''); // Remove surrounding quotes
              }
            }
          } catch (parseError) {
            console.log('Could not parse error response:', parseError);
          }
        }
        
        throw new Error(errorMessage);
      }

      toast.success(`Role "${roleName}" deleted successfully`);
      
      // Refresh roles list
      await fetchRoles();
      
      // Remove employees with this role from local state  
      setEmployees(employees.filter(emp => emp.role !== roleName));

    } catch (error) {
      console.error('💥 Error deleting role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete role: ${errorMessage}`);
    } finally {
      setIsDeletingRole(null);
    }
  };



  const handleView = (employee: any, role: string) => {
    setSelectedEmployee({ ...employee, role });
    setViewingDetails(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      available: { label: 'Available', color: 'bg-green-100 text-green-700' },
      'on-job': { label: 'On Job', color: 'bg-blue-100 text-blue-700' },
      busy: { label: 'Busy', color: 'bg-orange-100 text-orange-700' },
    };
    const config = variants[status] || variants.available;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // 🔹 Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading roles...
      </div>
    );
  }

  // If viewing employee details, show their specific page
  if (viewingDetails && selectedEmployee) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-gray-900 mb-2">
              {selectedEmployee.role === 'Sales Person' ? 'Assigned Enquiries' : 'Assigned Jobs'}
            </h1>
            <p className="text-gray-600">
              {selectedEmployee.role === 'Sales Person'
                ? 'Manage assigned customer enquiries'
                : 'Manage assigned field jobs'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{selectedEmployee.name}</p>
            <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
          </div>
        </div>
        {selectedEmployee.role === 'Sales Person' ? <AssignedEnquiries /> : <AssignedJobs />}
      </div>
    );
  }

  // Debug: Check roleData before rendering
  console.log('🎯 Component render - roleData:', roleData, 'length:', roleData.length);
  console.log('🎯 Component render - roles:', roles, 'length:', roles.length);
  console.log('🎯 Component render - lastUpdate:', lastUpdate);
  console.log('🎯 Component render - roleData items:', roleData.map(r => ({ id: r.id, name: r.role_name })));

  return (
    <div key={`employees-page-${roleData.length}-${lastUpdate}`} className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1 sm:mb-2">Employees</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your sales and field teams</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Create Role Button */}
          <Dialog open={roleDialogOpen} onOpenChange={handleRoleDialogChange}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-md">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl">Create New Role</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Enter a name for the new employee role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Enter Role Name</Label>
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g., HR Manager"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setRoleDialogOpen(false)} className="flex-1" disabled={isCreatingRole}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole} className="flex-1" disabled={isCreatingRole}>
                    {isCreatingRole ? 'Creating...' : 'Create Role'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create New Employee Button */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-lg">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl">{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  {editMode ? 'Update the employee details' : 'Fill in the employee information below'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      placeholder="Enter first name (alphabets only)"
                      className={`mt-1 ${validationErrors.first_name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {validationErrors.first_name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      placeholder="Enter last name (alphabets only)"
                      className={`mt-1 ${validationErrors.last_name ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {validationErrors.last_name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.last_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={`mt-1 ${validationErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Mobile</Label>
                  <Input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    placeholder="Enter mobile number (10 digits)"
                    className={`mt-1 ${validationErrors.mobile ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Enter address"
                    className={`mt-1 ${validationErrors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Joining Date</Label>
                  <Input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => handleFieldChange('joining_date', e.target.value)}
                    className={`mt-1 ${validationErrors.joining_date ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.joining_date && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.joining_date}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Roles (Select multiple)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`mt-1 w-full justify-between ${editMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={editMode}
                      >
                        <span className="truncate">
                          {formData.roles.length === 0 
                            ? "Select roles..." 
                            : `${formData.roles.length} role${formData.roles.length === 1 ? '' : 's'} selected`
                          }
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <div className="max-h-48 overflow-y-auto">
                        {roles.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">No roles available. Create roles first.</div>
                        ) : (
                          <div className="p-1">
                            {roles.map((roleInfo) => (
                              <div
                                key={roleInfo}
                                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-sm"
                                onClick={() => {
                                  const isSelected = formData.roles.includes(roleInfo);
                                  let newRoles;
                                  if (isSelected) {
                                    // Remove role if already selected
                                    newRoles = formData.roles.filter(r => r !== roleInfo);
                                  } else {
                                    // Add role if not selected
                                    newRoles = [...formData.roles, roleInfo];
                                  }
                                  setFormData({ ...formData, roles: newRoles });
                                  
                                  // Clear roles validation error if roles are selected
                                  if (newRoles.length > 0 && validationErrors.roles) {
                                    setValidationErrors(prev => {
                                      const updated = { ...prev };
                                      delete updated.roles;
                                      return updated;
                                    });
                                  }
                                }}
                              >
                                <span className="text-sm">{roleInfo}</span>
                                {formData.roles.includes(roleInfo) && (
                                  <span className="text-green-600 font-bold text-lg">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {validationErrors.roles && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.roles}</p>
                  )}
                  {editMode && (
                    <p className="text-xs text-gray-500 mt-1">Roles cannot be changed when editing</p>
                  )}
                  {formData.roles.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {formData.roles.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.roles.length === 0 && !editMode && (
                    <p className="text-xs text-red-500 mt-1">Please select at least one role</p>
                  )}
                </div>

                {/* <div>
                <Label className="text-sm font-medium">Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                  className="mt-1"
                />
              </div> */}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} className="flex-1">
                    {editMode ? 'Update Employee' : 'Submit'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Employees</p>
            <p className="text-gray-900">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Sales Team</p>
            <p className="text-gray-900">{employees.filter(emp => isSalesRole(emp)).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Field Team</p>
            <p className="text-gray-900">{employees.filter(emp => isFieldRole(emp)).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Available Executives</p>
            <p className="text-gray-900">
              {employees.filter(emp => isFieldRole(emp) && emp.status === 'available').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Role Selection Dropdown */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Select Team:</Label>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              {roles.includes('Sales Person') && (
                <SelectItem value="sales">Sales Team ({employees.filter(emp => isSalesRole(emp)).length})</SelectItem>
              )}
              {roles.includes('Field Executive') && (
                <SelectItem value="field">Field Team ({employees.filter(emp => isFieldRole(emp)).length})</SelectItem>
              )}
              {/* Dynamic options for custom roles */}
              {roles.filter(role => role && role !== 'Sales Person' && role !== 'Field Executive').map((role) => {
                const roleEmployeeCount = employees.filter(emp => emp.role === role).length;
                console.log(`🎯 DROPDOWN ${role}: found ${roleEmployeeCount} employees`);
                return (
                  <SelectItem key={role} value={role.toLowerCase().replace(/\s+/g, '-')}>
                    {role} ({roleEmployeeCount})
                  </SelectItem>
                );
              })}
              <SelectItem value="roles">Manage Roles</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

        {roles.includes('Sales Person') && (
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Sales Team</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filter by Status:</Label>
                  <Select value={salesFilter} onValueChange={setSalesFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const salesEmployees = employees.filter(emp => isSalesRole(emp));
                      const filteredEmployees = salesEmployees.filter(emp => {
                        if (salesFilter === 'All') return true;
                        if (salesFilter === 'Active') return emp.status === 'Active' || emp.status === 'available';
                        if (salesFilter === 'Inactive') return emp.status === 'Inactive' || emp.status === 'unavailable';
                        return true;
                      });
                      console.log('🎯 SALES TABLE - Total employees:', employees.length);
                      console.log('🎯 SALES TABLE - Sales employees:', salesEmployees.length, salesEmployees);
                      console.log('🎯 SALES TABLE - Filter applied:', salesFilter);
                      console.log('🎯 SALES TABLE - Filtered employees:', filteredEmployees.length, filteredEmployees);
                      return null;
                    })()}
                    {employees
                      .filter(emp => isSalesRole(emp))
                      .filter(emp => {
                        if (salesFilter === 'All') return true;
                        if (salesFilter === 'Active') return emp.status === 'Active' || emp.status === 'available';
                        if (salesFilter === 'Inactive') return emp.status === 'Inactive' || emp.status === 'unavailable';
                        return true;
                      })
                      .length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          <p>No sales team members found.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees
                        .filter(emp => emp.role === 'Sales Person')
                        .map((emp, index) => {
                          console.log(`🎯 RENDERING SALES EMPLOYEE ${index}:`, emp);
                          return (
                            <TableRow key={emp.id}>
                              <TableCell>{emp.id}</TableCell>
                              <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                              <TableCell>{emp.email}</TableCell>
                              <TableCell>{emp.mobile}</TableCell>
                              <TableCell>
                                <Badge className="bg-purple-100 text-purple-700">Sales Person</Badge>
                              </TableCell>
                              <TableCell>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{emp.assignedEnquiries || 0}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{emp.pendingQuotations || 0}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleView(emp, 'Sales Person')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(emp, 'Sales Person')}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(emp.id, emp.role)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {roles.includes('Field Executive') && (
          <TabsContent value="field" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Field Team</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Filter by Status:</Label>
                  <Select value={fieldFilter} onValueChange={setFieldFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Job">On Job</SelectItem>
                      <SelectItem value="Busy">Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees
                      .filter(emp => isFieldRole(emp))
                      .filter(emp => {
                        if (fieldFilter === 'All') return true;
                        if (fieldFilter === 'Available') return emp.status === 'available' || emp.status === 'Available';
                        if (fieldFilter === 'On Job') return emp.status === 'on-job' || emp.status === 'On Job';
                        if (fieldFilter === 'Busy') return emp.status === 'busy' || emp.status === 'Busy';
                        return true;
                      })
                      .map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell>{emp.id}</TableCell>
                          <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                          <TableCell>{emp.email}</TableCell>
                          <TableCell>{emp.mobile}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700">Field Executive</Badge>
                          </TableCell>
                          <TableCell>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{emp.totalWorks || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{emp.pendingWorks || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleView(emp, 'Field Executive')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(emp, 'Field Executive')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(emp.id, emp.role)}
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
          </TabsContent>
        )}

        {/* Dynamic TabsContent for custom roles */}
        {roles.filter(role => role && role !== 'Sales Person' && role !== 'Field Executive').map((role) => {
          // Enhanced role matching - try exact match first, then partial match
          console.log(`🚀 STARTING ROLE FILTERING FOR TAB: "${role}"`);
          console.log(`🚀 Total employees available:`, employees.length);
          console.log(`🚀 All employees:`, employees.map((emp, i) => `${i+1}. ${emp.first_name} ${emp.last_name} (${emp.role})`));
          
          const roleEmployees = employees.filter(emp => {
            const matches = matchesRoleTab(emp, role);
            const empRoles = emp.roles && Array.isArray(emp.roles) ? emp.roles.join(', ') : emp.role;
            console.log(`🔍 Employee "${emp.first_name} ${emp.last_name}" (roles: ${empRoles}) vs tab "${role}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
            return matches;
          });
          
          console.log(`🎯 TAB "${role}" - Found ${roleEmployees.length} employees:`, roleEmployees.map(emp => `${emp.first_name} (${emp.role})`));
          console.log(`🎯 TAB "${role}" - Looking for employees with roles containing: "${role}"`);
          console.log(`🎯 TAB "${role}" - All employee roles:`, employees.map(emp => emp.role));
          console.log(`🎯 TAB "${role}" - Total employees in state:`, employees.length);
          console.log(`🎯 TAB "${role}" - Employees state:`, employees.map(emp => ({ id: emp.id, name: `${emp.first_name} ${emp.last_name}`, role: emp.role })));
          
          const tabValue = role.toLowerCase().replace(/\s+/g, '-');

          return (
            <TabsContent key={role} value={tabValue} className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>{role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joining Date</TableHead>
                        <TableHead>Assigned</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roleEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            <p>No {role.toLowerCase()} team members found.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        roleEmployees
                          .map((employee, index) => {
                            console.log(`🎯 RENDERING ${role.toUpperCase()} EMPLOYEE ${index}:`, employee);
                            return (
                              <TableRow key={employee.id}>
                                <TableCell>{employee.id}</TableCell>
                                <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.mobile}</TableCell>
                                <TableCell>
                                  <Badge className="bg-orange-100 text-orange-700">{employee.role}</Badge>
                                </TableCell>
                                <TableCell>{employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{employee.assignedTasks || 0}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{employee.pendingTasks || 0}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleView(employee, employee.role)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEdit(employee, employee.role)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDelete(employee.id, employee.role)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table key={`roles-table-${roleData.length}-${lastUpdate}`}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Role ID</TableHead>
                    <TableHead className="text-center">Role Name</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    console.log('🎯 TABLE RENDER - roleData:', roleData, 'length:', roleData.length);
                    return null;
                  })()}
                  {roleData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        <Settings className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>No roles created yet. Create your first role to get started.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roleData.map((roleInfo, index) => {
                      console.log(`🎯 RENDERING ROLE ${index}:`, {
                        full_roleInfo: roleInfo,
                        id_value: roleInfo.id,
                        id_type: typeof roleInfo.id,
                        role_name: roleInfo.role_name,
                        has_valid_id: !!(roleInfo.id)
                      });
                      const role = roleInfo.role_name;
                      const employeeCount = employees.filter(emp => emp.role === role).length;

                      return (
                        <TableRow key={`role-${roleInfo.id}-${lastUpdate}`}>
                          <TableCell className="text-center">
                            <span className="text-xs text-gray-600">
                              #{roleInfo.id}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-center">{role}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRole(roleInfo.id, role)}
                                disabled={employeeCount > 0 || isDeletingRole === role}
                                title={employeeCount > 0 ? 'Cannot delete role with assigned employees' : 'Delete role'}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {isDeletingRole === role ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
