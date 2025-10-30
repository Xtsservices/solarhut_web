import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wrench, 
  IndianRupee, 
  Briefcase, 
  TrendingUp, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  ClipboardCheck,
  X,
  Package
} from 'lucide-react';
import { cn } from '../ui/utils';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PortalSidebarProps {
  role: 'admin' | 'sales' | 'field';
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const adminMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries', icon: FileText },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'payments', label: 'Payments', icon: IndianRupee },
  { id: 'job-requests', label: 'Job/Supplier', icon: Briefcase },
  { id: 'work-progress', label: 'Work Progress', icon: TrendingUp },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
];

const salesMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assigned-enquiries', label: 'Assigned Enquiries', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

const fieldMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assigned-jobs', label: 'Assigned Jobs', icon: ClipboardCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

export function PortalSidebar({ 
  role, 
  currentPage, 
  onNavigate, 
  onLogout,
  isMobileOpen = false,
  onMobileClose
}: PortalSidebarProps) {
  const menuItems = 
    role === 'admin' ? adminMenuItems : 
    role === 'sales' ? salesMenuItems : 
    fieldMenuItems;

  const handleNavigate = (page: string) => {
    onNavigate(page);
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
                  onClick={() => handleNavigate(item.id)}
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
