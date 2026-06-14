"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAppSettings,
  saveAppSettings,
  type AppSettings,
} from "@/lib/admin-store";

export default function AppSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = getAppSettings();
    setSettings(loaded);
  }, []);

  const handleSave = () => {
    if (settings) {
      saveAppSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChange = (key: keyof AppSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Application Settings</h1>
            <p className="text-muted-foreground mt-1">Manage organization and system settings</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>

      {/* Success Message */}
      {saved && (
        <Card className="p-4 border-0 bg-green-50 text-green-700">
          ✓ Settings saved successfully
        </Card>
      )}

      {/* Organization Settings */}
      <Card className="p-6 border-0">
        <h2 className="text-lg font-semibold mb-6">Organization Information</h2>

        <div className="space-y-6">
          {/* Organization Name */}
          <div>
            <label className="text-sm font-semibold block mb-2">Organization Name</label>
            <Input
              value={settings.organizationName}
              onChange={(e) => handleChange("organizationName", e.target.value)}
              placeholder="e.g., PIEDS Ignite"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The name displayed throughout the application
            </p>
          </div>

          {/* Email From */}
          <div>
            <label className="text-sm font-semibold block mb-2">Email From Address</label>
            <Input
              type="email"
              value={settings.emailFrom}
              onChange={(e) => handleChange("emailFrom", e.target.value)}
              placeholder="noreply@example.com"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Default sender address for system emails
            </p>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-sm font-semibold block mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background max-w-md"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Used for displaying dates and times throughout the application
            </p>
          </div>
        </div>
      </Card>

      {/* Logo & Branding */}
      <Card className="p-6 border-0">
        <h2 className="text-lg font-semibold mb-6">Branding</h2>

        <div className="space-y-6">
          {/* Logo */}
          <div>
            <label className="text-sm font-semibold block mb-2">Organization Logo</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-3">Logo upload coming in a future update</p>
              <Button variant="outline" disabled>
                Upload Logo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PNG or SVG format, recommended 200×200px
            </p>
          </div>
        </div>
      </Card>

      {/* System Information */}
      <Card className="p-6 border-0 bg-blue-50">
        <h2 className="text-lg font-semibold mb-4">System Information</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-semibold">June 15, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database</span>
            <span className="font-semibold">LocalStorage (Mock)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-green-600">✓ Operational</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-0 border-l-4 border-l-red-500 bg-red-50">
        <h2 className="text-lg font-semibold mb-4 text-red-900">Danger Zone</h2>

        <div className="space-y-3">
          <p className="text-sm text-red-800">
            These actions are irreversible. Please proceed with caution.
          </p>

          <div className="flex gap-3">
            <Button variant="destructive" disabled>
              Clear All Data
            </Button>
            <Button variant="destructive" disabled>
              Reset Application
            </Button>
          </div>

          <p className="text-xs text-red-700">
            These features require additional confirmation and are disabled for safety.
          </p>
        </div>
      </Card>
    </div>
  );
}
