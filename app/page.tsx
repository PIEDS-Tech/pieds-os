"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Users, Mail, Calendar, CheckSquare, TrendingUp } from "lucide-react";
import { getActivityFeed, type ActivityFeedItem } from "@/lib/notifications-store";
import { getContacts } from "@/lib/contacts-store";
import { getCampaigns } from "@/lib/campaigns-store";
import { getMeetings } from "@/lib/meetings-store";
import { getTasks } from "@/lib/tasks-store";

const stats = [
  { label: "Total Contacts", value: "147", icon: Users, color: "from-primary to-orange-500" },
  { label: "Active Campaigns", value: "5", icon: Mail, color: "from-accent to-blue-500" },
  { label: "Upcoming Meetings", value: "12", icon: Calendar, color: "from-secondary to-yellow-500" },
  { label: "Pending Tasks", value: "23", icon: CheckSquare, color: "from-green-500 to-emerald-600" },
];

export default function DashboardPage() {
  const [activity, setActivity] = useState<ActivityFeedItem[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const feed = getActivityFeed();
    setActivity(feed.slice(0, 5)); // Show top 5 recent activities

    const allTasks = getTasks();
    const pending = allTasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
    setTasks(pending);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    return priority === "high"
      ? "bg-primary/10 text-primary"
      : priority === "medium"
      ? "bg-secondary/10 text-secondary"
      : "bg-accent/10 text-accent";
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-lg">Here's what's happening with PIEDS Ignite this month.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 bg-gradient-to-br hover:shadow-lg transition-shadow border-0"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last month
              </p>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6 border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <Link href="/settings#activity">
              <span className="text-xs font-semibold text-accent hover:underline">VIEW ALL</span>
            </Link>
          </div>
          <div className="space-y-4">
            {activity.length > 0 ? (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.actor} <span className="font-normal text-muted-foreground">{item.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(item.timestamp)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
            )}
          </div>
        </Card>

        {/* Quick Tasks */}
        <Card className="p-6 border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">My Tasks</h2>
            <Link href="/tasks">
              <span className="text-xs font-semibold text-accent hover:underline">VIEW ALL</span>
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.priority === "high"
                            ? "bg-primary"
                            : task.priority === "medium"
                            ? "bg-secondary"
                            : "bg-accent"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {task.title}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No pending tasks</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
