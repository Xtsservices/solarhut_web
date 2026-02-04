import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Shield, 
  // LocateIcon,
  IndianRupee, 
  Briefcase, 
  TrendingUp, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  ClipboardCheck,
  X,
  Package,
  MapPin,
  Handshake,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  Sun, // ADDED: icon for Solar Capacities
  DollarSign, // ADDED: icon for Expenditures
  Users2, // ADDED: icon for Customers
  Landmark, // ADDED: icon for Bank Details
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../ui/utils';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useMemo, useState } from 'react'; // ADDED: for scroll preservation

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalSidebarProps {
  role: 'admin' | 'sales' | 'field';
  currentPage: string;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
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
  { id: 'Bank_Details', label: 'Bank Details', icon: Landmark }, // ADDED
  { id: 'Profile', label: 'Profile', icon: User },
  { id: 'Estimations', label: 'Estimations', icon: ClipboardCheck },
  { id: 'Tax_Invoice', label: 'Tax Invoice', icon: FileText },
  { id: 'Invoices', label: 'Invoices', icon: FileText },
];

const salesMenuItems: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Assigned Enquiries', label: 'Assigned Enquiries', icon: FileText },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
  { id: 'Profile', label: 'Profile', icon: User },
];

const fieldMenuItems: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Assigned Jobs', label: 'Assigned Jobs', icon: ClipboardCheck },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
  { id: 'Profile', label: 'Profile', icon: User },
];

