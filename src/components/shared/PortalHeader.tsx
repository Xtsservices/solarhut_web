import { Bell, User, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
  <header className="bg-white border-b min-h-[64px] sm:min-h-[80px] flex items-center justify-between px-3 sm:px-4 md:px-6 sticky top-0 z-50">
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
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
            style={{ display: 'block', marginTop: 'auto', marginBottom: 'auto' }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Notifications */}
        {/* <Button
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
        </Button> */}

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
