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
} from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
import { cn } from '../ui/utils';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { useSelector } from 'react-redux';

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
  { id: 'Work_Progress', label: 'Work Progress', icon: TrendingUp },
  { id: 'Masters', label: 'Masters', icon: Shield },
   { id: 'My_Tasks', label: 'My Tasks', icon: ListChecks },
  { id: 'Locations', label: 'Locations', icon: MapPin },
  { id: 'Jobs', label: 'Jobs', icon: Briefcase },
  { id: 'Notifications', label: 'Notifications', icon: Bell },
  { id: 'Settings', label: 'Settings', icon: Settings },
  { id: 'Profile', label: 'Profile', icon: User },
 
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
  let menuItems = [];
  if (role === 'admin') {

    const allowedFeatures = permissions.map((p: any) => (p || '').toLowerCase());
    menuItems = adminMenuItems.filter(item => allowedFeatures.includes(item.id.toLowerCase()));
     
  } else if (role === 'sales') {
    menuItems = salesMenuItems;
  } else {
    menuItems = fieldMenuItems;
  }

    const navigate = useNavigate();
    const handleNavigate = (page: string) => {
      navigate('/' + page);
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

  const SidebarContent = () => (
    <div className="h-full bg-white flex flex-col">
      {/* Menu Items */}
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'Leads') {
                      handleNavigate('enquiries');
                    } else if (item.id === 'masters') {
                      handleNavigate('masters');
                    } else if (item.id === 'Contacts') {
                      handleNavigate('contacts');
                    } else if (item.id === 'Work_Progress') {
                      handleNavigate('work-progress');
                    } else {
                      handleNavigate(item.id);
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 sm:p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors mb-10"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 xl:w-64 bg-white border-r flex-shrink-0" style={{ height: 'calc(100vh - 3.5rem)' }}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-full sm:w-80 p-0">
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
