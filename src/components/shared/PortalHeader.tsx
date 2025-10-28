import { Bell, User, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// Import the logo
import logoImage from 'figma:asset/635b8d0ac7c7e91f30e8873933c7278d37649bac.png';

interface PortalHeaderProps {
  role: 'admin' | 'sales' | 'field';
  userName: string;
  notificationCount: number;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  onMenuToggle?: () => void;
}

export function PortalHeader({ 
  role, 
  userName, 
  notificationCount,
  onNotificationsClick,
  onProfileClick,
  onMenuToggle
}: PortalHeaderProps) {
  const roleTitle = 
    role === 'admin' ? 'Admin Portal' : 
    role === 'sales' ? 'Sales Portal' : 
    'Field Executive Portal';

  return (
    <header className="bg-white border-b h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-50">
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
        
        <img 
          src={logoImage} 
          alt="Solar Hut Solutions Logo" 
          className="h-12 sm:h-12 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 sm:h-9 sm:w-9"
          onClick={onNotificationsClick}
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs">
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
          onClick={onProfileClick}
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <span className="hidden sm:inline text-gray-700 text-xs sm:text-sm truncate max-w-[100px] md:max-w-[150px]">
            {userName}
          </span>
        </Button>
      </div>
    </header>
  );
}
