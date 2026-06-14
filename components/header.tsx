"use client";

import Link from "next/link";
import {
  LogOut,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

export function Header() {
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-muted rounded-lg" />
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer outline-none hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                  RJ
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-foreground">Rishu Raj Gupta</p>
                  <p className="text-xs text-muted-foreground">rishu@pieds.bits</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center gap-2 w-full">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-primary focus:text-primary focus:bg-primary/10">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
