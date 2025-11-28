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
import { QueueInfo } from "@/types";
import { cn } from "@/lib/utils";
import { formatHours } from "@/utils/formatHours";

export default function QueueDetailCard({
  queue,
  info,
}: {
  queue: string;
  info: QueueInfo;
}) {
  const totalHours = info.hoursOn + info.hoursOff;
  const onPercentage = ((info.hoursOn / totalHours) * 100).toFixed(1);

  const hourlyData = [
    { name: "Виключено", value: info.hoursOff, fill: "var(--chart-4)" },
    { name: "Online", value: info.hoursOn, fill: "var(--chart-2)" },
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
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-lg",
              {
                "bg-error/10 text-error/90": info.isOffNow,
                "bg-success/10 text-success/90": !info.isOffNow,
              }
            )}
          >
            <Power className="size-5" />
            {info.isOffNow ? "OFF" : "ON"}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 space-y-8">
        <div className="grid md:grid-cols-2 md:grid-rows-2 gap-4">
          <div className="row-span-2">
            {info.nextEvent ? (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 h-full">
                <div className="flex flex-col gap-3 h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center text-sm font-semibold text-muted-foreground mb-4 flex-wrap">
                      <Clock className="size-5 text-primary mr-2" />
                      <span className="font-normal">Наступна подія:</span>

                      <span
                        className={cn("ml-1 text-lg font-bold", {
                          "text-success": info.nextEvent.type === "on",
                          "text-error": info.nextEvent.type === "off",
                        })}
                      >
                        {`${
                          info.nextEvent.type === "on"
                            ? "включення"
                            : "вимкнення"
                        } через ${info.nextEvent.inMinutes} хв.`}
                      </span>
                    </div>

                    <CountdownTimer
                      className="h-full"
                      event={info.nextEvent.type}
                      remainingTime={info.nextEvent.inMinutes}
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

                    <p className="text-lg font-bold text-primary">-</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="row-span-2 grid grid-cols-1 gap-y-4">
            <div className="md:min-h-[100px] *:h-full row-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              <div className="bg-success/5 border border-success/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 flex-col justify-center lg:flex-row">
                  <Zap className="size-4 text-success shrink-0" />

                  <p className="text-xs font-semibold text-muted-foreground text-center lg:text-left">
                    Світло включено
                  </p>
                </div>

                <p className="font-bold text-success text-center">
                  {formatHours(info.hoursOn)}
                </p>
              </div>

              {/* Offline Hours */}
              <div className="bg-error/15 border border-error/30 rounded-xl p-4 ">
                <div className="flex items-center gap-2 mb-2">
                  <Power className="size-4 text-error shrink-0" />

                  <p className="text-xs font-semibold text-muted-foreground text-center lg:text-left">
                    Світло виключено
                  </p>
                </div>

                <p className="font-bold text-error text-center">
                  {formatHours(info.hoursOff)}
                </p>
              </div>

              {/* Outages */}
              <div className="bg-destructive/15 border border-destructive/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="size-4 text-destructive shrink-0" />

                  <p className="text-xs font-semibold text-muted-foreground text-center lg:text-left">
                    Відключення
                  </p>
                </div>
                <p className="text-center text-3xl font-bold text-destructive">
                  {info.outagesCount}
                </p>
              </div>

              {/* Uptime % */}
              <div className="bg-accent/15 border border-accent/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-4 text-accent shrink-0" />

                  <p className="text-xs font-semibold text-muted-foreground text-center lg:text-left">
                    Час роботи
                  </p>
                </div>

                <p className="text-2xl font-bold text-center text-accent">
                  {onPercentage}%
                </p>
              </div>
            </div>

            <div className="row-span-1 bg-secondary/5 border border-border rounded-xl p-4 col-span-2">
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Розподіл годин
              </h4>

              <ResponsiveContainer
                width="100%"
                className="outline-0"
                height={150}
              >
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
