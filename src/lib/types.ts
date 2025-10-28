export interface Enquiry {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  kv: string;
  address: string;
  message: string;
  status: 'new' | 'assigned' | 'scheduled' | 'completed';
  type: 'enquiry' | 'job' | 'supplier';
  assignedTo?: string;
  salesPersonId?: string;
  fieldExecutiveId?: string;
  quotationAmount?: number;
  workDate?: string;
  workTime?: string;
  paymentStatus?: 'paid' | 'pending';
  createdAt: string;
}

export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  mobile: string;
  assignedEnquiries: number;
  completedJobs: number;
  pendingQuotations: number;
}

export interface FieldExecutive {
  id: string;
  name: string;
  email: string;
  mobile: string;
  totalWorks: number;
  pendingWorks: number;
  completedWorks: number;
  status: 'available' | 'on-job' | 'busy';
}

export interface Notification {
  id: string;
  type: 'enquiry' | 'assignment' | 'payment' | 'completion';
  message: string;
  timestamp: string;
  read: boolean;
  recipient: 'admin' | 'sales' | 'field';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'field';
}
