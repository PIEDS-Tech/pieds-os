"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getIntegrationSettings,
  saveIntegrationSettings,
  type IntegrationSettings,
} from "@/lib/admin-store";

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = getIntegrationSettings();
    setSettings(loaded);
  }, []);

  const handleSave = () => {
    if (settings) {
      saveIntegrationSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChange = (key: keyof IntegrationSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets({ ...showSecrets, [key]: !showSecrets[key] });
  };

  if (!settings) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const integrations = [
    {
      name: "Supabase",
      description: "Database and authentication",
      icon: "🔵",
      fields: ["supabaseUrl", "supabaseKey"],
    },
    {
      name: "Resend",
      description: "Email delivery service",
      icon: "📧",
      fields: ["resendApiKey"],
    },
    {
      name: "OpenAI",
      description: "GPT models for AI features",
      icon: "🤖",
      fields: ["openaiApiKey"],
    },
    {
      name: "Anthropic",
      description: "Claude models for AI features",
      icon: "🧠",
      fields: ["anthropicApiKey"],
    },
  ];

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
            <h1 className="text-3xl font-bold">Integration Settings</h1>
            <p className="text-muted-foreground mt-1">Configure external API integrations</p>
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

      {/* Integration Cards */}
      <div className="space-y-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6 border-0">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                {integration.fields.length > 1 ? "Multiple Keys" : "API Key"}
              </div>
            </div>

            <div className="space-y-4">
              {integration.fields.map((field) => {
                const key = field as keyof IntegrationSettings;
                const isSecret = field.includes("Key") || field.includes("apiKey");
                const isHidden = showSecrets[field] === undefined ? isSecret : !showSecrets[field];

                return (
                  <div key={field}>
                    <label className="text-sm font-semibold block mb-2 capitalize">
                      {field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type={isHidden ? "password" : "text"}
                        value={settings[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${field}`}
                        className="flex-1"
                      />
                      {isSecret && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleSecret(field)}
                          className="px-3"
                        >
                          {isHidden ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {field === "supabaseUrl" &&
                        "Your Supabase project URL (e.g., https://xxx.supabase.co)"}
                      {field === "supabaseKey" &&
                        "Your Supabase anonymous key from project settings"}
                      {field === "resendApiKey" &&
                        "API key from your Resend dashboard"}
                      {field === "openaiApiKey" && "API key from OpenAI platform"}
                      {field === "anthropicApiKey" && "API key from Anthropic console"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Status:</span>
                {integration.fields.some((f) => !settings[f as keyof IntegrationSettings]) ? (
                  <span className="text-yellow-600 font-semibold">⚠️ Not Configured</span>
                ) : (
                  <span className="text-green-600 font-semibold">✓ Configured</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="p-6 border-0 bg-yellow-50">
        <h3 className="font-semibold text-yellow-900 mb-2">🔒 Security Notice</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Never share your API keys publicly or commit them to version control</li>
          <li>Use environment variables to store sensitive configuration</li>
          <li>Rotate API keys regularly for security</li>
          <li>Restrict API key permissions to only what's needed</li>
        </ul>
      </Card>
    </div>
  );
}
