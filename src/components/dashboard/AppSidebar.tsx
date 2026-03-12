import {
  LayoutDashboard, Map, UserCheck, Building2, BarChart3,
  Bell, Settings, LogOut, Heart, ChevronLeft, Users, FilePlus
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  title: string;
  url: string;
  icon: any;
  badge?: number | null;
};

const adminNav: NavItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Rural Coverage', url: '/admin/rural-coverage', icon: Map },
  { title: 'Map View', url: '/map', icon: Map },
  { title: 'Pending Doctors', url: '/admin/pending-doctors', icon: UserCheck, badge: null },
  { title: 'Doctor Verification', url: '/doctors', icon: UserCheck },
  { title: 'Pharmacy Inventory', url: '/pharmacy', icon: Building2 },
  { title: 'Coverage Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Notifications', url: '/notifications', icon: Bell, badge: 3 },
];

const doctorNav: NavItem[] = [
  { title: 'Dashboard', url: '/doctor', icon: LayoutDashboard },
  { title: 'Patient Queue', url: '/doctor/queue', icon: Users },
  { title: 'Village Map', url: '/doctor/map', icon: Map },
  { title: 'Prescriptions', url: '/doctor/prescriptions', icon: Building2 },
];

const workerNav: NavItem[] = [
  { title: 'Dashboard', url: '/worker', icon: LayoutDashboard },
  { title: 'Register Patient', url: '/worker/register', icon: FilePlus },
];

const bottomNav: NavItem[] = [
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const mainNav = user?.role === 'admin' ? adminNav 
                : user?.role === 'doctor' ? doctorNav 
                : user?.role === 'worker' ? workerNav 
                : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">SwastyaConnect</span>
              <span className="text-[10px] text-sidebar-muted">Admin Portal</span>
            </div>
          )}
          {!collapsed && (
            <button onClick={toggleSidebar} className="ml-auto rounded-md p-1 text-sidebar-muted hover:text-sidebar-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-wider font-semibold mb-1">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                      {!collapsed && item.badge && (
                        <Badge className="h-5 min-w-[20px] rounded-full gradient-primary text-[10px] font-semibold border-0 text-primary-foreground">
                          {item.badge}
                        </Badge>
                      )}
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
          {bottomNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
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
