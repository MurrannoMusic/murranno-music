import { LayoutDashboard, Users, FileCheck, DollarSign, BarChart3, Settings, FileText, Megaphone, Eye, User, Building2, Tag, CreditCard, Bell } from 'lucide-react';
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
  { title: 'Campaigns', url: '/admin/campaigns', icon: Megaphone },
  { title: 'Promotions', url: '/admin/promotions', icon: Tag },
  { title: 'Payments', url: '/admin/payments', icon: CreditCard },
  { title: 'Financials', url: '/admin/financials', icon: DollarSign },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Notifications', url: '/admin/notifications', icon: Bell },
  { title: 'Audit Logs', url: '/admin/audit-logs', icon: FileText },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const previewItems = [
  { title: 'Artist View', url: '/admin/preview/artist', icon: User },
  { title: 'Label View', url: '/admin/preview/label', icon: Building2 },
  { title: 'Agency View', url: '/admin/preview/agency', icon: Megaphone },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center justify-center w-full">
          <img 
            src="/src/assets/mm_logo.png" 
            alt="Murranno Music Logo" 
            className={`object-contain transition-all ${isCollapsed ? 'h-8 w-8' : 'h-12 w-auto'}`}
          />
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

        <Separator className="my-4 mx-2" />

        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Dashboard Previews
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {previewItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-accent/70 text-accent-foreground font-semibold shadow-sm' 
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }
                        `}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-accent-foreground' : ''}`} />
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