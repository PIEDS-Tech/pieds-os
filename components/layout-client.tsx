"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { AIAssistant } from "@/components/ai-assistant";
import { initializeContacts } from "@/lib/contacts-store";
import { initializeOrganizations } from "@/lib/organizations-store";
import { initializeCampaigns } from "@/lib/campaigns-store";
import { initializeTemplates } from "@/lib/templates-store";
import { initializeMeetings } from "@/lib/meetings-store";
import { initializeTasks } from "@/lib/tasks-store";
import { initializeDocuments } from "@/lib/documents-store";
import { initializeNotifications } from "@/lib/notifications-store";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // Initialize data stores
    initializeContacts();
    initializeOrganizations();
    initializeCampaigns();
    initializeTemplates();
    initializeMeetings();
    initializeTasks();
    initializeDocuments();
    initializeNotifications();

    // Redirect to login if not logged in and not on login page
    if (!loggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [router, pathname]);

  // Show login page without sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Loading state
  if (isLoggedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show main layout for authenticated users
  if (!isLoggedIn) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <AIAssistant />
    </SidebarProvider>
  );
}
