import {
  LayoutDashboard, Users, FileText, Map, LogOut, Heart, ChevronLeft, Stethoscope,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const doctorNav = [
  { title: 'Dashboard', url: '/doctor', icon: LayoutDashboard },
  { title: 'Patient Queue', url: '/doctor/queue', icon: Users },
  { title: 'Prescriptions', url: '/doctor/prescriptions', icon: FileText },
  { title: 'My Villages', url: '/doctor/map', icon: Map },
];

export function DoctorSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DR';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">SwastyaConnect</span>
              <span className="text-[10px] text-sidebar-muted">Doctor Portal</span>
            </div>
          )}
          {!collapsed && (
            <button onClick={toggleSidebar} className="ml-auto rounded-md p-1 text-sidebar-muted hover:text-sidebar-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* Doctor Info Card */}
      {!collapsed && (
        <div className="mx-3 mt-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-sidebar-muted truncate">{user?.specialization || 'Doctor'}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Stethoscope className="h-3 w-3 text-success" />
            <span className="text-[10px] text-success font-medium">Verified Doctor</span>
          </div>
        </div>
      )}

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-semibold mb-1">
            {!collapsed && 'Doctor Panel'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/doctor'}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
