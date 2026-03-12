import { Bell, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

import { NotificationDropdown } from '@/components/admin/NotificationDropdown';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth();
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD';
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-md px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex-1">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 border border-transparent focus-within:border-primary/30 transition-colors">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-40"
        />
      </div>

      <NotificationDropdown />

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-xs font-medium text-foreground">{user?.name || 'Admin'}</p>
          <p className="text-[10px] text-muted-foreground">Nabha District</p>
        </div>
      </div>
    </header>
  );
}
