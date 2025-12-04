"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import GroupSelector from "@/components/Groups/GroupSelector";
import { Button } from "../ui/button";
import { useQueueStore } from "@/store/useQueueStore";
import { DaySchedule } from "@/lib/schedule-parser";
import { analyzeQueue } from "@/utils/schedule-api";
import QueueStatus from "../QueueStatus";
import { QueueInfo, ScheduleNumbers } from "@/types";
import { GROUP_NAMES } from "@/utils/groupNames";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScheduleGroups() {
  const latestHashRef = useRef<string | null>(null);
  const { fetchData } = useQueueStore();

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 1800000); // 30min

    return () => clearInterval(interval);
  }, [fetchData]);

  const { data, error, isLoading, mutate } = useSWR<{
    lastUpdated: string;
    pageHash: string;
    schedule: DaySchedule[];
  }>("/api/parse", fetcher, {
    // refreshInterval: 60000,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
    onSuccess: (newData) => {
      const currentHash = newData?.pageHash;
      const prevHash = latestHashRef.current;

      if (currentHash && prevHash && currentHash !== prevHash) {
        new Notification("Графік оновлено!", {
          body: "ZOE опублікували нові дані.",
        });
      }

      if (currentHash) {
        latestHashRef.current = currentHash;
      }
    },
  });

  const API_KEY = "/api/check-updates";

  const {
    data: updates,
    error: updatesError,
    isLoading: updatesLoading,
    mutate: mutateUpdates,
  } = useSWR(API_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
  });

  const [group, setGroup] = useState("1.1");
  const [date, setDate] = useState("2024-12-04");

  // const currentSchedule = data?.schedule.filter((item) => {
  //   return item.date === date;
  // });

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // const analyzedData = analyzeQueue(currentSchedule[0].entries, group);

  // const analyzed = GROUP_NAMES.reduce((acc, group) => {
  //   acc[group] = analyzeQueue(currentSchedule, group);

  //   return acc;
  // }, {} as { [key in ScheduleNumbers]: QueueInfo });

  console.log("data", data);

  return (
    <div className="flex flex-col font-sans min-h-screen p-4 max-w-7xl mx-auto">
      <div className="flex gap-5">
        <Button onClick={() => mutate()} disabled={isLoading} className="mb-5">
          {isLoading ? "Parsing..." : "Parse Data"}
        </Button>

        <Button
          variant={"secondary"}
          onClick={() => mutateUpdates()}
          disabled={updatesLoading}
          className="mb-5"
        >
          {updatesLoading ? "Checking..." : "Check Data"}
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Графік відключень</h1>

      <div className="mt-4">
        <GroupSelector group={group} setGroup={setGroup} />
      </div>

      <div className="text-xs opacity-60 mt-6">
        Оновлено: {data?.lastUpdated}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(analyzed ?? {}).map(([queue, info]) => {
          return (
            <QueueStatus key={queue} queue={queue} info={info as QueueInfo} />
          );
        })}
      </div> */}

      {/* <pre>{JSON.stringify(analyzed, null, 2)}</pre> */}
    </div>
  );
}
