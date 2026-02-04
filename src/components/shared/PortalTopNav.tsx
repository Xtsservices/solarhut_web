import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Shield, 
  IndianRupee, 
  Briefcase, 
  ClipboardCheck,
  Package,
  MapPin,
  Handshake,
  ListChecks,
  Sun,
  DollarSign,
  Users2,
  Landmark,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../ui/utils';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalTopNavProps {
  role: 'admin' | 'sales' | 'field';
  currentPage: string;
}

const adminMenuItems: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Leads', label: 'Leads', icon: FileText },
  { id: 'Employees', label: 'Employees', icon: Users },
  { id: 'Packages', label: 'Packages', icon: Package },
  { id: 'Payments', label: 'Payments', icon: IndianRupee },
  { id: 'Contacts', label: 'Contacts', icon: Handshake },
  { id: 'Masters', label: 'Masters', icon: Shield },
  { id: 'My_Tasks', label: 'My Tasks', icon: ListChecks },
  { id: 'Locations', label: 'Locations', icon: MapPin },
  { id: 'Jobs', label: 'Jobs', icon: Briefcase },
  { id: 'Customers', label: 'Customers', icon: Users2 },
  { id: 'Solar_Capacities', label: 'Solar Capacities', icon: Sun },
  { id: 'Expenditures', label: 'Expenditures', icon: DollarSign },
  { id: 'Bank_Details', label: 'Bank Details', icon: Landmark },
  { id: 'Profile', label: 'Profile', icon: User },
  { id: 'Estimations', label: 'Estimations', icon: ClipboardCheck },
  { id: 'Tax_Invoice', label: 'Tax Invoice', icon: FileText },
  { id: 'Invoices', label: 'Invoices', icon: FileText },
];

const salesMenuItems: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Assigned Enquiries', label: 'Assigned Enquiries', icon: FileText },
  { id: 'Profile', label: 'Profile', icon: User },
];

const fieldMenuItems: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Assigned Jobs', label: 'Assigned Jobs', icon: ClipboardCheck },
  { id: 'Profile', label: 'Profile', icon: User },
];

export function PortalTopNav({ role, currentPage }: PortalTopNavProps) {
  const user = useSelector((state: any) => state.currentUserData);
  const permissions = user?.permissions || [];
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    let items: MenuItem[] = [];
    
    if (role === 'admin') {
      const allowedFeatures = permissions.map((p: any) => {
        if (typeof p === 'string') return p.toLowerCase();
        else if (p && typeof p === 'object' && p.feature_name) return p.feature_name.toLowerCase();
        else if (p && typeof p === 'object' && p.name) return p.name.toLowerCase();
        return '';
      }).filter(Boolean);

      const featureToMenuMapping: Record<string, string> = {
        'enquiries': 'leads', 'leads': 'leads', 'employees': 'employees',
        'packages': 'packages', 'payments': 'payments', 'contacts': 'contacts',
        'masters': 'masters', 'my_tasks': 'my_tasks', 'my tasks': 'my_tasks',
        'locations': 'locations', 'jobs': 'jobs', 'dashboard': 'dashboard',
        'profile': 'profile', 'estimations':'estimations', 
        'tax_invoice':'tax_invoice', 'tax invoices':'tax_invoice',
        'invoice':'invoices', 'invoices':'invoices',
        'solar_capacities': 'solar_capacities', 'solar capacities': 'solar_capacities',
        'expenditures': 'expenditures', 'customers': 'customers',
        'bank_details': 'bank_details', 'bank details': 'bank_details',
      };

      const allowedMenuItems: string[] = allowedFeatures.map((feature: string) => 
        featureToMenuMapping[feature] || feature
      );

      if (allowedFeatures.length === 0) {
        items = adminMenuItems;
      } else {
        items = adminMenuItems.filter(item => {
          const itemId = item.id.toLowerCase();
          return allowedMenuItems.includes(itemId) || allowedFeatures.includes(itemId);
        });
      }
    } else if (role === 'sales') {
      items = salesMenuItems;
    } else {
      items = fieldMenuItems;
    }

    return items;
  }, [role, permissions]);

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      'Leads': '/enquiries',
      'Contacts': '/contacts',
      'Masters': '/masters',
      'My_Tasks': '/my-tasks',
      'Dashboard': '/dashboard',
      'Employees': '/employees',
      'Packages': '/packages',
      'Payments': '/payments',
      'Locations': '/locations',
      'Jobs': '/jobs',
      'Profile': '/profile',
      'Estimations': '/estimations',
      'Tax_Invoice': '/tax-invoice',
      'Expenditures': '/expenditures',
      'Solar_Capacities': '/solar-capacities',
      'Customers': '/customers',
      'Bank_Details': '/bank-details',
    };

    navigate(routes[page] || '/' + page.toLowerCase());
  };

  return (
    <div className="hidden lg:block bg-white border-b shadow-sm sticky top-[64px] sm:top-[80px] z-40">
      <div className="px-4 overflow-x-auto">
        <nav className="flex items-center gap-1 min-h-[48px]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            
            if (item.id === 'Leads' && (currentPage === 'Leads' || currentPage === 'enquiries')) {
              isActive = true;
            } else if (item.id === 'My_Tasks' && (currentPage === 'My_Tasks' || currentPage === 'my-tasks')) {
              isActive = true;
            } else if (item.id === 'Masters' && (currentPage === 'Masters' || currentPage === 'masters')) {
              isActive = true;
            } else if (item.id === 'Solar_Capacities' && (currentPage === 'Solar_Capacities' || currentPage === 'solar-capacities')) {
              isActive = true;
            } else if (item.id === 'Bank_Details' && (currentPage === 'Bank_Details' || currentPage === 'bank-details')) {
              isActive = true;
            } else if (item.id === 'Expenditures' && (currentPage === 'Expenditures' || currentPage === 'expenditures')) {
              isActive = true;
            } else if (item.id === 'Customers' && (currentPage === 'Customers' || currentPage === 'customers')) {
              isActive = true;
            } else if (item.id === 'Tax_Invoice' && (currentPage === 'Tax_Invoice' || currentPage === 'tax-invoice')) {
              isActive = true;
            } else {
              isActive = currentPage === item.id || currentPage.toLowerCase() === item.id.toLowerCase();
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2',
                  isActive
                    ? 'text-orange-600 border-orange-600 bg-orange-50/50'
                    : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
