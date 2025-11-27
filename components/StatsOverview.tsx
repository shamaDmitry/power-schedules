"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQueueStore } from "@/store/useQueueStore";
import { Activity, AlertCircle, Zap, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalQueues: number;
    activeQueues: number;
    inactiveQueues: number;
    totalOutages: number;
  };
}

export default function StatsOverview() {
  const { stats } = useQueueStore();
  if (!stats) return null;

  console.log("stats", stats);

  const statItems = [
    {
      label: "Кількість черг",
      value: stats.totalQueues,
      icon: Zap,
      colorClass: "bg-chart-1/20 text-chart-1",
    },
    {
      label: "Світло є (черги)",
      value: stats.activeQueues,
      icon: Activity,
      colorClass: "bg-chart-1/20 text-chart-1",
    },
    {
      label: "Світла немає (черги)",
      value: stats.inactiveQueues,
      icon: AlertCircle,
      colorClass: "bg-chart-2/20 text-chart-2",
    },
    {
      label: "Всього відключень за день",
      value: stats.totalOutages,
      icon: TrendingUp,
      colorClass: "bg-chart-3/20 text-chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-5 justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>

                <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
