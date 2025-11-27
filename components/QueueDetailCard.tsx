"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Power, AlertTriangle, Clock, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CountdownTimer from "./Countdown";
import { useQueueStore } from "@/store/useQueueStore";
import { QueueInfo } from "@/types";

// export interface QueueInfo {
//   isOffNow: boolean;
//   outagesCount: number;
//   hoursOff: number;
//   hoursOn: number;
//   nextEvent: { inMinutes: number; type: string } | null;
// }

export default function QueueDetailCard({
  queue,
  info,
}: {
  queue: string;
  info: QueueInfo;
}) {
  const { fetchData } = useQueueStore();

  const totalHours = info.hoursOn + info.hoursOff;
  const onPercentage = ((info.hoursOn / totalHours) * 100).toFixed(1);

  const hourlyData = [
    { name: "Виключено", value: info.hoursOff, fill: "hsl(var(--chart-4))" },
    { name: "Online", value: info.hoursOn, fill: "hsl(var(--chart-2))" },
  ];

  return (
    <Card className="border-border shadow-lg p-0 pb-6 overflow-hidden gap-0 mb-6">
      <CardHeader className="bg-linear-to-r from-primary/15 to-secondary/15 border-b border-border p-4 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Черга {queue}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Детальний аналіз черги
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-lg ${
              info.isOffNow
                ? "bg-chart-4/10 text-chart-4"
                : "bg-chart-2/10 text-chart-2"
            }`}
          >
            <Power className="size-5" />
            {info.isOffNow ? "OFF" : "ON"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {/* Online Hours */}
            <div className="bg-chart-2/15 border border-chart-2/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap
                  className="w-4 h-4"
                  style={{ color: "hsl(var(--chart-2))" }}
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  Hours Online
                </p>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--chart-2))" }}
              >
                {info.hoursOn}h
              </p>
            </div>

            {/* Offline Hours */}
            <div className="bg-chart-4/15 border border-chart-4/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Power
                  className="w-4 h-4"
                  style={{ color: "hsl(var(--chart-4))" }}
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  Hours Offline
                </p>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--chart-4))" }}
              >
                {info.hoursOff}h
              </p>
            </div>

            {/* Outages */}
            <div className="bg-destructive/15 border border-destructive/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="text-xs font-semibold text-muted-foreground">
                  Outages
                </p>
              </div>
              <p className="text-2xl font-bold text-destructive">
                {info.outagesCount}
              </p>
            </div>

            {/* Uptime % */}
            <div className="bg-accent/15 border border-accent/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className="w-4 h-4"
                  style={{ color: "hsl(var(--accent))" }}
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  Uptime
                </p>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "hsl(var(--accent))" }}
              >
                {onPercentage}%
              </p>
            </div>
          </div>

          {info.nextEvent ? (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Наступна подія:
                  </p>

                  <p className="text-lg font-bold text-primary">
                    {info.nextEvent.type.toUpperCase()} in{" "}
                    {info.nextEvent.inMinutes} minutes
                  </p>

                  <CountdownTimer
                    remainingTime={info.nextEvent.inMinutes}
                    onComplete={() => {
                      fetchData();
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Наступна подія:
                  </p>

                  <p className="text-lg font-bold text-primary">- </p>
                </div>
              </div>
            </div>
          )}

          {/* Hours Comparison Chart */}
          <div className="bg-secondary/5 border border-border rounded-xl p-6 col-span-2">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Hours Distribution
            </h4>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
