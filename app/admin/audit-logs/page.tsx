"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAuditLogs, type AuditLog } from "@/lib/admin-store";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<string>("");

  useEffect(() => {
    const loaded = getAuditLogs();
    setLogs(loaded);
    setFilteredLogs(loaded);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.changes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAction) {
      filtered = filtered.filter((log) => log.action === selectedAction);
    }

    if (selectedResource) {
      filtered = filtered.filter((log) => log.resource === selectedResource);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, selectedAction, selectedResource, logs]);

  const actions = [...new Set(logs.map((l) => l.action))];
  const resources = [...new Set(logs.map((l) => l.resource))];

  const getActionColor = (action: string) => {
    return {
      created: "bg-green-100 text-green-700",
      updated: "bg-blue-100 text-blue-700",
      deleted: "bg-red-100 text-red-700",
      viewed: "bg-gray-100 text-gray-700",
    }[action] || "bg-gray-100 text-gray-700";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground mt-1">Track system activity and user actions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search actor or changes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
          >
            <option value="">All Resources</option>
            {resources.map((resource) => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="p-6 border-0 overflow-hidden">
        <h2 className="text-lg font-semibold mb-4">Logs ({filteredLogs.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold p-3 text-muted-foreground">Timestamp</th>
                <th className="text-left font-semibold p-3 text-muted-foreground">Actor</th>
                <th className="text-left font-semibold p-3 text-muted-foreground">Action</th>
                <th className="text-left font-semibold p-3 text-muted-foreground">Resource</th>
                <th className="text-left font-semibold p-3 text-muted-foreground">Changes</th>
                <th className="text-left font-semibold p-3 text-muted-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3 text-xs whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="p-3 font-semibold">{log.actor}</td>
                    <td className="p-3">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold">{log.resource}</td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">
                      {log.changes}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {log.ipAddress || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No logs found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
