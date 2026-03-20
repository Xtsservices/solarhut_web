import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { AssignedEnquiries } from "../sales/AssignedEnquiries";
import { AssignedJobs } from "../field/AssignedJobs";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api/commonApi";

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

type EmployeeRole = "Sales Person" | "Field Executive";

type Feature = {
  id: number;
  feature_name: string;
  status: string;
  created_by: number;
  creator_name: string;
};

type FeaturePermission = {
  feature_id: number;
  feature_name: string;
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
};

export function EmployeesPage() {
  // Helper functions for role matching
  const isSalesRole = (employee: any) => {
    if (!employee) return false;

    // Check single role string
    if (typeof employee === "string") {
      const roleLower = employee.toLowerCase();
      return (
        roleLower.includes("sales") ||
        roleLower.includes("sale") ||
        roleLower.includes("selling")
      );
    }

    // Check employee object with multiple roles
    const checkRole = (role: string) => {
      if (!role) return false;
      const roleLower = role.toLowerCase();
      return (
        roleLower.includes("sales") ||
        roleLower.includes("sale") ||
        roleLower.includes("selling")
      );
    };

    // Check primary role
    if (employee.role && checkRole(employee.role)) return true;

    // Check all roles array
    if (employee.roles && Array.isArray(employee.roles)) {
      for (const role of employee.roles) {
        const roleString =
          typeof role === "object" ? role.role_name || role.name : role;
        if (roleString && checkRole(roleString)) return true;
      }
    }

    return false;
  };

  const isFieldRole = (employee: any) => {
    if (!employee) return false;

    // Check single role string
    if (typeof employee === "string") {
      const roleLower = employee.toLowerCase();
      return (
        roleLower.includes("field") ||
        roleLower.includes("executive") ||
        roleLower.includes("exec")
      );
    }

    // Check employee object with multiple roles
    const checkRole = (role: string) => {
      if (!role) return false;
      const roleLower = role.toLowerCase();
      return (
        roleLower.includes("field") ||
        roleLower.includes("executive") ||
        roleLower.includes("exec")
      );
    };

    // Check primary role
    if (employee.role && checkRole(employee.role)) return true;

    // Check all roles array
    if (employee.roles && Array.isArray(employee.roles)) {
      for (const role of employee.roles) {
        const roleString =
          typeof role === "object" ? role.role_name || role.name : role;
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
      if (tabRole === "Sales Person") return isSalesRole(empRole);
      if (tabRole === "Field Executive") return isFieldRole(empRole);

      // For custom roles, try various matching strategies
      const empRoleLower = empRole.toLowerCase();
      const tabRoleLower = tabRole.toLowerCase();

      // Exact match
      if (empRole === tabRole) return true;

      // Case insensitive exact match
      if (empRoleLower === tabRoleLower) return true;

      // Partial match (either direction)
      if (
        empRoleLower.includes(tabRoleLower) ||
        tabRoleLower.includes(empRoleLower)
      )
        return true;

      // Normalized matching (remove spaces)
      const empRoleNorm = empRoleLower.replace(/\s+/g, "");
      const tabRoleNorm = tabRoleLower.replace(/\s+/g, "");
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
        const roleString =
          typeof role === "object" ? role.role_name || role.name : role;
        if (roleString && checkSingleRole(roleString)) {
          return true;
        }
      }
    }

    return false;
  };

  // 🔹 Helper: Format role names from array of strings/objects
  const getRoleNames = (roles: any[]): string => {
    if (!roles || !Array.isArray(roles)) return "";
    return roles
      .map((r: any) =>
        typeof r === "object" ? r.role_name || r.name || "" : r,
      )
      .filter(Boolean)
      .join(", ");
  };

  // Validation functions
  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case "first_name":
        // Alphabets and spaces allowed, 2-50 characters
        if (!value) {
          errors.first_name = "First name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errors.first_name =
            "First name must contain only alphabets and spaces (no numbers or special characters)";
        } else if (value.trim().length < 2 || value.trim().length > 50) {
          errors.first_name = "First name must be between 2-50 characters";
        } else if (value.trim() !== value || /\s{2,}/.test(value)) {
          errors.first_name =
            "First name cannot have leading/trailing spaces or multiple consecutive spaces";
        }
        break;

      case "last_name":
        // Only alphabets, 2-50 characters
        if (!value) {
          errors.last_name = "Last name is required";
        } else if (!/^[A-Za-z]+$/.test(value)) {
          errors.last_name =
            "Last name must contain only alphabets (no spaces, numbers, or special characters)";
        } else if (value.length < 2 || value.length > 50) {
          errors.last_name = "Last name must be between 2-50 characters";
        }
        break;

      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Please enter a valid email address";
        }
        break;

      case "mobile":
        if (!value) {
          errors.mobile = "Mobile number is required";
        } else if (!/^[0-9]+$/.test(value)) {
          errors.mobile = "Mobile number must contain only digits";
        } else if (value.length !== 10) {
          errors.mobile = "Mobile number must be exactly 10 digits";
        }
        break;

      case "address":
        if (!value) {
          errors.address = "Address is required";
        } else if (value.length < 5 || value.length > 200) {
          errors.address = "Address must be between 5-200 characters";
        }
        break;

      case "joining_date":
        if (!value) {
          errors.joining_date = "Joining date is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);

          // Reset time to compare only dates
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);

          if (isNaN(selectedDate.getTime())) {
            errors.joining_date = "Please enter a valid date";
          } else if (selectedDate < today) {
            errors.joining_date = "Joining date cannot be in the past";
          } else if (selectedDate > thirtyDaysFromNow) {
            errors.joining_date =
              "Joining date cannot be more than 30 days in the future";
          }
        }
        break;
    }

    return errors;
  };

  const validateForm = (data: any) => {
    let allErrors: Record<string, string> = {};

    // Validate each field
    allErrors = {
      ...allErrors,
      ...validateField("first_name", data.first_name),
    };
    allErrors = { ...allErrors, ...validateField("last_name", data.last_name) };
    allErrors = { ...allErrors, ...validateField("email", data.email) };
    allErrors = { ...allErrors, ...validateField("mobile", data.mobile) };
    allErrors = { ...allErrors, ...validateField("address", data.address) };

    // Validate roles
    if (!data.roles || data.roles.length === 0) {
      allErrors.roles = "Please select at least one role";
    }

    // Validate joining date using field validation (skip in edit mode since it's disabled)
    if (!editMode) {
      allErrors = {
        ...allErrors,
        ...validateField("joining_date", data.joining_date),
      };
    }

    return allErrors;
  };

  const handleFieldChange = (field: string, value: string) => {
    // Auto-capitalize first name as user types
    let processedValue = value;
    if (field === "first_name") {
      // Capitalize first letter of each word in real-time
      processedValue = value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }

    // Mobile: allow only digits, max 10
    if (field === "mobile") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Update form data
    setFormData({ ...formData, [field]: processedValue });

    // Real-time validation
    const fieldErrors = validateField(field, processedValue);
    setValidationErrors((prev) => {
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
  const [newRole, setNewRole] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.log("🔍 Fetching roles from:", `${API_BASE_URL}/api/roles`);

      const response = await apiGet("roles");

      console.log("📡 Response status:", response.status, response.statusText);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;
      console.log("📊 COMPLETE API Response:", JSON.stringify(result, null, 2));
      console.log("📊 Response type:", typeof result);
      console.log("📊 Has success property:", "success" in result);
      console.log("📊 Has data property:", "data" in result);
      console.log("📊 Data is array:", Array.isArray(result.data));

      // Special handling for the actual API response structure
      if (result.data && Array.isArray(result.data)) {
        console.log("📊 Individual roles in response:");
        result.data.forEach((role: any, index: number) => {
          console.log(`📊 Role ${index}:`, {
            raw: role,
            type: typeof role,
            isString: typeof role === "string",
            isObject: typeof role === "object",
            keys: typeof role === "object" ? Object.keys(role) : "N/A",
            stringValue: typeof role === "string" ? role : "N/A",
          });
        });
      }

      // Try multiple possible response formats
      let rolesArray: any[] = [];

      if (result.success && Array.isArray(result.data)) {
        rolesArray = result.data;
      } else if (Array.isArray(result.data)) {
        rolesArray = result.data;
      } else if (Array.isArray(result)) {
        rolesArray = result;
      } else {
        console.log("❌ Unknown response format:", result);
      }

      console.log("📊 Extracted roles array:", rolesArray);

      if (rolesArray.length > 0) {
        // Handle different possible data formats
        const formatted: Role[] = rolesArray
          .filter((r: any) => {
            console.log("🔍 Checking role item:", r, "type:", typeof r);
            // Handle string roles or object roles
            return (
              r &&
              (typeof r === "string" ||
                (typeof r === "object" && (r.role_name || r.name)))
            );
          })
          .map((r: any, index: number) => {
            let roleData;
            if (typeof r === "string") {
              // If it's just a string (role name) - create a proper role object
              console.warn("⚠️ Role received as string:", r);

              // For string roles, we need to use the role name to find the actual ID
              // This is a temporary workaround - the API should return proper objects
              roleData = {
                id: index + 1, // Use index-based ID as fallback
                role_name: r,
              };
            } else if (r && typeof r === "object") {
              // Extract ID from object
              const extractedId = r.role_id || r.id;

              console.log(
                `🔍 ID extraction for role "${r.role_name || r.name}":`,
                {
                  raw_object: r,
                  role_id: r.role_id,
                  id: r.id,
                  extractedId: extractedId,
                  extractedType: typeof extractedId,
                },
              );

              roleData = {
                id: extractedId || index + 1, // Use database ID or fallback
                role_name: r.role_name || r.name || `Role_${index + 1}`,
              };
            } else {
              // Fallback for any other case
              roleData = {
                id: index + 1,
                role_name: `Role_${index + 1}`,
              };
            }

            console.log("🔄 Final mapped role:", {
              original: r,
              mapped: roleData,
              id_type: typeof roleData.id,
            });
            return roleData;
          });

        console.log("📊 Formatted roles for roleData:", formatted);
        setRoleData(formatted);

        const roleNames = formatted
          .map((r) => r.role_name)
          .filter((name) => name && name.trim());
        console.log("📊 Role names for dropdown:", roleNames);
        setRoles(roleNames);

        setLastUpdate(Date.now());
        console.log("✅ SUCCESS: Roles loaded successfully");
        console.log("✅ roleData has", formatted.length, "items");
        console.log("✅ roles has", roleNames.length, "items");
      } else {
        console.log("❌ No roles found in response");
        setRoleData([]);
        setRoles([]);
      }
    } catch (error) {
      console.error("💥 Error fetching roles:", error);
      setRoleData([]);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch Features
  const fetchFeatures = async () => {
    try {
      setIsLoadingFeatures(true);
      console.log("🔍 Fetching features from:", `${API_BASE_URL}/api/features`);

      const response = await apiGet("features");

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;
      console.log("📊 Features API Response:", result);

      let featuresArray: Feature[] = [];

      if (result.success && Array.isArray(result.data)) {
        featuresArray = result.data;
      } else if (Array.isArray(result.data)) {
        featuresArray = result.data;
      } else if (Array.isArray(result)) {
        featuresArray = result;
      }

      console.log("✅ Features loaded:", featuresArray.length);
      setFeatures(featuresArray);
    } catch (error) {
      console.error("💥 Error fetching features:", error);
      setFeatures([]);
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  // 🔹 Fetch Employees by Role ID
  const fetchEmployeesByRole = async (roleId: number | string) => {
    try {
      console.log("🔍 Fetching employees by role ID:", roleId);
      const response = await apiGet(`employees/role/${roleId}`);

      if (response.status !== 200 && response.status !== 201) {
        console.log("⚠️ Employees by role API failed:", response.status);
        return [];
      }

      const result = response.data;
      console.log("📊 Employees by role API response:", result);

      if (result.success && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result.data)) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("💥 Error fetching employees by role:", error);
      return [];
    }
  };

  // 🔹 Assign Multiple Roles to Employee
  const assignRolesToEmployee = async (
    employeeId: number | string,
    roleIds: number[],
  ) => {
    try {
      console.log("🔄 Assigning roles to employee:", { employeeId, roleIds });
      const response = await apiPost(`employees/${employeeId}/roles`, {
        roles: roleIds.map((roleId) => ({ role_id: roleId })),
      });

      console.log("📡 Assign roles response status:", response.status);

      if (response.status !== 200 && response.status !== 201) {
        console.error("❌ Assign roles failed:", response.data);
        throw new Error(
          response.data?.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = response.data;
      console.log("✅ Assign roles result:", result);

      if (result.success) {
        toast.success(result.message || "Roles assigned successfully");
        // Refresh employees to get updated role assignments
        await fetchEmployees();
        return result;
      } else {
        throw new Error(result.message || "Failed to assign roles");
      }
    } catch (error) {
      console.error("💥 Error assigning roles:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign roles",
      );
      return null;
    }
  };

  // 🔹 Fetch Employee Roles (separate API call)
  const fetchEmployeeRoles = async () => {
    try {
      console.log("🔍 Checking for employee roles API...");
      const response = await apiGet("employee-roles");

      if (response.status === 200 || response.status === 201) {
        const result = response.data;
        console.log("📊 Employee roles API response:", result);
        return result.data || result || [];
      } else {
        console.log(
          "⚠️ Employee roles API not available or failed:",
          response.status,
        );
        return [];
      }
    } catch (error) {
      console.log("⚠️ Employee roles API error:", error);
      return [];
    }
  };

  // 🔹 Fetch Employees
  const fetchEmployees = async () => {
    try {
      setIsLoadingEmployees(true);
      console.log(
        "🔍 Fetching employees from:",
        `${API_BASE_URL}/api/employees/`,
      );

      // Try to fetch employee roles first
      const employeeRoles = await fetchEmployeeRoles();
      console.log("📊 Employee roles from separate API:", employeeRoles);

      const response = await apiGet("employees/");

      console.log(
        "📡 Fetch employees response status:",
        response.status,
        response.statusText,
      );

      if (response.status !== 200 && response.status !== 201) {
        console.log("⚠️ Employees API not available, using empty array");
        setEmployees([]);
        return;
      }

      const result = response.data;
      console.log(
        "📊 COMPLETE EMPLOYEES API Response:",
        JSON.stringify(result, null, 2),
      );
      console.log("📊 Employees response type:", typeof result);
      console.log("📊 Has success property:", "success" in result);
      console.log("📊 Has data property:", "data" in result);
      console.log("📊 Data is array:", Array.isArray(result.data));

      // Check individual employee structure
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        console.log("📊 First employee structure:", result.data[0]);
        console.log("📊 Employee has roles field:", "roles" in result.data[0]);
        console.log("📊 Employee has role field:", "role" in result.data[0]);
        console.log(
          "📊 Available employee fields:",
          Object.keys(result.data[0]),
        );
      }

      // Try multiple possible response formats
      let employeesArray: any[] = [];

      if (result.success && Array.isArray(result.data)) {
        employeesArray = result.data;
      } else if (Array.isArray(result.data)) {
        employeesArray = result.data;
      } else if (Array.isArray(result)) {
        employeesArray = result;
      } else {
        console.log("❌ Unknown employees response format:", result);
      }

      console.log("📊 Extracted employees array:", employeesArray);
      console.log("📊 Number of employees found:", employeesArray.length);

      if (employeesArray.length > 0) {
        console.log("🔄 Processing employees...");
        // Process each employee to ensure consistent format
        const processedEmployees = employeesArray.map(
          (emp: any, index: number) => {
            console.log("� Processing employee:", emp);

            // Handle different possible employee data formats
            const processedEmp = {
              id: emp.id || emp.user_id || emp.employee_id || index + 1,
              first_name:
                emp.first_name ||
                emp.firstName ||
                emp.name?.split(" ")[0] ||
                "Unknown",
              last_name:
                emp.last_name ||
                emp.lastName ||
                emp.name?.split(" ").slice(1).join(" ") ||
                "",
              email: emp.email || emp.email_id || "",
              mobile: emp.mobile || emp.phone || emp.contact || "",
              address: emp.address || "",
              joining_date:
                emp.joining_date || emp.joinDate || emp.created_at || "",
              role: (() => {
                // Extract role information from nested roles array if present
                let employeeRole = "General Employee"; // Default role for employees without specific roles

                if (
                  emp.roles &&
                  Array.isArray(emp.roles) &&
                  emp.roles.length > 0
                ) {
                  console.log("🔍 Found roles array:", emp.roles);
                  // If roles is an array of objects with role_name
                  if (
                    typeof emp.roles[0] === "object" &&
                    emp.roles[0].role_name
                  ) {
                    employeeRole = emp.roles[0].role_name;
                    console.log(
                      "🎯 Extracted role from roles[0].role_name:",
                      employeeRole,
                    );
                  }
                  // If roles is an array of strings
                  else if (typeof emp.roles[0] === "string") {
                    employeeRole = emp.roles[0];
                    console.log(
                      "🎯 Extracted role from roles[0] string:",
                      employeeRole,
                    );
                  }
                } else if (emp.role) {
                  employeeRole = emp.role;
                  console.log("🎯 Extracted role from emp.role:", employeeRole);
                } else if (emp.role_name) {
                  employeeRole = emp.role_name;
                  console.log(
                    "🎯 Extracted role from emp.role_name:",
                    employeeRole,
                  );
                } else if (emp.designation) {
                  employeeRole = emp.designation;
                  console.log(
                    "🎯 Extracted role from emp.designation:",
                    employeeRole,
                  );
                } else {
                  // For employees without specific roles, assign them based on user_id or other patterns
                  console.log(
                    "⚠️ No role found for employee, using default:",
                    employeeRole,
                  );
                }

                console.log(
                  "🎯 Final employee role for",
                  emp.first_name,
                  ":",
                  employeeRole,
                );
                return employeeRole;
              })(),
              roles: emp.roles || [
                emp.role ||
                  emp.role_name ||
                  emp.designation ||
                  "General Employee",
              ],
              status: emp.status || "available",
              // Keep any additional fields
              ...emp,
            };

            console.log("🔄 Processed employee:", emp, "→", processedEmp);
            return processedEmp;
          },
        );

        console.log("📊 Final processed employees:", processedEmployees);
        setEmployees(processedEmployees);
        console.log("✅ SUCCESS: Employees loaded successfully");
        console.log("✅ employees has", processedEmployees.length, "items");

        // Log role distribution
        const roleDistribution = processedEmployees.reduce(
          (acc: any, emp: any) => {
            const role = emp.role || "Unknown";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
          },
          {},
        );
        console.log("📊 Employee role distribution:", roleDistribution);

        // Add unique employee roles to roles list if they don't exist
        const uniqueEmployeeRoles = [
          ...new Set(processedEmployees.map((emp: any) => emp.role)),
        ];
        console.log("📊 Unique roles from employees:", uniqueEmployeeRoles);

        // Update roles to include employee roles that might not be in the roles API
        setRoles((currentRoles) => {
          const combinedRoles = [
            ...new Set([...currentRoles, ...uniqueEmployeeRoles]),
          ].filter((role): role is string => {
            return typeof role === "string" && role.trim().length > 0;
          });
          console.log("📊 Combined roles (API + Employees):", combinedRoles);
          return combinedRoles;
        });
      } else {
        console.log("❌ No employees found in response");
        setEmployees([]);
      }
    } catch (error) {
      console.error("💥 Error fetching employees:", error);
      setEmployees([]);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address: "",
    joining_date: new Date().toISOString().split("T")[0], // Default to today's date
    roles: [] as string[],
    salary: "",
    feature_permissions: [] as FeaturePermission[],
  });

  // Fetch roles, employees, and features on component mount
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
    fetchFeatures();
  }, []);

  // Helper function to get employees by role
  const getEmployeesByRole = (role: string) => {
    let filtered = employees;

    // Role Filter
    if (role !== "All") {
      filtered = filtered.filter((emp) => {
        if (emp.role === role) return true;

        if (emp.roles && Array.isArray(emp.roles)) {
          return emp.roles.some((r: any) => {
            const roleString =
              typeof r === "object" ? r.role_name || r.name : r;
            return roleString === role;
          });
        }
        return false;
      });
    }

    // 🔍 Search Filter (name + mobile)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((emp) => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const mobile = (emp.mobile || "").toLowerCase();

        return (
          fullName.includes(q) ||
          emp.first_name?.toLowerCase().includes(q) ||
          emp.last_name?.toLowerCase().includes(q) ||
          mobile.includes(q)
        );
      });
    }

    return filtered;
  };

  // Helper function to get all unique roles from employees
  const getAllEmployeeRoles = () => {
    const roleSet = new Set<string>();

    employees.forEach((emp) => {
      // Add primary role
      if (emp.role) {
        roleSet.add(emp.role);
      }

      // Add roles from roles array
      if (emp.roles && Array.isArray(emp.roles)) {
        emp.roles.forEach((r: any) => {
          const roleString = typeof r === "object" ? r.role_name || r.name : r;
          if (roleString) {
            roleSet.add(roleString);
          }
        });
      }
    });

    return Array.from(roleSet).filter((role) => role && role.trim());
  };

  // Unified Employee Table Component with Pagination
  const EmployeeTable = ({
    employees: tableEmployees,
    title,
  }: {
    employees: any[];
    title: string;
  }) => {
    // Calculate pagination
    const totalPages = Math.ceil(tableEmployees.length / employeesPerPage);
    const startIndex = (currentPage - 1) * employeesPerPage;
    const endIndex = startIndex + employeesPerPage;
    const currentEmployees = tableEmployees.slice(startIndex, endIndex);

    // Debug pagination state
    console.log("📄 Pagination State:", {
      title,
      currentPage,
      totalPages,
      totalEmployees: tableEmployees.length,
      employeesPerPage,
      startIndex,
      endIndex,
      currentEmployeesCount: currentEmployees.length,
    });

    // Reset to first page only if current page is beyond available pages
    React.useEffect(() => {
      if (totalPages > 0 && currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [totalPages, currentPage]);

    const handlePageChange = (page: number) => {
      console.log("📄 Page number clicked:", page);
      setCurrentPage(page);
    };

    const handlePrevious = () => {
      console.log("📄 Previous button clicked:", {
        currentPage,
        canGoPrevious: currentPage > 1,
      });
      if (currentPage > 1) {
        const newPage = currentPage - 1;
        console.log("📄 Moving to page:", newPage);
        setCurrentPage(newPage);
      }
    };

    const handleNext = () => {
      console.log("📄 Next button clicked:", {
        currentPage,
        totalPages,
        canGoNext: currentPage < totalPages,
      });
      if (currentPage < totalPages) {
        const newPage = currentPage + 1;
        console.log("📄 Moving to page:", newPage);
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          {/* LEFT SIDE → Search Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 border-gray-400"
            />
          </div>

          {/* RIGHT SIDE → Filter by Role */}
          {title === "All Employees" && (
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-700">Filter by Role:</Label>
              <Select
                value={selectedRoleFilter}
                onValueChange={handleRoleFilterChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">
                    All Roles ({employees.length})
                  </SelectItem>

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
        <CardContent className="p-0 sm:p-6">
          {/* Desktop Table Layout */}
          <div className="hidden md:block">
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
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      <p>No employees found for the selected criteria.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>
                        {emp.first_name} {emp.last_name}
                      </TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.mobile}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          {Array.isArray(emp.roles)
                            ? getRoleNames(emp.roles)
                            : emp.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {emp.joining_date
                          ? new Date(emp.joining_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "N/A"}
                      </TableCell>
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
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3 p-4">
            {currentEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No employees found for the selected criteria.</p>
              </div>
            ) : (
              currentEmployees.map((emp) => (
                <Card key={emp.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            ID: {emp.id}
                          </p>
                          <p className="font-medium text-sm truncate">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {emp.email}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {Array.isArray(emp.roles)
                              ? getRoleNames(emp.roles)
                              : emp.role}
                          </Badge>
                          <div className="mt-1">
                            {getStatusBadge(emp.status)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t">
                        <div>
                          <p className="text-gray-500 mb-1">Mobile</p>
                          <p className="text-gray-900 font-medium">
                            {emp.mobile}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Joining Date</p>
                          <p className="text-gray-900 font-medium">
                            {emp.joining_date
                              ? new Date(emp.joining_date).toLocaleDateString(
                                  "en-GB",
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => handleView(emp, emp.role)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => handleEdit(emp, emp.role)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs text-red-600"
                          onClick={() => handleDelete(emp.id, emp.role)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Pagination Controls */}
          {tableEmployees.length > employeesPerPage && (
            <div className="hidden md:flex items-center justify-between mt-4 px-6 pb-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, tableEmployees.length)} of{" "}
                {tableEmployees.length} entries
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

          {/* Mobile Pagination Controls */}
          {tableEmployees.length > employeesPerPage && (
            <Card className="md:hidden mx-4 mb-4">
              <CardContent className="p-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-xs text-gray-600 text-center">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, tableEmployees.length)} of{" "}
                    {tableEmployees.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </Button>

                    <span className="text-sm font-medium px-3">
                      {currentPage} / {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
    console.log("📄 Roles Pagination State:", {
      currentRolePage,
      totalRolePages,
      totalRoles: roleData.length,
      rolesPerPage,
      startRoleIndex,
      endRoleIndex,
      currentRolesCount: currentRoles.length,
    });

    // Reset to first page only if current page is beyond available pages
    React.useEffect(() => {
      if (totalRolePages > 0 && currentRolePage > totalRolePages) {
        setCurrentRolePage(1);
      }
    }, [totalRolePages, currentRolePage]);

    const handleRolePageChange = (page: number) => {
      console.log("📄 Role page number clicked:", page);
      setCurrentRolePage(page);
    };

    const handleRolePrevious = () => {
      console.log("📄 Role previous button clicked:", {
        currentRolePage,
        canGoPrevious: currentRolePage > 1,
      });
      if (currentRolePage > 1) {
        const newPage = currentRolePage - 1;
        console.log("📄 Moving to role page:", newPage);
        setCurrentRolePage(newPage);
      }
    };

    const handleRoleNext = () => {
      console.log("📄 Role next button clicked:", {
        currentRolePage,
        totalRolePages,
        canGoNext: currentRolePage < totalRolePages,
      });
      if (currentRolePage < totalRolePages) {
        const newPage = currentRolePage + 1;
        console.log("📄 Moving to role page:", newPage);
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
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
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
                        {roleInfo.id || "N/A"}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {role}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-500">
                            {employeeCount} employee
                            {employeeCount !== 1 ? "s" : ""}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRole(roleInfo.id, role)}
                            disabled={
                              employeeCount > 0 || isDeletingRole === role
                            }
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
                Showing {startRoleIndex + 1} to{" "}
                {Math.min(endRoleIndex, roleData.length)} of {roleData.length}{" "}
                roles
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
    handleTabChange("all");
  }, []);

  // 🔹 Feature Permission Helpers
  const toggleFeature = (featureId: number, featureName: string) => {
    setFormData((prev) => {
      const exists = prev.feature_permissions.find(
        (fp) => fp.feature_id === featureId,
      );
      if (exists) {
        // Remove the feature
        return {
          ...prev,
          feature_permissions: prev.feature_permissions.filter(
            (fp) => fp.feature_id !== featureId,
          ),
        };
      } else {
        // Add the feature with all permissions false by default
        return {
          ...prev,
          feature_permissions: [
            ...prev.feature_permissions,
            {
              feature_id: featureId,
              feature_name: featureName,
              read: false,
              write: false,
              edit: false,
              delete: false,
            },
          ],
        };
      }
    });
  };

  const togglePermission = (
    featureId: number,
    permission: "read" | "write" | "edit" | "delete",
  ) => {
    setFormData((prev) => ({
      ...prev,
      feature_permissions: prev.feature_permissions.map((fp) =>
        fp.feature_id === featureId
          ? { ...fp, [permission]: !fp[permission] }
          : fp,
      ),
    }));
  };

  const toggleAllPermissions = (featureId: number) => {
    setFormData((prev) => {
      const fp = prev.feature_permissions.find(
        (f) => f.feature_id === featureId,
      );
      if (!fp) return prev;
      const allChecked = fp.read && fp.write && fp.edit && fp.delete;
      return {
        ...prev,
        feature_permissions: prev.feature_permissions.map((f) =>
          f.feature_id === featureId
            ? {
                ...f,
                read: !allChecked,
                write: !allChecked,
                edit: !allChecked,
                delete: !allChecked,
              }
            : f,
        ),
      };
    });
  };

  const selectAllFeatures = () => {
    setFormData((prev) => {
      const allSelected = features.every((f) =>
        prev.feature_permissions.some((fp) => fp.feature_id === f.id),
      );
      if (allSelected) {
        return { ...prev, feature_permissions: [] };
      } else {
        const newPermissions = features.map((f) => {
          const existing = prev.feature_permissions.find(
            (fp) => fp.feature_id === f.id,
          );
          return (
            existing || {
              feature_id: f.id,
              feature_name: f.feature_name,
              read: false,
              write: false,
              edit: false,
              delete: false,
            }
          );
        });
        return { ...prev, feature_permissions: newPermissions };
      }
    });
  };

  const handleAdd = async () => {
    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    // Process first name - if it contains spaces, split it properly
    let processedFirstName = formData.first_name.trim();
    let processedLastName = formData.last_name.trim();

    // If first name contains spaces and last name is empty, split the first name
    if (processedFirstName.includes(" ") && !processedLastName) {
      const nameParts = processedFirstName.split(/\s+/);
      processedFirstName = nameParts[0]; // First part becomes first name (already capitalized from input)
      processedLastName = nameParts.slice(1).join(" "); // Rest becomes last name
    }
    // If first name contains spaces but last name is also provided, keep first name as is
    // If no spaces in first name, keep as is (already capitalized from input)

    setIsSubmitting(true);
    try {
      if (editMode && editingId) {
        // Update existing employee via API
        const response = await apiPut(`employees/${editingId}`, {
          first_name: processedFirstName,
          last_name: processedLastName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          roles: formData.roles,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          feature_permissions: formData.feature_permissions,
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = response.data;

        if (result.success) {
          // Update local state
          setEmployees(
            employees.map((emp) =>
              emp.id === editingId
                ? {
                    ...emp,
                    first_name: processedFirstName,
                    last_name: processedLastName,
                    email: formData.email,
                    mobile: formData.mobile,
                    address: formData.address,
                    roles: formData.roles,
                    joining_date: formData.joining_date,
                    salary: formData.salary,
                    feature_permissions: formData.feature_permissions,
                  }
                : emp,
            ),
          );
          toast.success("Employee updated successfully");
        } else {
          toast.error(result.message || "Failed to update employee");
        }
      } else {
        // Add new employee via API
        console.log("🚀 Creating employee with data:", {
          first_name: processedFirstName,
          last_name: processedLastName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          joining_date: formData.joining_date,
          roles: formData.roles,
          salary: formData.salary,
          feature_permissions: formData.feature_permissions,
        });


        const response = await apiPost("employees", {
          first_name: processedFirstName,
          last_name: processedLastName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          joining_date: formData.joining_date,
          roles: formData.roles,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          feature_permissions: formData.feature_permissions,
        });

        console.log("📡 Employee creation response status:", response.status);

        if (response.status !== 200 && response.status !== 201) {
          const errorData = response.data;
          console.log("❌ Employee creation failed:", errorData);
          toast.error(
            errorData?.errors ||
              "Failed to create employee. Please check your input.",
          );

          try {
            const parsedError = JSON.parse(errorData);
            if (parsedError.errors && Array.isArray(parsedError.errors)) {
              // Handle validation errors from backend
              toast.error(`Validation Error: ${parsedError.errors.join(", ")}`);
            } else if (parsedError.message) {
              toast.error(`Error: ${parsedError.message}`);
            } else {
              toast.error(
                "Failed to create employee. Please check your input.",
              );
            }
          } catch {
            toast.error("Failed to create employee. Please check your input.");
          }
          return;
        }

        const result = response.data;
        console.log("📊 Employee creation result:", result);

        if (result.success) {
          // Refresh employees list to get the new employee with proper ID
          await fetchEmployees();
          toast.success(result.message || "Employee created successfully");
        } else {
          toast.error(result.message || "Failed to add employee");
        }
      }

      setDialogOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        address: "",
        roles: [],
        joining_date: new Date().toISOString().split("T")[0],
        salary: "",
        feature_permissions: [],
      });
      setValidationErrors({});
      setEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee: any, role: string) => {
    console.log("🔧 Edit button clicked for employee:", employee);

    try {
      // Convert joining_date to YYYY-MM-DD in local timezone
      let isoDate = "";
      if (employee.joining_date) {
        const d = new Date(employee.joining_date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        isoDate = `${year}-${month}-${day}`;
      }

      const safeEmployee = {
        first_name: employee.first_name ?? "",
        last_name: employee.last_name ?? "",
        email: employee.email ?? "",
        mobile: employee.mobile ?? "",
        address: employee.address ?? "",
        joining_date: isoDate, // ✅ FIX APPLIED HERE
        roles: Array.isArray(employee.roles)
          ? employee.roles.map((r: any) =>
              typeof r === "object" ? r.role_name || r.name : r,
            )
          : [role],
        salary: employee.salary != null ? String(employee.salary) : "",
        feature_permissions: Array.isArray(employee.feature_permissions)
          ? employee.feature_permissions.map((fp: any) => ({
              feature_id: Number(fp.feature_id),
              feature_name: fp.feature_name ?? "",
              read: Boolean(fp.read),
              write: Boolean(fp.write),
              edit: Boolean(fp.edit),
              delete: Boolean(fp.delete),
            }))
          : [],
      };

      console.log("🔧 Safe employee data for form:", safeEmployee);
      setFormData(safeEmployee);
      setEditingId(employee.id ?? null);
      setEditMode(true);
      setDialogOpen(true);
    } catch (error) {
      console.error("💥 Error in handleEdit:", error);
      toast.error("Error opening edit dialog");
    }
  };

  const handleDelete = (id: string, role: string) => {
    // Find the employee to get their name for the confirmation dialog
    const employee = employees.find((emp) => emp.id === id);
    const employeeName = employee
      ? `${employee.first_name} ${employee.last_name}`
      : "Unknown Employee";

    // Set employee data for confirmation dialog
    setEmployeeToDelete({ id, name: employeeName, role });
    setDeleteConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await apiDelete(`employees/${employeeToDelete.id}`);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;

      if (result.success) {
        // Remove from local state
        setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
        toast.success("Employee removed successfully");
      } else {
        toast.error(result.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee. Please try again.");
    } finally {
      // Close confirmation dialog and reset state
      setDeleteConfirmDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDialogChange = (open: boolean) => {
    console.log("🔄 Dialog state changing to:", open);

    try {
      setDialogOpen(open);
      if (!open) {
        console.log("🧹 Cleaning up dialog state");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile: "",
          address: "",
          roles: [],
          joining_date: new Date().toISOString().split("T")[0],
          salary: "",
          feature_permissions: [],
        });
        setValidationErrors({});
        setEditMode(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error("💥 Error in handleDialogChange:", error);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.trim()) {
      toast.error("Please enter a role name");
      return;
    }

    // Capitalize first letter of each word
    const capitalizedRole = newRole
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    console.log("🔄 Creating role:", {
      originalRole: newRole,
      capitalizedRole,
    });

    if (roles.includes(capitalizedRole)) {
      toast.error("Role already exists");
      return;
    }

    if (!API_BASE_URL) {
      toast.error("API configuration error: Base URL not found");
      return;
    }

    setIsCreatingRole(true);

    try {
      const createRoleUrl = `roles`;
      const requestBody = { role_name: capitalizedRole };

      console.log("🚀 Creating role with:", {
        url: createRoleUrl,
        body: requestBody,
        headers: { "Content-Type": "application/json" },
      });

      const response = await apiPost(createRoleUrl, requestBody);

      console.log("📡 Create role response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.status === 200 || response.status === 201,
      });

      if (response.status !== 200 && response.status !== 201) {
        const errorText = response.data?.message || response.data?.error || "Unknown error";
        console.error("❌ Create role failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: createRoleUrl,
        });

        // Provide specific error messages based on status
        if (response.status === 404) {
          const port = API_BASE_URL.includes(":")
            ? API_BASE_URL.split(":").pop()
            : "unknown";
          throw new Error(
            `API endpoint not found: ${createRoleUrl}. Check if your backend server is running on port ${port}`,
          );
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorText}`);
        } else if (response.status === 0 || !response.status) {
          throw new Error(
            `Cannot connect to server at ${API_BASE_URL}. Please check if your backend server is running.`,
          );
        } else {
          throw new Error(
            `HTTP ${response.status}: ${errorText || response.statusText}`,
          );
        }
      }

      const result = response.data;
      console.log("📊 Create role result:", result);

      // Handle different possible response formats
      if (
        result.success ||
        result.message ||
        result.role_id ||
        result.id ||
        response.status === 201
      ) {
        console.log("✅ Role creation successful, API returned:", {
          success: result.success,
          role_id: result.role_id,
          id: result.id,
          message: result.message,
          full_response: result,
        });

        // Refresh the roles list to get the new role with its ID
        console.log("🔄 Refreshing roles after creation...");
        await fetchRoles();
        console.log(
          "✅ Role creation completed, roleData should be updated now",
        );

        const successMessage =
          result.message || `Role "${capitalizedRole}" created successfully`;
        toast.success(successMessage);
        setNewRole("");
        setRoleDialogOpen(false);

        // Switch to roles tab to show the newly created role
        handleTabChange("roles");
      } else {
        console.error("❌ Create role API returned unexpected format:", result);
        toast.error(
          result.error ||
            result.message ||
            "Role creation failed - unexpected response format",
        );
      }
    } catch (error) {
      console.error("💥 Error creating role:", error);

      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String((error as any).message);
      }

      // Show user-friendly error message
      if (errorMessage.includes("fetch")) {
        toast.error(
          "Network error: Cannot connect to server. Please check if your backend is running.",
        );
      } else if (errorMessage.includes("404")) {
        toast.error(
          "API endpoint not found. Please check your backend server.",
        );
      } else if (errorMessage.includes("500")) {
        toast.error("Server error occurred. Please try again.");
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
      setNewRole("");
    }
  };

  // 🔹 Delete Role
  const handleDeleteRole = async (
    roleId: number | string,
    roleName: string,
  ) => {
    console.log("🗑️ Delete role called with:", {
      roleId,
      roleName,
      type: typeof roleId,
    });

    // Check if any employees have this role
    const hasEmployees =
      employees.filter((emp) => emp.role === roleName).length > 0;

    if (hasEmployees) {
      toast.error("Cannot delete role that is assigned to employees");
      return;
    }

    setIsDeletingRole(roleName);

    try {
      // Since your API returns role names as strings, try multiple delete approaches
      console.log("🗑️ Attempting to delete role:", {
        roleId,
        roleName,
        roleIdType: typeof roleId,
      });

      // Try DELETE with role name in URL (most common pattern)
      const deleteUrl = `roles/${encodeURIComponent(roleName)}`;
      console.log("🔄 Attempting DELETE with role name in URL:", deleteUrl);

      const response = await apiDelete(deleteUrl);

      console.log(
        "📡 Delete response:",
        response.status,
        response.statusText,
      );

      if (response.status !== 200 && response.status !== 201) {
        const errorMessage =
          response.data?.message || response.data?.error || `Failed to delete role: ${roleName}`;
        throw new Error(errorMessage);
      }

      toast.success(`Role "${roleName}" deleted successfully`);

      // Refresh roles list
      await fetchRoles();

      // Remove employees with this role from local state
      setEmployees(employees.filter((emp) => emp.role !== roleName));
    } catch (error) {
      console.error("💥 Error deleting role:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete role: ${errorMessage}`);
    } finally {
      setIsDeletingRole(null);
    }
  };

  const handleView = (employee: any, role: string) => {
    // Ensure we always keep roles array from backend (objects) if present
    const rolesArray =
      Array.isArray(employee.roles) && employee.roles.length > 0
        ? employee.roles
        : role
          ? [{ role_name: role }]
          : [];

    setSelectedEmployee({
      ...employee,
      role,
      roles: rolesArray,
    });
    setDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      available: { label: "Available", color: "bg-green-100 text-green-700" },
      "on-job": { label: "On Job", color: "bg-blue-100 text-blue-700" },
      busy: { label: "Busy", color: "bg-orange-100 text-orange-700" },
      Active: { label: "Active", color: "bg-green-100 text-green-700" },
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
    console.log("🔍 Viewing employee details:", selectedEmployee);

    try {
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-gray-900 mb-2">
                {selectedEmployee.role === "Sales Person"
                  ? "Assigned Enquiries"
                  : "Assigned Jobs"}
              </h1>
              <p className="text-gray-600">
                {selectedEmployee.role === "Sales Person"
                  ? "Manage assigned customer enquiries"
                  : "Manage assigned field jobs"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">
                {`${selectedEmployee.first_name || ""} ${selectedEmployee.last_name || ""}`.trim() ||
                  "Unknown Employee"}
              </p>
              <p className="text-sm text-gray-600">
                {selectedEmployee.email || "No email"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  console.log("🔙 Going back to employee list");
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
            {selectedEmployee.role === "Sales Person" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      Enquiry management for {selectedEmployee.first_name}{" "}
                      {selectedEmployee.last_name}
                    </p>
                    <p className="text-sm mt-2">
                      This feature is under development
                    </p>
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
                    <p>
                      Job management for {selectedEmployee.first_name}{" "}
                      {selectedEmployee.last_name}
                    </p>
                    <p className="text-sm mt-2">
                      This feature is under development
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("💥 Error rendering employee details:", error);
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-red-600 mb-4">Error loading employee details</p>
          <Button
            onClick={() => {
              setViewingDetails(false);
              setSelectedEmployee(null);
            }}
          >
            ← Back to Employees
          </Button>
        </div>
      );
    }
  }

  // Debug: Check roleData before rendering
  console.log(
    "🎯 Component render - roleData:",
    roleData,
    "length:",
    roleData.length,
  );
  console.log("🎯 Component render - roles:", roles, "length:", roles.length);
  console.log("🎯 Component render - lastUpdate:", lastUpdate);
  console.log(
    "🎯 Component render - roleData items:",
    roleData.map((r) => ({ id: r.id, name: r.role_name })),
  );

  return (
    <div
      key={`employees-page-${roleData.length}-${lastUpdate}`}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your employees
          </p>
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
                  <Label className="text-sm font-medium">
                    Enter Role Name <span style={{ color: "#FF0000" }}>*</span>
                  </Label>
                  <Input
                    value={newRole}
                    onChange={(e) => {
                      setNewRole(e.target.value);
                      if (!e.target.value.trim()) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          newRole: "This field is required.",
                        }));
                      } else {
                        setValidationErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.newRole;
                          return updated;
                        });
                      }
                    }}
                    onBlur={(e) => {
                      if (!e.target.value.trim()) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          newRole: "This field is required.",
                        }));
                      } else {
                        setValidationErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.newRole;
                          return updated;
                        });
                      }
                    }}
                    placeholder="e.g., HR Manager"
                    className={`mt-1 ${validationErrors.newRole ? "border-[#FF0000]" : ""}`}
                  />
                  {validationErrors.newRole && (
                    <p
                      style={{ color: "#FF0000", fontSize: 12 }}
                      className="mt-1"
                    >
                      {validationErrors.newRole}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setRoleDialogOpen(false)}
                    className="flex-1"
                    disabled={isCreatingRole}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRole}
                    className="flex-1"
                    disabled={
                      isCreatingRole ||
                      !newRole.trim() ||
                      !!validationErrors.newRole
                    }
                  >
                    {isCreatingRole ? "Creating..." : "Create Role"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create New Employee Button */}
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditMode(false);
                  setEditingId(null);
                  setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    mobile: "",
                    address: "",
                    joining_date: new Date().toISOString().split("T")[0],
                    roles: [],
                    salary: "",
                    feature_permissions: [],
                  });
                  setValidationErrors({});
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Employee
              </Button>
            </DialogTrigger>

            <DialogContent
              style={{
                width: "650px",
                maxWidth: "95vw",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "0 auto",
              }}
            >
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Edit Employee" : "Add Employee"}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block text-black">
                      First Name <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) =>
                        handleFieldChange("first_name", e.target.value)
                      }
                      required
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter first name"
                    />
                    {validationErrors.first_name && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.first_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-black">
                      Last Name <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) =>
                        handleFieldChange("last_name", e.target.value)
                      }
                      required
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter last name"
                    />
                    {validationErrors.last_name && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.last_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-black">
                      Email <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      required
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter email address"
                    />
                    {validationErrors.email && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-black">
                      Mobile <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      value={formData.mobile}
                      onChange={(e) =>
                        handleFieldChange("mobile", e.target.value)
                      }
                      required
                      inputMode="numeric"
                      maxLength={10}
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter 10 digit mobile number"
                    />
                    {validationErrors.mobile && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.mobile}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label className="mb-2 block text-black">
                      Address <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        handleFieldChange("address", e.target.value)
                      }
                      required
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter address"
                    />
                    {validationErrors.address && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.address}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-black">
                      Joining Date <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) =>
                        handleFieldChange("joining_date", e.target.value)
                      }
                      required
                      disabled={editMode}
                      className={`mb-1 border-black ring-0 text-black ${editMode ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}`}
                      placeholder="Select joining date"
                    />
                    {validationErrors.joining_date && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.joining_date}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="mb-2 block text-black">
                      Roles <span style={{ color: "#FF0000" }}>*</span>
                    </Label>
                    <Select
                      value={formData.roles[0] ?? ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, roles: [value] })
                      }
                    >
                      <SelectTrigger className="border-black ring-0 text-black">
                        <SelectValue
                          placeholder="Select role"
                          className="text-black"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {roles
                          .filter((role) => role.toLowerCase() !== "superadmin" && role.toLowerCase() !== "super admin")
                          .map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="text-black"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.roles && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.roles}
                      </div>
                    )}
                  </div>

                  {/* Salary Field */}
                  <div>
                    <Label className="mb-2 block text-black">Annual Salary </Label>
                    <Input
                      type="number"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className="mb-1 border-black ring-0 text-black"
                      placeholder="Enter monthly salary"
                      min="0"
                      step="0.01"
                    />
                    {validationErrors.salary && (
                      <div
                        style={{ color: "#FF0000" }}
                        className="text-xs mt-1"
                      >
                        {validationErrors.salary}
                      </div>
                    )}
                  </div>
                </div>

                {/* Feature Permissions Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-black font-semibold text-base">
                      Feature Permissions
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllFeatures}
                      className="text-xs"
                    >
                      {features.length > 0 &&
                      features.every((f) =>
                        formData.feature_permissions.some(
                          (fp) => fp.feature_id === f.id,
                        ),
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  {isLoadingFeatures ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Loading features...
                    </div>
                  ) : features.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No features available.
                    </div>
                  ) : (
                    <div className="border rounded-lg max-h-80 overflow-y-auto">
                      {features.map((feature, idx) => {
                        const isSelected = formData.feature_permissions.some(
                          (fp) => fp.feature_id === feature.id,
                        );
                        const fp = formData.feature_permissions.find(
                          (fp) => fp.feature_id === feature.id,
                        );

                        return (
                          <div
                            key={feature.id}
                            className={`px-4 py-3 ${
                              idx !== features.length - 1 ? "border-b border-gray-200" : ""
                            } transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                          >
                            {/* Row 1: Feature checkbox + name */}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  toggleFeature(
                                    feature.id,
                                    feature.feature_name,
                                  )
                                }
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {feature.feature_name.replace(/_/g, " ")}
                              </span>
                            </div>

                            {/* Row 2: Permission checkboxes - on a new line below */}
                            {isSelected && (
                              <div className="flex items-center gap-6 mt-2 ml-6">
                                {(
                                  ["read", "write", "edit", "delete"] as const
                                ).map((perm) => (
                                  <label
                                    key={perm}
                                    className="flex items-center gap-1.5 cursor-pointer select-none"
                                  >
                                    <Checkbox
                                      checked={fp ? fp[perm] : false}
                                      onCheckedChange={() =>
                                        togglePermission(feature.id, perm)
                                      }
                                    />
                                    <span className="text-sm text-gray-600 capitalize">
                                      {perm}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Summary */}
                  {formData.feature_permissions.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {formData.feature_permissions.length} feature(s) selected
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editMode ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editMode ? "Update Employee" : "Add Employee"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {/* Role Selection Dropdown and Manage Roles Button */}
        <div className="flex items-center gap-4">
          {/* Manage Roles Button (commented out) */}
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
          {activeTab === "all" ? (
            <EmployeeTable
              employees={getEmployeesByRole(selectedRoleFilter)}
              title="All Employees"
            />
          ) : activeTab === "roles" ? (
            <RolesTable />
          ) : (
            // Show employees for specific role
            (() => {
              const selectedRole = getAllEmployeeRoles().find(
                (role) => role.toLowerCase().replace(/\s+/g, "-") === activeTab,
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
                      <p>
                        Role not found or no employees assigned to this role.
                      </p>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-lg text-gray-900">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedEmployee.email}
                </span>
                <span className="text-sm text-gray-600">
                  Mobile: {selectedEmployee.mobile}
                </span>
                <span className="text-sm text-gray-600">
                  Role:{" "}
                  {Array.isArray(selectedEmployee.roles)
                    ? getRoleNames(selectedEmployee.roles)
                    : selectedEmployee.role}
                </span>
                <span className="text-sm text-gray-600">
                  Joining Date:{" "}
                  {selectedEmployee.joining_date
                    ? new Date(
                        selectedEmployee.joining_date,
                      ).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
                <span className="text-sm text-gray-600">
                  Status: {selectedEmployee.status}
                </span>
                <span className="text-sm text-gray-600">
                  Address: {selectedEmployee.address}
                </span>
                <span className="text-sm text-gray-600">
                  Salary:{" "}
                  {selectedEmployee.salary
                    ? `₹${Number(selectedEmployee.salary).toLocaleString("en-IN")}`
                    : "N/A"}
                </span>
              </div>

              {/* Feature Permissions in Details */}
              {selectedEmployee.feature_permissions &&
                Array.isArray(selectedEmployee.feature_permissions) &&
                selectedEmployee.feature_permissions.length > 0 && (
                  <div className="mt-3">
                    <span className="font-semibold text-sm text-gray-900">
                      Feature Permissions:
                    </span>
                    <div className="border rounded-lg mt-2 max-h-60 overflow-y-auto">
                      {selectedEmployee.feature_permissions.map(
                        (fp: any, idx: number) => (
                          <div
                            key={fp.feature_id}
                            className={`px-4 py-3 ${
                              idx !==
                              selectedEmployee.feature_permissions.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            {/* Feature name */}
                            <span className="text-sm font-medium text-gray-900">
                              {(fp.feature_name || "").replace(/_/g, " ")}
                            </span>
                            {/* Permissions on next line */}
                            <div className="flex items-center gap-6 mt-1.5 ml-1">
                              {(
                                ["read", "write", "edit", "delete"] as const
                              ).map((perm) => (
                                <span
                                  key={perm}
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  <span>{fp[perm] ? "✅" : "❌"}</span>
                                  <span className="text-gray-600 capitalize">
                                    {perm}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No employee selected.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              employee from the system.
            </DialogDescription>
          </DialogHeader>
          {employeeToDelete && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">
                  Employee to be deleted:
                </p>
                <p className="font-semibold text-gray-900">
                  {employeeToDelete.name}
                </p>
                <p className="text-sm text-gray-600">
                  Role: {employeeToDelete.role}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {employeeToDelete.id}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Employee
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
