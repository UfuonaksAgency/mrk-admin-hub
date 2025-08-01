import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Download, Calendar, Users, GraduationCap, BarChart3, Settings, CreditCard } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
const navigationItems = [{
  title: "Dashboard",
  url: "/admin",
  icon: LayoutDashboard
}, {
  title: "Blog Posts",
  url: "/admin/blog",
  icon: FileText
}, {
  title: "Free Resources",
  url: "/admin/resources",
  icon: Download
}, {
  title: "Payments",
  url: "/admin/payments",
  icon: CreditCard
}];
export function AdminSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-primary text-primary-foreground font-medium shadow-elegant" : "text-black dark:text-white";
  return <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && <div>
                <h2 className="font-semibold text-card-foreground">MrK Admin</h2>
                <p className="text-xs text-muted-foreground">Trading Agency</p>
              </div>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span className="text-black">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}