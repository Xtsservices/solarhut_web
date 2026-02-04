import { Bell, User, Menu, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

// Use static path for the logo image to avoid type/import issues
const logoImagePath = '/assets/image.png';

interface PortalHeaderProps {
  role: 'admin' | 'sales' | 'field';
  userName: string;
  notificationCount: number;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  onMenuToggle?: () => void;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function PortalHeader({ 
  role, 
  userName, 
  notificationCount,
  onNotificationsClick,
  onProfileClick,
  onMenuToggle
}: PortalHeaderProps) {
  const navigate = useNavigate();
  const roleTitle = 
    role === 'admin' ? 'Admin Portal' : 
    role === 'sales' ? 'Sales Portal' : 
    'Field Executive Portal';

  const initials = getInitials(userName);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    // Clear any auth tokens/session data
    localStorage.clear();
    sessionStorage.clear();
    // Use a hard redirect to landing page to ensure a fresh load
    window.location.href = '/';
  };

  return (
  <header className="bg-white border-b h-[64px] sm:h-[80px] flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-50">
      {/* Left: Menu Toggle (Mobile) + Logo */}
  <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Toggle */}
        {onMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 sm:h-9 sm:w-9"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </Button>
        )}
        
        <div className="flex items-center h-full">
          <img
            src="/src/assets/image.png"
            alt="Solar Hut Solutions Logo"
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            style={{ display: 'block', marginTop: 'auto', marginBottom: 'auto' }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Profile with Avatar - Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 sm:gap-3 h-8 sm:h-10 px-2 sm:px-3"
            >
              {/* Avatar with Initials */}
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {initials}
              </div>
              <span className="hidden sm:inline text-gray-700 text-xs sm:text-sm truncate max-w-[100px] md:max-w-[150px]">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleProfileClick} className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-red-600">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
