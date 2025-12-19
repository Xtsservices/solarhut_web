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
  // { id: 'Work_Progress', label: 'Work Progress', icon: TrendingUp },
  { id: 'Masters', label: 'Masters', icon: Shield },
   { id: 'My_Tasks', label: 'My Tasks', icon: ListChecks },
  { id: 'Locations', label: 'Locations', icon: MapPin },
  { id: 'Jobs', label: 'Jobs', icon: Briefcase },
  // { id: 'Notifications', label: 'Notifications', icon: Bell },
  // { id: 'Settings', label: 'Settings', icon: Settings },
  { id: 'Profile', label: 'Profile', icon: User },
  { id: 'Estimations', label: 'Estimations', icon: ClipboardCheck },
 
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

  // ADDED: Sidebar collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ADDED: Ref to track the scrollable nav container
  const scrollRef = useRef<HTMLDivElement>(null);

  // ADDED: Memoize menuItems to prevent unnecessary re-creation on every render
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

  // FIXED: Save scroll position before navigation
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
  // ADDED: Restore scroll position when currentPage changes (after navigation)
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar_scroll_position');
    if (scrollRef.current && savedScroll !== null) {
      scrollRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, [currentPage]);

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="h-full bg-white flex flex-col">
      {/* FIXED: Added ref to preserve scroll position */}
      <nav 
        ref={scrollRef}
        className={cn("flex-1 overflow-y-auto", collapsed ? "p-2" : "p-3 sm:p-4")}
      >
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Enhanced active state detection
            let isActive = false;
            if (item.id === 'Leads' && (currentPage === 'Leads' || currentPage === 'enquiries')) {
              isActive = true;
            } else if (item.id === 'Work_Progress' && (currentPage === 'Work_Progress' || currentPage === 'work-progress')) {
              isActive = true;
            } else if (item.id === 'My_Tasks' && (currentPage === 'My_Tasks' || currentPage === 'my-tasks')) {
              isActive = true;
            } else if (item.id === 'Masters' && (currentPage === 'Masters' || currentPage === 'masters')) {
              isActive = true;
            } else {
              isActive = currentPage === item.id || currentPage.toLowerCase() === item.id.toLowerCase();
            }
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center rounded-lg text-xs sm:text-sm transition-colors cursor-pointer',
                    collapsed ? 'justify-center p-2' : 'gap-2 sm:gap-3 px-3 py-2 sm:py-2.5',
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className={cn("border-t", collapsed ? "p-2" : "p-3 sm:p-4")}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors mb-10 cursor-pointer",
            collapsed ? "justify-center p-2" : "gap-2 sm:gap-3 px-3 py-2 sm:py-2.5"
          )}
          style={{ pointerEvents: 'auto' }}
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r flex-shrink-0 transition-all duration-300",
          isCollapsed ? "w-16" : "w-56 xl:w-64"
        )} 
        style={{ height: 'calc(100vh - 3.5rem)', position: 'relative', zIndex: 1 }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ pointerEvents: 'auto' }}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
        <SidebarContent collapsed={isCollapsed} />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-full sm:w-80 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access dashboard, notifications, and other menu items
          </SheetDescription>
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}