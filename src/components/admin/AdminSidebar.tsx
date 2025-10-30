import { LayoutDashboard, Users, FileCheck, DollarSign, BarChart3, Settings, FileText, Music2 } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Content', url: '/admin/content', icon: FileCheck },
  { title: 'Financials', url: '/admin/financials', icon: DollarSign },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Audit Logs', url: '/admin/audit-logs', icon: FileText },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/mm_logo.png" 
            alt="Murranno Music Logo" 
            className="h-10 w-10 object-contain rounded-xl"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-foreground">Murranno Music</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = item.url === '/admin' 
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/admin'}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-primary/15 text-primary font-semibold shadow-sm' 
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }
                        `}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}