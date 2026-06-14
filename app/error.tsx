"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="p-8 max-w-md text-center border-0">
        <div className="mb-6 flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={() => reset()} className="flex-1">
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex-1"
          >
            Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
