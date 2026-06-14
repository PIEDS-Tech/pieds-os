"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings, Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const adminSections = [
  {
    title: "User Management",
    description: "Manage team members, roles, and permissions",
    icon: Users,
    href: "/admin/users",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Audit Logs",
    description: "View system activity and user actions",
    icon: FileText,
    href: "/admin/audit-logs",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Integrations",
    description: "Configure external API integrations",
    icon: Settings,
    href: "/admin/integrations",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "App Settings",
    description: "Manage organization and system settings",
    icon: Shield,
    href: "/admin/settings",
    color: "from-green-500 to-emerald-500",
  },
];

export default function AdminPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground text-lg">Manage your PIEDS OS instance</p>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 border-0 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>

                <Button variant="outline" size="sm" className="w-full">
                  Access
                </Button>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-6 border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Team Members</p>
            <p className="text-2xl font-bold">4</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Recent Logs</p>
            <p className="text-2xl font-bold">500+</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">System Status</p>
            <p className="text-2xl font-bold text-green-600">Healthy</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Update</p>
            <p className="text-2xl font-bold">2 min ago</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
