"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckSquare,
  Mail,
  Zap,
  Settings,
  Users,
  Presentation,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

const menuItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: BarChart3 },
  { label: "Contacts", href: ROUTES.CONTACTS.ROOT, icon: Users },
  { label: "Organizations", href: ROUTES.ORGANIZATIONS.ROOT, icon: Building2 },
  { label: "Outreach", href: ROUTES.OUTREACH.ROOT, icon: Mail },
  { label: "Meetings", href: ROUTES.MEETINGS.ROOT, icon: Calendar },
  { label: "Tasks", href: ROUTES.TASKS.ROOT, icon: CheckSquare },
  { label: "Pitch Decks", href: ROUTES.DECKS.ROOT, icon: Presentation },
  { label: "Knowledge Base", href: ROUTES.KNOWLEDGE_BASE, icon: BookOpen },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: Zap },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">PIEDS</span>
            <span className="text-xs font-semibold text-sidebar-accent tracking-wider">IGNITE</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    className={`rounded-lg transition-all ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <div className="border-t border-sidebar-border px-6 py-4 mt-auto">
        <Link href={ROUTES.SETTINGS}>
          <SidebarMenuButton className="w-full text-sidebar-foreground hover:bg-sidebar-accent/10 rounded-lg">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </SidebarMenuButton>
        </Link>
      </div>
    </Sidebar>
  );
}
