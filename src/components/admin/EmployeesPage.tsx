import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { UserPlus, Edit, Trash2, Eye, Settings, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { AssignedEnquiries } from '../sales/AssignedEnquiries';
import { AssignedJobs } from '../field/AssignedJobs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        // Alphabets and spaces allowed, 2-50 characters
        if (!value) {
          errors.first_name = 'First name is required';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errors.first_name = 'First name must contain only alphabets and spaces (no numbers or special characters)';
        } else if (value.trim().length < 2 || value.trim().length > 50) {
          errors.first_name = 'First name must be between 2-50 characters';
        } else if (value.trim() !== value || /\s{2,}/.test(value)) {
          errors.first_name = 'First name cannot have leading/trailing spaces or multiple consecutive spaces';
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
        
      case 'joining_date':
        if (!value) {
          errors.joining_date = 'Joining date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          
          // Reset time to compare only dates
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (isNaN(selectedDate.getTime())) {
            errors.joining_date = 'Please enter a valid date';
          } else if (selectedDate < today) {
            errors.joining_date = 'Joining date cannot be in the past';
          } else if (selectedDate > thirtyDaysFromNow) {
            errors.joining_date = 'Joining date cannot be more than 30 days in the future';
          }
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
    
    // Validate joining date using field validation
    allErrors = { ...allErrors, ...validateField('joining_date', data.joining_date) };
    
    return allErrors;
  };
  
  const handleFieldChange = (field: string, value: string) => {
    // Auto-capitalize first name as user types
    let processedValue = value;
    if (field === 'first_name') {
      // Capitalize first letter of each word in real-time
      processedValue = value.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Update form data
    setFormData({ ...formData, [field]: processedValue });
    
    // Real-time validation
    const fieldErrors = validateField(field, processedValue);
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
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRolePage, setCurrentRolePage] = useState(1);
  const employeesPerPage = 10;
  const rolesPerPage = 10;

  // Custom handlers to reset pagination
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setCurrentRolePage(1);
  };

  const handleRoleFilterChange = (newRole: string) => {
    setSelectedRoleFilter(newRole);
    setCurrentPage(1);
  };

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

  // 🔹 Fetch Employees by Role ID
  const fetchEmployeesByRole = async (roleId: number | string) => {
    try {
      console.log('🔍 Fetching employees by role ID:', roleId);
      const response = await fetch(`${API_BASE_URL}/api/employees/role/${roleId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.log('⚠️ Employees by role API failed:', response.status);
        return [];
      }

      const result = await response.json();
      console.log('📊 Employees by role API response:', result);
      
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('💥 Error fetching employees by role:', error);
      return [];
    }
  };

  // 🔹 Assign Multiple Roles to Employee
  const assignRolesToEmployee = async (employeeId: number | string, roleIds: number[]) => {
    try {
      console.log('🔄 Assigning roles to employee:', { employeeId, roleIds });
      const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roles: roleIds.map(roleId => ({ role_id: roleId }))
        }),
      });

      console.log('📡 Assign roles response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Assign roles failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Assign roles result:', result);

      if (result.success) {
        toast.success(result.message || 'Roles assigned successfully');
        // Refresh employees to get updated role assignments
        await fetchEmployees();
        return result;
      } else {
        throw new Error(result.message || 'Failed to assign roles');
      }
    } catch (error) {
      console.error('💥 Error assigning roles:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign roles');
      return null;
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
    joining_date: new Date().toISOString().split('T')[0], // Default to today's date
    roles: [] as string[],
  });

  // Fetch roles and employees on component mount
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
  }, []);

  // Helper function to get employees by role
  const getEmployeesByRole = (role: string) => {
    if (role === 'All') {
      return employees;
    }
    
    return employees.filter(emp => {
      // Direct role match
      if (emp.role === role) return true;
      
      // Check roles array if it exists
      if (emp.roles && Array.isArray(emp.roles)) {
        return emp.roles.some((r: any) => {
          const roleString = typeof r === 'object' ? (r.role_name || r.name) : r;
          return roleString === role;
        });
      }
      
      return false;
    });
  };

  // Helper function to get all unique roles from employees
  const getAllEmployeeRoles = () => {
    const roleSet = new Set<string>();
    
    employees.forEach(emp => {
      // Add primary role
      if (emp.role) {
        roleSet.add(emp.role);
      }
      
      // Add roles from roles array
      if (emp.roles && Array.isArray(emp.roles)) {
        emp.roles.forEach((r: any) => {
          const roleString = typeof r === 'object' ? (r.role_name || r.name) : r;
          if (roleString) {
            roleSet.add(roleString);
          }
        });
      }
    });
    
    return Array.from(roleSet).filter(role => role && role.trim());
  };

  // Unified Employee Table Component with Pagination
  const EmployeeTable = ({ employees: tableEmployees, title }: { employees: any[], title: string }) => {
    // Calculate pagination
    const totalPages = Math.ceil(tableEmployees.length / employeesPerPage);
    const startIndex = (currentPage - 1) * employeesPerPage;
    const endIndex = startIndex + employeesPerPage;
    const currentEmployees = tableEmployees.slice(startIndex, endIndex);
    
    // Debug pagination state
    console.log('📄 Pagination State:', { 
      title, 
      currentPage, 
      totalPages, 
      totalEmployees: tableEmployees.length, 
      employeesPerPage,
      startIndex, 
      endIndex, 
      currentEmployeesCount: currentEmployees.length 
    });
    
    // Reset to first page only if current page is beyond available pages
    React.useEffect(() => {
      if (totalPages > 0 && currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [totalPages, currentPage]);

    const handlePageChange = (page: number) => {
      console.log('📄 Page number clicked:', page);
      setCurrentPage(page);
    };

    const handlePrevious = () => {
      console.log('📄 Previous button clicked:', { currentPage, canGoPrevious: currentPage > 1 });
      if (currentPage > 1) {
        const newPage = currentPage - 1;
        console.log('📄 Moving to page:', newPage);
        setCurrentPage(newPage);
      }
    };

    const handleNext = () => {
      console.log('📄 Next button clicked:', { currentPage, totalPages, canGoNext: currentPage < totalPages });
      if (currentPage < totalPages) {
        const newPage = currentPage + 1;
        console.log('📄 Moving to page:', newPage);
        setCurrentPage(newPage);
      }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        
        if (end - start < maxVisiblePages - 1) {
          start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{title}</CardTitle>
          {title === 'All Employees' && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">Filter by Role:</Label>
              <Select value={selectedRoleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles ({employees.length})</SelectItem>
                  {getAllEmployeeRoles().map((role) => {
                    const count = getEmployeesByRole(role).length;
                    return (
                      <SelectItem key={role} value={role}>
                        {role} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
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
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <p>No employees found for the selected criteria.</p>
                  </TableCell>
                </TableRow>
              ) : (
                currentEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.mobile}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">{emp.role}</Badge>
                    </TableCell>
                    <TableCell>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(emp.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(emp, emp.role)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(emp, emp.role)}
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
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {tableEmployees.length > employeesPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, tableEmployees.length)} of {tableEmployees.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Roles Table Component with Pagination
  const RolesTable = () => {
    // Calculate pagination for roles
    const totalRolePages = Math.ceil(roleData.length / rolesPerPage);
    const startRoleIndex = (currentRolePage - 1) * rolesPerPage;
    const endRoleIndex = startRoleIndex + rolesPerPage;
    const currentRoles = roleData.slice(startRoleIndex, endRoleIndex);
    
    // Debug roles pagination state
    console.log('📄 Roles Pagination State:', { 
      currentRolePage, 
      totalRolePages, 
      totalRoles: roleData.length, 
      rolesPerPage,
      startRoleIndex, 
      endRoleIndex, 
      currentRolesCount: currentRoles.length 
    });

    // Reset to first page only if current page is beyond available pages
    React.useEffect(() => {
      if (totalRolePages > 0 && currentRolePage > totalRolePages) {
        setCurrentRolePage(1);
      }
    }, [totalRolePages, currentRolePage]);

    const handleRolePageChange = (page: number) => {
      console.log('📄 Role page number clicked:', page);
      setCurrentRolePage(page);
    };

    const handleRolePrevious = () => {
      console.log('📄 Role previous button clicked:', { currentRolePage, canGoPrevious: currentRolePage > 1 });
      if (currentRolePage > 1) {
        const newPage = currentRolePage - 1;
        console.log('📄 Moving to role page:', newPage);
        setCurrentRolePage(newPage);
      }
    };

    const handleRoleNext = () => {
      console.log('📄 Role next button clicked:', { currentRolePage, totalRolePages, canGoNext: currentRolePage < totalRolePages });
      if (currentRolePage < totalRolePages) {
        const newPage = currentRolePage + 1;
        console.log('📄 Moving to role page:', newPage);
        setCurrentRolePage(newPage);
      }
    };

    // Generate page numbers for roles pagination
    const getRolePageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalRolePages <= maxVisiblePages) {
        for (let i = 1; i <= totalRolePages; i++) {
          pages.push(i);
        }
      } else {
        let start = Math.max(1, currentRolePage - 2);
        let end = Math.min(totalRolePages, start + maxVisiblePages - 1);
        
        if (end - start < maxVisiblePages - 1) {
          start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    return (
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
              {currentRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    <p>No roles found. Create a new role to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                currentRoles.map((roleInfo, index) => {
                  const role = roleInfo.role_name;
                  const employeeCount = getEmployeesByRole(role).length;

                  return (
                    <TableRow key={roleInfo.id || index}>
                      <TableCell className="text-center">
                        {roleInfo.id || 'N/A'}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {role}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-500">
                            {employeeCount} employee{employeeCount !== 1 ? 's' : ''}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRole(roleInfo.id, role)}
                            disabled={employeeCount > 0 || isDeletingRole === role}
                            className="text-red-600 hover:text-red-700"
                          >
                            {isDeletingRole === role ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
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
          
          {/* Roles Pagination Controls */}
          {roleData.length > rolesPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startRoleIndex + 1} to {Math.min(endRoleIndex, roleData.length)} of {roleData.length} roles
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRolePrevious}
                  disabled={currentRolePage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getRolePageNumbers().map((page) => (
                    <Button
                      key={page}
                      variant={currentRolePage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRolePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRoleNext}
                  disabled={currentRolePage === totalRolePages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Update active tab to default to 'all'
  useEffect(() => {
    // Default to showing all employees
    handleTabChange('all');
  }, []);



  const handleAdd = async () => {
    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    // Process first name - if it contains spaces, split it properly
    let processedFirstName = formData.first_name.trim();
    let processedLastName = formData.last_name.trim();
    
    // If first name contains spaces and last name is empty, split the first name
    if (processedFirstName.includes(' ') && !processedLastName) {
      const nameParts = processedFirstName.split(/\s+/);
      processedFirstName = nameParts[0]; // First part becomes first name (already capitalized from input)
      processedLastName = nameParts.slice(1).join(' '); // Rest becomes last name
    }
    // If first name contains spaces but last name is also provided, keep first name as is
    // If no spaces in first name, keep as is (already capitalized from input)

    try {
      if (editMode && editingId) {
        // Update existing employee via API
        const response = await fetch(`${API_BASE_URL}/api/employees/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: processedFirstName,
            last_name: processedLastName,
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
              ? { ...emp, first_name: processedFirstName, last_name: processedLastName, email: formData.email, mobile: formData.mobile, address: formData.address, roles: formData.roles, joining_date: formData.joining_date }
              : emp
          ));
          toast.success('Employee updated successfully');
        } else {
          toast.error(result.message || 'Failed to update employee');
        }
      } else {
        // Add new employee via API
        console.log('🚀 Creating employee with data:', {
          first_name: processedFirstName,
          last_name: processedLastName,
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
            first_name: processedFirstName,
            last_name: processedLastName,
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
      setFormData({ first_name: '', last_name: '', email: '', mobile: '', address: '', roles: [], joining_date: new Date().toISOString().split('T')[0] });
      setValidationErrors({});
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (employee: any, role: string) => {
    console.log('🔧 Edit button clicked for employee:', employee);
    console.log('🔧 Employee role:', role);
    try {
      // Defensive: Ensure all fields are present and fallback to empty string
      const safeEmployee = {
        first_name: employee.first_name ?? '',
        last_name: employee.last_name ?? '',
        email: employee.email ?? '',
        mobile: employee.mobile ?? '',
        address: employee.address ?? '',
        roles: Array.isArray(employee.roles) ? employee.roles : [role],
        joining_date: employee.joining_date ?? '',
      };
      setFormData(safeEmployee);
      setEditingId(employee.id ?? null);
      setEditMode(true);
      setDialogOpen(true);
      console.log('✅ Edit dialog state set successfully', safeEmployee);
    } catch (error) {
      console.error('💥 Error in handleEdit:', error);
      toast.error('Error opening edit dialog');
    }
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
    console.log('🔄 Dialog state changing to:', open);
    
    try {
      setDialogOpen(open);
      if (!open) {
        console.log('🧹 Cleaning up dialog state');
        setFormData({ first_name: '', last_name: '', email: '', mobile: '', address: '', roles: [], joining_date: new Date().toISOString().split('T')[0] });
        setValidationErrors({});
        setEditMode(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('💥 Error in handleDialogChange:', error);
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
        handleTabChange('roles');
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
    setDetailsDialogOpen(true);
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
    console.log('🔍 Viewing employee details:', selectedEmployee);
    
    try {
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
              <p className="text-gray-900">{`${selectedEmployee.first_name || ''} ${selectedEmployee.last_name || ''}`.trim() || 'Unknown Employee'}</p>
              <p className="text-sm text-gray-600">{selectedEmployee.email || 'No email'}</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🔙 Going back to employee list');
                  setViewingDetails(false);
                  setSelectedEmployee(null);
                }}
                className="mt-2 sm:mt-0"
              >
                ← Back to Employees
              </Button>
            </div>
          </div>
          
          {/* Add error boundary around components */}
          <div className="min-h-[200px]">
            {selectedEmployee.role === 'Sales Person' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Enquiry management for {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                    <p className="text-sm mt-2">This feature is under development</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Job management for {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                    <p className="text-sm mt-2">This feature is under development</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error('💥 Error rendering employee details:', error);
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-red-600 mb-4">Error loading employee details</p>
          <Button onClick={() => {
            setViewingDetails(false);
            setSelectedEmployee(null);
          }}>
            ← Back to Employees
          </Button>
        </div>
      );
    }
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
            {/* <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger> */}
            <DialogContent className="p-6 max-w-md">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl">Create New Role</DialogTitle>
              
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Enter Role Name <span style={{color:'#FF0000'}}>*</span></Label>
                  <Input
                    value={newRole}
                    onChange={(e) => {
                      setNewRole(e.target.value);
                      if (!e.target.value.trim()) {
                        setValidationErrors(prev => ({ ...prev, newRole: 'This field is required.' }));
                      } else {
                        setValidationErrors(prev => { const updated = { ...prev }; delete updated.newRole; return updated; });
                      }
                    }}
                    onBlur={e => {
                      if (!e.target.value.trim()) {
                        setValidationErrors(prev => ({ ...prev, newRole: 'This field is required.' }));
                      } else {
                        setValidationErrors(prev => { const updated = { ...prev }; delete updated.newRole; return updated; });
                      }
                    }}
                    placeholder="e.g., HR Manager"
                    className={`mt-1 ${validationErrors.newRole ? 'border-[#FF0000]' : ''}`}
                  />
                  {validationErrors.newRole && (
                    <p style={{color:'#FF0000',fontSize:12}} className="mt-1">{validationErrors.newRole}</p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setRoleDialogOpen(false)} className="flex-1" disabled={isCreatingRole}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateRole} 
                    className="flex-1" 
                    disabled={isCreatingRole || !newRole.trim() || !!validationErrors.newRole}
                  >
                    {isCreatingRole ? 'Creating...' : 'Create Role'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create New Employee Button */}
         {/* Create New Employee Button */}
        {/* Create New Employee Button */}
<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
  <DialogTrigger asChild>
    <Button 
      className="w-full sm:w-auto"
      onClick={() => {
        setEditMode(false);
        setEditingId(null);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          mobile: '',
          address: '',
          joining_date: new Date().toISOString().split('T')[0],
          roles: [],
        });
        setValidationErrors({});
      }}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Create New Employee
    </Button>
  </DialogTrigger>

  <DialogContent className="p-6 max-w-lg max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{editMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
    </DialogHeader>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            value={formData.first_name}
            onChange={e => handleFieldChange('first_name', e.target.value)}
            required
          />
          {validationErrors.first_name && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.first_name}</div>
          )}
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            value={formData.last_name}
            onChange={e => handleFieldChange('last_name', e.target.value)}
            required
          />
          {validationErrors.last_name && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.last_name}</div>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={e => handleFieldChange('email', e.target.value)}
            required
          />
          {validationErrors.email && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.email}</div>
          )}
        </div>

        <div>
          <Label>Mobile</Label>
          <Input
            value={formData.mobile}
            onChange={e => handleFieldChange('mobile', e.target.value)}
            required
          />
          {validationErrors.mobile && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.mobile}</div>
          )}
        </div>

        <div className="col-span-2">
          <Label>Address</Label>
          <Input
            value={formData.address}
            onChange={e => handleFieldChange('address', e.target.value)}
            required
          />
          {validationErrors.address && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.address}</div>
          )}
        </div>

        <div>
          <Label>Joining Date</Label>
          <Input
            type="date"
            value={formData.joining_date}
            onChange={e => handleFieldChange('joining_date', e.target.value)}
            required
          />
          {validationErrors.joining_date && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.joining_date}</div>
          )}
        </div>

        <div>
          <Label>Roles</Label>
          <Select
            value={formData.roles[0] ?? ''}
            onValueChange={(value) => setFormData({ ...formData, roles: [value] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {validationErrors.roles && (
            <div className="text-xs text-red-500 mt-1">{validationErrors.roles}</div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {editMode ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        </div>
      </div>

      {/* <div className="grid md:grid-cols-4 gap-6 mb-6">
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
      </div> */}

      <div className="space-y-6">
        {/* Role Selection Dropdown and Manage Roles Button */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Select View:</Label>
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees ({employees.length})</SelectItem>
              {getAllEmployeeRoles().map((role) => {
                const roleEmployeeCount = getEmployeesByRole(role).length;
                return (
                  <SelectItem key={role} value={role.toLowerCase().replace(/\s+/g, '-')}>
                    {role} ({roleEmployeeCount})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          {/* Manage Roles Button */}
          {/* <Button
            variant={activeTab === 'roles' ? 'default' : 'outline'}
            onClick={() => handleTabChange('roles')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Roles
          </Button> */}
        </div>

        {/* Dynamic content based on active tab */}
        <div className="space-y-4">
          {activeTab === 'all' ? (
            <EmployeeTable 
              employees={getEmployeesByRole(selectedRoleFilter)} 
              title="All Employees" 
            />
          ) : activeTab === 'roles' ? (
            <RolesTable />
          ) : (
            // Show employees for specific role
            (() => {
              const selectedRole = getAllEmployeeRoles().find(role => 
                role.toLowerCase().replace(/\s+/g, '-') === activeTab
              );
              
              if (selectedRole) {
                const roleEmployees = getEmployeesByRole(selectedRole ?? "");
                return (
                  <EmployeeTable 
                    employees={roleEmployees} 
                    title={`${selectedRole} (${roleEmployees.length})`} 
                  />
                );
              }
              
              return (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center text-gray-500">
                      <p>Role not found or no employees assigned to this role.</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })()
          )}
        </div>
      </div>

      {/* Employee Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-lg text-gray-900">{selectedEmployee.first_name} {selectedEmployee.last_name}</span>
                <span className="text-sm text-gray-600">{selectedEmployee.email}</span>
                <span className="text-sm text-gray-600">Mobile: {selectedEmployee.mobile}</span>
                <span className="text-sm text-gray-600">Role: {Array.isArray(selectedEmployee.roles) ? selectedEmployee.roles.join(', ') : selectedEmployee.role}</span>
                <span className="text-sm text-gray-600">Joining Date: {selectedEmployee.joining_date ? new Date(selectedEmployee.joining_date).toLocaleDateString() : 'N/A'}</span>
                <span className="text-sm text-gray-600">Status: {selectedEmployee.status}</span>
                <span className="text-sm text-gray-600">Address: {selectedEmployee.address}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No employee selected.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
