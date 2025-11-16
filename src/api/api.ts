// Create a new feature via API
export async function createFeature(featureName: string, token?: string) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/api/features`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ feature_name: featureName }),
  });
  return response.json();
}
// src/api/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import { toast } from 'sonner';

// API Response interface
export interface ApiResponse<T = any> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

// User types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role: string;
  status?: string;
  joining_date?: string;
  address?: string;
}

// Employee types
export interface Employee extends User {
  roles?: string[];
  assignedTasks?: number;
  pendingTasks?: number;
}

// Auth types
export interface LoginRequest {
  mobile: string;
  otp: string;
}

export interface OTPRequest {
  mobile: string;
}

export interface AuthResponse {
  employee: any;
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Lead/Contact types
export interface Lead {
  id?: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  service_type: string;
  solar_service: string; // Add solar_service as required by API
  capacity: string;
  message: string;
  location: string;
  property_type: string; // Changed from home_type to property_type to match API
}

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  reason: string;
  message: string;
  created_at?: string;
}

// Role types
export interface Role {
  id: string;
  role_name: string;
  description?: string;
  permissions?: string[];
}

// Get base URL from environment or fallback to default
const getBaseURL = (): string => {
  // Try Vite environment variables first
  try {
    if (import.meta?.env?.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
  } catch (error) {
    // import.meta might not be available in all environments
  }
  
  // Try traditional environment variables (for Create React App)
  if (typeof process !== 'undefined' && process.env) {
    const envBaseURL = process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL;
    if (envBaseURL) return envBaseURL;
  }
  
  // Fallback to current configuration
  return 'http://172.16.4.28:3300';
};

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    console.log(`✅ API Response: ${response.status}`, {
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized access - clearing auth data');
      localStorage.removeItem('authToken');
      localStorage.removeItem('employeeData');
      localStorage.removeItem('auth');
      
      // Show error message
      toast.error('Session expired. Please login again.');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Generic API call wrapper
const makeRequest = async <T = any>(
  requestFn: () => Promise<AxiosResponse<T>>,
  successMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    
    // Show success message if provided
    if (successMessage) {
      toast.success(successMessage);
    }
    
    return {
      ok: true,
      data: response.data,
      error: null,
    };
  } catch (error: any) {
    console.error('💥 API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Don't show toast for 401 errors (handled in interceptor)
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
    
    return {
      ok: false,
      data: null,
      error: errorMessage,
    };
  }
};

// Cancellation support
export const createCancelToken = () => axios.CancelToken.source();

// ===========================================
// AUTHENTICATION ENDPOINTS
// ===========================================

export const requestOTP = async (
  data: OTPRequest,
  cancelToken?: CancelToken
): Promise<ApiResponse<AuthResponse>> => {
  return makeRequest(
    () => api.post<AuthResponse>('/api/auth/request-otp', data, { cancelToken }),
    'OTP sent successfully!'
  );
};

export const verifyOTP = async (
  data: LoginRequest,
  cancelToken?: CancelToken
): Promise<ApiResponse<AuthResponse>> => {
  return makeRequest(
    () => api.post<AuthResponse>('/api/auth/verify-otp', data, { cancelToken }),
    'Login successful!'
  );
};

export const logout = async (): Promise<ApiResponse> => {
  // Clear local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('employeeData');
  localStorage.removeItem('auth');
  
  return {
    ok: true,
    data: { message: 'Logged out successfully' },
    error: null,
  };
};

// ===========================================
// USER/EMPLOYEE ENDPOINTS
// ===========================================

export const getUsers = async (
  cancelToken?: CancelToken
): Promise<ApiResponse<User[]>> => {
  return makeRequest(() => api.get<User[]>('/api/employees', { cancelToken }));
};

export const apiCurrentUserData = async (
  cancelToken?: CancelToken
): Promise<ApiResponse<User[]>> => {
  http://localhost:3200/api/auth/my-profile
  return makeRequest(() => api.get<User[]>('/api/auth/my-profile', { cancelToken }));
};

export const getUsersByRole = async (
  roleId: string,
  cancelToken?: CancelToken
): Promise<ApiResponse<Employee[]>> => {
  return makeRequest(() => 
    api.get<Employee[]>(`/api/employees/role/${roleId}`, { cancelToken })
  );
};

export const createUser = async (
  data: Partial<User>,
  cancelToken?: CancelToken
): Promise<ApiResponse<User>> => {
  return makeRequest(
    () => api.post<User>('/api/employees', data, { cancelToken }),
    'User created successfully!'
  );
};

export const updateUser = async (
  id: string,
  data: Partial<User>,
  cancelToken?: CancelToken
): Promise<ApiResponse<User>> => {
  return makeRequest(
    () => api.put<User>(`/api/employees/${id}`, data, { cancelToken }),
    'User updated successfully!'
  );
};

export const deleteUser = async (
  id: string,
  cancelToken?: CancelToken
): Promise<ApiResponse> => {
  return makeRequest(
    () => api.delete(`/api/employees/${id}`, { cancelToken }),
    'User deleted successfully!'
  );
};

export const assignUserRole = async (
  userId: string,
  roleData: { role_name: string },
  cancelToken?: CancelToken
): Promise<ApiResponse> => {
  return makeRequest(
    () => api.post(`/api/employees/${userId}/roles`, roleData, { cancelToken }),
    'Role assigned successfully!'
  );
};

// ===========================================
// ROLE ENDPOINTS
// ===========================================

export const getRoles = async (
  cancelToken?: CancelToken
): Promise<ApiResponse<string[]>> => {
  return makeRequest(() => api.get<string[]>('/api/roles', { cancelToken }));
};

export const createRole = async (
  data: { role_name: string; description?: string },
  cancelToken?: CancelToken
): Promise<ApiResponse<Role>> => {
  return makeRequest(
    () => api.post<Role>('/api/roles', data, { cancelToken }),
    'Role created successfully!'
  );
};

export const updateRole = async (
  roleId: string,
  data: Partial<Role>,
  cancelToken?: CancelToken
): Promise<ApiResponse<Role>> => {
  return makeRequest(
    () => api.put<Role>(`/api/roles/${roleId}`, data, { cancelToken }),
    'Role updated successfully!'
  );
};

export const deleteRole = async (
  roleName: string,
  cancelToken?: CancelToken
): Promise<ApiResponse> => {
  return makeRequest(
    () => api.delete(`/api/roles/${encodeURIComponent(roleName)}`, { cancelToken }),
    'Role deleted successfully!'
  );
};

// ===========================================
// LEAD/CONTACT ENDPOINTS
// ===========================================

export const createLead = async (
  data: Lead,
  cancelToken?: CancelToken
): Promise<ApiResponse<Lead>> => {
  return makeRequest(
    () => api.post<Lead>('/api/leads', data, { cancelToken }),
    'Lead created successfully!'
  );
};

export const getContacts = async (
  cancelToken?: CancelToken
): Promise<ApiResponse<Contact[]>> => {
  return makeRequest(() => api.get<Contact[]>('/api/contacts', { cancelToken }));
};

export const deleteContact = async (
  id: string,
  cancelToken?: CancelToken
): Promise<ApiResponse> => {
  return makeRequest(
    () => api.delete(`/api/contacts/delete/${id}`, { cancelToken }),
    'Contact deleted successfully!'
  );
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export const checkApiHealth = async (): Promise<ApiResponse> => {
  return makeRequest(() => api.get('/api/health'));
};

export const uploadFile = async (
  file: File,
  endpoint: string = '/api/upload',
  cancelToken?: CancelToken
): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return makeRequest(() => 
    api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      cancelToken,
    })
  );
};

// ===========================================
// EXPORT API INSTANCE FOR CUSTOM CALLS
// ===========================================

export { api as axiosInstance };
export default api;

// ===========================================
// USAGE EXAMPLES FOR REACT COMPONENTS
// ===========================================

/*
// Example 1: Login Component
import { requestOTP, verifyOTP, createCancelToken } from '../api/api';

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (mobile: string, otp: string) => {
    setLoading(true);
    const cancelToken = createCancelToken();
    
    try {
      // Step 1: Request OTP
      const otpResult = await requestOTP({ mobile }, cancelToken.token);
      if (!otpResult.ok) return;
      
      // Step 2: Verify OTP
      const loginResult = await verifyOTP({ mobile, otp }, cancelToken.token);
      if (loginResult.ok) {
        // Handle success - token is automatically stored
        console.log('Login successful:', loginResult.data);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Component cleanup
  useEffect(() => {
    const cancelToken = createCancelToken();
    return () => cancelToken.cancel('Component unmounted');
  }, []);
};

// Example 2: Users List Component
import { getUsers, deleteUser } from '../api/api';

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async () => {
    setLoading(true);
    const result = await getUsers();
    
    if (result.ok) {
      setUsers(result.data || []);
    }
    setLoading(false);
  };
  
  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.ok) {
      // Refresh users list
      fetchUsers();
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
};

// Example 3: Create User Component  
import { createUser } from '../api/api';

const CreateUserComponent = () => {
  const handleSubmit = async (formData: any) => {
    const result = await createUser({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
    });
    
    if (result.ok) {
      console.log('User created:', result.data);
      // Handle success (form reset, navigation, etc.)
    }
    // Error handling is automatic via toast
  };
};

// Example 4: Custom API call using axios instance
import { axiosInstance } from '../api/api';

const customApiCall = async () => {
  try {
    const response = await axiosInstance.get('/api/custom-endpoint');
    console.log('Custom API response:', response.data);
  } catch (error) {
    console.error('Custom API error:', error);
  }
};
*/