export function PortalSidebar({ 
  role, 
  currentPage, 
  onLogout,
  isMobileOpen = false,
  onMobileClose
}: PortalSidebarProps) {
  const user = useSelector((state: any) => state.currentUserData);
  console.log('Current User in Sidebar:', user);
  const permissions = user?.permissions || [];

  // Removed desktop collapsed state as sidebar is now mobile-only
  const scrollRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(() => {
    let items: MenuItem[] = [];
    
    if (role === 'admin') {
      // Handle permissions array - extract feature names safely
      console.log('User Permissions:', permissions);
      const allowedFeatures = permissions.map((p: any) => {
        if (typeof p === 'string') {
          return p.toLowerCase();
        } else if (p && typeof p === 'object' && p.feature_name) {
          return p.feature_name.toLowerCase();
        } else if (p && typeof p === 'object' && p.name) {
          return p.name.toLowerCase();
        }
        return '';
      }).filter(Boolean);
      
      console.log('Allowed Features:', allowedFeatures);
      
      // Create a mapping between feature names and menu item IDs
      const featureToMenuMapping: Record<string, string> = {
        'enquiries': 'leads',
        'leads': 'leads',
        'employees': 'employees',
        'packages': 'packages', 
        'payments': 'payments',
        'contacts': 'contacts',
        'work_progress': 'work_progress',
        'work progress': 'work_progress',
        'masters': 'masters',
        'my_tasks': 'my_tasks',
        'my tasks': 'my_tasks',
        'locations': 'locations',
        'jobs': 'jobs',
        'dashboard': 'dashboard',
        'notifications': 'notifications',
        'settings': 'settings',
        'profile': 'profile',
        'estimations':'estimations',
        'tax_invoice':'tax_invoice',
        'tax invoices':'tax_invoice',
        'tax_invoices':'tax_invoice',
        'tax invoice':'tax_invoice',
        'taxinvoice':'tax_invoice',
        'taxinvoices':'tax_invoice',
        'invoice':'invoices',
        'invoices':'invoices',
        'invoice_view':'tax_invoice',
        'invoices_view':'tax_invoice',
        'tax_invoice_view':'tax_invoice',
        'taxinvoice_view':'tax_invoice',
        'tax':'tax_invoice',
        // ADDED: Solar capacities mapping variants
        'solar_capacities': 'solar_capacities',
        'solar capacities': 'solar_capacities',
        'solar-capacities': 'solar_capacities',
        'solar_capacity': 'solar_capacities',
        'solarcapacity': 'solar_capacities',
        // ADDED: Expenditures mapping variants
        'expenditures': 'expenditures',
        'expenditure': 'expenditures',
        'expenses': 'expenditures',
        'customers': 'customers',
        'customer': 'customers',
        'bank_details': 'bank_details',
        'bank details': 'bank_details',
        'bank-details': 'bank_details',
        'bankdetails': 'bank_details',
        'bank': 'bank_details',
      };
      
      // Map allowed features to menu item IDs
      const allowedMenuItems: string[] = allowedFeatures.map((feature: string) => 
        featureToMenuMapping[feature] || feature
      );
      
      console.log('Mapped Menu Items:', allowedMenuItems);
      
      // If no permissions or empty permissions, show all menu items (for admin)
      if (allowedFeatures.length === 0) {
        console.log('No permissions found, showing all menu items');
        items = adminMenuItems;
      } else {
        items = adminMenuItems.filter(item => {
          const itemId = item.id.toLowerCase();
          const isAllowed = allowedMenuItems.includes(itemId) || allowedFeatures.includes(itemId);
          console.log(`Menu item ${item.label} (${itemId}): ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
          return isAllowed;
        });
      }
      
      console.log('Final filtered menu items:', items.map(item => item.label));
       
    } else if (role === 'sales') {
      items = salesMenuItems;
    } else {
      items = fieldMenuItems;
    }

    return items;
  }, [role, permissions]); // Dependencies for memoization

  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // Save scroll position before leaving
    if (scrollRef.current) {
      sessionStorage.setItem('sidebar_scroll_position', scrollRef.current.scrollTop.toString());
    }

    // Handle special routing cases where menu ID doesn't match route path
    if (page === 'Leads') {
      navigate('/enquiries');
    } else if (page === 'Contacts') {
      navigate('/contacts');
    } else if (page === 'Work_Progress') {
      navigate('/work-progress');
    } else if (page === 'Masters') {
      navigate('/masters');
    } else if (page === 'My_Tasks') {
      navigate('/my-tasks');
    } else if (page === 'Dashboard') {
      navigate('/dashboard');
    } else if (page === 'Employees') {
      navigate('/employees');
    } else if (page === 'Packages') {
      navigate('/packages');
    } else if (page === 'Payments') {
      navigate('/payments');
    } else if (page === 'Locations') {
      navigate('/locations');
    } else if (page === 'Jobs') {
      navigate('/jobs');
    } else if (page === 'Notifications') {
      navigate('/notifications');
    } else if (page === 'Settings') {
      navigate('/settings');
    } else if (page === 'Profile') {
      navigate('/profile');
    } else if (page === 'Estimations') {
      navigate('/estimations');
    } else if (page === 'Tax_Invoice') {
      navigate('/tax-invoice');
    } else if (page === 'Expenditures') { // ADDED: navigation target
      navigate('/expenditures');
    } else if (page === 'Solar_Capacities') { // ADDED: navigation target
      navigate('/solar-capacities');
    } else if (page === 'Customers') { // ADDED: navigation target
      navigate('/customers');
    } else if (page === 'Bank_Details') { // ADDED
      navigate('/bank-details');
    } else {
      navigate('/' + page.toLowerCase());
    }
    
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleLogout = () => {
    onLogout();
    if (onMobileClose) {
      onMobileClose();
    }
  };

  console.log("menuItems in Sidebar:", menuItems);
  
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar_scroll_position');
    if (scrollRef.current && savedScroll !== null) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, [currentPage]);

  const SidebarContent = () => (
    <div className="h-full bg-white flex flex-col">
      {/* Close button for mobile */}
      <div className="flex justify-between items-center px-6 py-4 border-b lg:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
      </div>

      <nav 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            if (item.id === 'Leads' && (currentPage === 'Leads' || currentPage === 'enquiries')) {
              isActive = true;
            } else if (item.id === 'Work_Progress' && (currentPage === 'Work_Progress' || currentPage === 'work-progress')) {
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
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-orange-500 text-white font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-normal'
                  )}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer font-normal"
          style={{ pointerEvents: 'auto' }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Sheet) - Only visible on mobile */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access dashboard, notifications, and other menu items
          </SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}