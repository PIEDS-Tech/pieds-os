"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { mockLogin } from "@/lib/auth";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      mockLogin(email);
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary/20 to-slate-900 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <Card className="w-full max-w-md p-8 relative z-10 border border-border/50 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-orange-500 to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full blur-lg opacity-70"></div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            PIEDS IGNITE
          </h1>
          <p className="text-muted-foreground text-sm">
            CRM & Operations Platform
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            BITS Pilani's event management system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border-border/50 focus:border-primary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg transition-shadow text-white font-semibold"
            disabled={loading || !email}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Demo mode: Use any email to get started
          </p>
        </div>
      </Card>
    </div>
  );
}
