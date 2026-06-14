"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Check, CheckCheck } from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  type Notification,
} from "@/lib/notifications-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loaded = getNotifications();
    setNotifications(loaded);
    setUnreadCount(loaded.filter((n) => !n.isRead).length);
  }, []);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    markAsRead(id);
    const updated = getNotifications();
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    const updated = getNotifications();
    setNotifications(updated);
    setUnreadCount(0);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    deleteNotification(id);
    const updated = getNotifications();
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative p-2 hover:bg-muted rounded-lg transition-colors">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} new notification(s)` : "All caught up!"}
          </p>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{notification.icon}</span>

                    <div className="flex-1 min-w-0">
                      <Link href={notification.actionUrl || "#"}>
                        <p className="font-semibold text-sm hover:text-primary">
                          {notification.title}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex gap-2 mt-2">
                        {notification.actionUrl && notification.actionLabel && (
                          <Link href={notification.actionUrl}>
                            <button className="text-xs text-primary hover:underline font-semibold">
                              {notification.actionLabel}
                            </button>
                          </Link>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-1 hover:bg-background rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-3 border-t border-border">
              <Link href="/settings#notifications">
                <button className="text-xs text-primary hover:underline w-full text-center font-semibold">
                  View all notifications
                </button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatTime(dateString: string): string {
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
}
