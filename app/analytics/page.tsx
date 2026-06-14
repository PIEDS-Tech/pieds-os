"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getOutreachStats,
  getTaskStats,
  getMeetingStats,
  getPipelineStats,
  getAtRiskContacts,
  getTeamProductivity,
  getOutreachTimeline,
  getTaskCompletionTrend,
  type OutreachStats,
  type TaskStats,
  type MeetingStats,
  type PipelineStage,
  type AtRiskContact,
  type TeamMember,
} from "@/lib/analytics-store";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#E74C3C", "#FFB84D", "#00A8E8", "#1a1a2e", "#6B7280"];

export default function AnalyticsDashboard() {
  const [outreach, setOutreach] = useState<OutreachStats | null>(null);
  const [tasks, setTasks] = useState<TaskStats | null>(null);
  const [meetings, setMeetings] = useState<MeetingStats | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [atRisk, setAtRisk] = useState<AtRiskContact[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [outreachTimeline, setOutreachTimeline] = useState([]);
  const [taskTrend, setTaskTrend] = useState([]);

  useEffect(() => {
    setOutreach(getOutreachStats());
    setTasks(getTaskStats());
    setMeetings(getMeetingStats());
    setPipeline(getPipelineStats());
    setAtRisk(getAtRiskContacts());
    setTeam(getTeamProductivity());
    setOutreachTimeline(getOutreachTimeline());
    setTaskTrend(getTaskCompletionTrend());
  }, []);

  if (!outreach || !tasks || !meetings) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time insights into your CRM performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-0">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">📧 Emails Sent</p>
            <p className="text-3xl font-bold">{outreach.sent}</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </Card>

        <Card className="p-6 border-0">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">👁️ Open Rate</p>
            <p className="text-3xl font-bold">{outreach.openRate}%</p>
            <p className="text-xs text-muted-foreground">{outreach.opened} opened</p>
          </div>
        </Card>

        <Card className="p-6 border-0">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">💬 Reply Rate</p>
            <p className="text-3xl font-bold">{outreach.replyRate}%</p>
            <p className="text-xs text-muted-foreground">{outreach.replied} replied</p>
          </div>
        </Card>

        <Card className="p-6 border-0">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">✅ Tasks Done</p>
            <p className="text-3xl font-bold">{tasks.completed}</p>
            <p className="text-xs text-muted-foreground">{tasks.overdue} overdue</p>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outreach Timeline */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">📧 Outreach Performance (Last 6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={outreachTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sent"
                stroke="#E74C3C"
                name="Sent"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="opened"
                stroke="#00A8E8"
                name="Opened"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="replied"
                stroke="#FFB84D"
                name="Replied"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Task Completion Trend */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">✅ Task Completion Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#00A8E8" name="Completed" />
              <Bar dataKey="total" fill="#E74C3C" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Distribution */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">📊 Task Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "To Do", value: tasks.todo },
                  { name: "In Progress", value: tasks.inProgress },
                  { name: "Done", value: tasks.completed },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#E74C3C" />
                <Cell fill="#FFB84D" />
                <Cell fill="#00A8E8" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Meetings Snapshot */}
        <Card className="p-6 border-0 space-y-4">
          <h3 className="font-semibold">📅 Meetings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Week</span>
              <Badge className="bg-blue-100 text-blue-700">{meetings.thisWeek}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <Badge className="bg-green-100 text-green-700">{meetings.thisMonth}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Upcoming</span>
              <Badge className="bg-purple-100 text-purple-700">{meetings.upcoming}</Badge>
            </div>
          </div>

          <h3 className="font-semibold pt-4">⚠️ Overdue Alert</h3>
          <div className="text-2xl font-bold text-red-600">{tasks.overdue}</div>
          <p className="text-xs text-muted-foreground">Tasks past deadline</p>
        </Card>

        {/* Pipeline Funnel */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">🔗 Sales Pipeline</h3>
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={pipeline} fill="#8884d8">
                {pipeline.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Contacts */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">⚠️ At-Risk Contacts (60+ days)</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {atRisk.length === 0 ? (
              <p className="text-sm text-muted-foreground">No at-risk contacts</p>
            ) : (
              atRisk.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.company}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-700">{contact.daysSince}d</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Team Productivity */}
        <Card className="p-6 border-0">
          <h3 className="font-semibold mb-4">👥 Team Productivity</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {team.map((member) => (
              <div key={member.name} className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-sm mb-2">{member.name}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{member.tasksCompleted}</p>
                    <p className="text-muted-foreground">Tasks Done</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-600">{member.meetingsHeld}</p>
                    <p className="text-muted-foreground">Meetings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-600">{member.emailsSent}</p>
                    <p className="text-muted-foreground">Emails</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-orange-600">{member.contactsAdded}</p>
                    <p className="text-muted-foreground">Contacts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
