"use client";

import { useEffect, useState, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { analyzeQueue, getScheduleData } from "@/utils/schedule-api";
import { GROUP_NAMES } from "@/utils/groupNames";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QueueStatus, { QueueInfo } from "@/components/QueueStatus";
import { AnalyzedData, ScheduleRawData } from "@/types";

export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<ScheduleRawData | null>(null);
  const [selected, setSelected] = useState("1.1");

  useEffect(() => {
    getScheduleData().then((data) => {
      setData(data);
      setIsLoading(false);
    });

    const interval = setInterval(getScheduleData, 1800000); // 30min

    return () => clearInterval(interval);
  }, []);

  const analyzedData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return {};

    return GROUP_NAMES.reduce((acc, group) => {
      acc[group] = analyzeQueue(data, group);

      return acc;
    }, {} as Record<string, ReturnType<typeof analyzeQueue>>);
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-5 w-full">
        <Spinner className="mx-auto size-6" />
      </div>
    );
  }

  if (!data) return <div>No data</div>;

  console.log("analyzedData", analyzedData);

  return (
    <div className="w-full">
      <h1 className="mb-5">{data.title}</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {GROUP_NAMES.map((group, index) => {
          return (
            <Button
              variant="ghost"
              key={index}
              onClick={() => {
                setSelected(group);
              }}
              className={cn({
                "bg-destructive": analyzedData[group]?.isOffNow,
                "bg-green-500": !analyzedData[group]?.isOffNow,
                "ring-2": selected === group,
              })}
            >
              {group}
            </Button>
          );
        })}
      </div>

      <pre>{JSON.stringify(analyzedData[selected], null, 2)}</pre>

      <QueueStatus
        className="mb-8"
        info={analyzedData[selected] as QueueInfo}
        queue={selected}
      />

      <div className="mb-8">
        <h2 className="text-2xl font-bold  mb-4">Queue Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(analyzedData).map(([queue, info]) => {
            return (
              <QueueStatus key={queue} queue={queue} info={info as QueueInfo} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
