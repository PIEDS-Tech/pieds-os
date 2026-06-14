"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and admin settings</p>
      </div>

      {/* User Settings */}
      <Card className="p-6 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">User Profile</h2>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value="rishu@pieds.bits" disabled />
          </div>
          <div>
            <Label>Name</Label>
            <Input type="text" value="Rishu Joshi" disabled />
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" value="Admin" disabled />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Update Profile</Button>
        </div>
      </Card>

      {/* Admin Settings */}
      <Card className="p-6 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <p className="text-gray-600 mb-4">Manage users, templates, and integrations</p>
        <Button variant="outline">User Management (Phase 12)</Button>
      </Card>

      {/* Integration Settings */}
      <Card className="p-6 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Integrations</h2>
        <p className="text-gray-600 mb-4">Configure API keys and integrations</p>
        <div className="space-y-4">
          <div>
            <Label>Supabase API Key</Label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <div>
            <Label>Resend API Key</Label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <p className="text-xs text-gray-500">Coming in Phase 12</p>
        </div>
      </Card>
    </div>
  );
}
