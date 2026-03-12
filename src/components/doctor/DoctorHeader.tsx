import { Bell } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

interface DoctorHeaderProps {
  title: string;
  subtitle?: string;
}

export function DoctorHeader({ title, subtitle }: DoctorHeaderProps) {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DR';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-md px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex-1">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <Bell className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-success/10 text-success text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-xs font-medium text-foreground">{user?.name?.replace('Dr. ', '') || 'Doctor'}</p>
          <p className="text-[10px] text-muted-foreground">{user?.specialization || 'Doctor'}</p>
        </div>
      </div>
    </header>
  );
}
