"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  getTeamUsers,
  updateUserRole,
  inviteUser,
  type TeamUser,
  type UserRole,
} from "@/lib/admin-store";

export default function UserManagementPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("member");

  useEffect(() => {
    const loaded = getTeamUsers();
    setUsers(loaded);
  }, []);

  const handleInviteUser = () => {
    if (!inviteEmail) return;
    const newUser = inviteUser(inviteEmail, selectedRole);
    setUsers([...users, newUser]);
    setInviteEmail("");
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const getRoleColor = (role: UserRole) => {
    return {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700",
      member: "bg-green-100 text-green-700",
      viewer: "bg-gray-100 text-gray-700",
    }[role];
  };

  const roleDescriptions: Record<UserRole, string> = {
    admin: "Full system access",
    manager: "Can manage users and campaigns",
    member: "Can create and edit content",
    viewer: "Read-only access",
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage team members and their roles</p>
          </div>
        </div>
      </div>

      {/* Invite User Card */}
      <Card className="p-6 border-0 bg-blue-50">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Invite New User
        </h2>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <Button onClick={handleInviteUser} className="gap-2">
            <Plus className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6 border-0 overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Team Members ({users.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Name
                </th>
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Email
                </th>
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Role
                </th>
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Joined
                </th>
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Status
                </th>
                <th className="text-left text-sm font-semibold p-3 text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-semibold">{user.name}</td>
                  <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      disabled={user.id === "u1"}
                      className={`px-2 py-1 rounded text-sm font-semibold border-0 ${getRoleColor(user.role)} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Badge className={user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {user.id !== "u1" && (
                      <button className="text-xs text-destructive hover:underline">Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Legend */}
      <Card className="p-6 border-0">
        <h3 className="font-semibold mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["admin", "manager", "member", "viewer"] as UserRole[]).map((role) => (
            <div key={role} className="flex items-start gap-3">
              <Badge className={getRoleColor(role)}>{role}</Badge>
              <div>
                <p className="font-semibold text-sm capitalize">{role}</p>
                <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
