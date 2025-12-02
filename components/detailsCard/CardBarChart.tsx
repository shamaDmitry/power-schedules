"use client";

import { cn } from "@/lib/utils";
import { QueueInfo } from "@/types";
import { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface CardBarChartProps {
  info: QueueInfo;
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const type = payload[0].payload.type;

    return (
      <div className="bg-card p-4 rounded-md">
        <p className="font-bold">
          <span
            className={cn({
              "text-success": type === "on",
              "text-error": type === "off",
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

const CardBarChart: FC<CardBarChartProps> = ({ info }) => {
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

  return (
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
  );
};

export default CardBarChart;
