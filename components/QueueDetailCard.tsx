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
  TooltipContentProps,
} from "recharts";
import CountdownTimer from "./Countdown";
import { QueueInfo } from "@/types";
import { cn } from "@/lib/utils";
import { formatHours } from "@/utils/formatHours";

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  console.log(payload);

  if (active && payload && payload.length) {
    const type = payload[0].payload.type;

    return (
      <div className="bg-card p-4 rounded-md">
        {/* <p className="font-bold">{`${label} : ${payload[0].value}`} год.</p> */}
        <p className="font-bold">
          <span
            className={cn({
              "text-success": type === "on",
              "text-destructive": type === "off",
            })}
          >
            {label}:
          </span>
          <span className="mx-1.5">{payload[0].value}</span>
          год.
        </p>
      </div>
    );
  }

  return null;
}

export default function QueueDetailCard({
  queue,
  info,
}: {
  queue: string;
  info: QueueInfo;
}) {
  const totalHours = info.hoursOn + info.hoursOff;
  const onPercentage = ((info.hoursOn / totalHours) * 100).toFixed(1);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentHourProgress = currentHour + currentMinute / 60; // 0-24 range

  const hourlyData = [
    {
      type: "off",
      name: "Без світла",
      value: info.hoursOff,
      fill: "var(--error)",
    },
    {
      type: "on",
      name: "Зі світлом",
      value: info.hoursOn,
      fill: "var(--success)",
    },
  ];

  const generateTimeline = () => {
    const timeline = [];
    const hoursPerSegment = 24 / 12; // Divide 24 hours into 12 segments
    const onSegments = Math.round((info.hoursOn / 24) * 12);

    // Create alternating segments of on/off
    for (let i = 0; i < 12; i++) {
      const isOn = i < onSegments;

      timeline.push({
        hour: `${i * 2}:00`,
        status: isOn ? 1 : 0,
        label: isOn ? "ON" : "OFF",
        color: isOn ? "var(--success)" : "var(--error)",
      });
    }
    return timeline;
  };

  const timeline = generateTimeline();

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
        <div className="grid md:grid-cols-2  gap-4">
          <div className="row-span-2">
            <div>
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
                          }`}
                        </span>
                      </div>

                      <CountdownTimer
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

              <div className="bg-secondary/5 border border-border rounded-xl p-6">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  24-Hour Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex gap-1 h-12 relative">
                    {timeline.map((segment, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-lg transition-opacity hover:opacity-80 cursor-pointer relative group"
                        style={{
                          backgroundColor: segment.color,
                          opacity: segment.status ? 1 : 0.4,
                        }}
                        title={`${segment.hour} - ${segment.label}`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-card border border-border px-2 py-1 rounded">
                          {segment.hour}
                        </div>
                      </div>
                    ))}

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg rounded-full"
                      style={{
                        left: `${(currentHourProgress / 24) * 100}%`,
                        height: "calc(100% + 8px)",
                        top: "-4px",
                      }}
                      title={`Current time: ${String(currentHour).padStart(
                        2,
                        "0"
                      )}:${String(currentMinute).padStart(2, "0")}`}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-8">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                  </div>
                </div>
              </div>
            </div>
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
                    Відключень
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
                    Доступність
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
                className="*:outline-none focus:outline-none"
                height={150}
              >
                <BarChart data={hourlyData} className="*:outline-none!">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    className="*:outline-none"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    className="*:outline-none focus:outline-none"
                  />
                  <YAxis
                    domain={[0, 24]}
                    stroke="var(--muted-foreground)"
                    className="*:outline-none focus:outline-none"
                  />

                  <Tooltip content={CustomTooltip} />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    className="*:outline-none focus:outline-none"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
