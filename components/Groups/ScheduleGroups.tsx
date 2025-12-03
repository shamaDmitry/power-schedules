"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import GroupSelector from "@/components/Groups/GroupSelector";
import Calendar from "@/components/Groups/Calendar";
import { Button } from "../ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScheduleGroups() {
  const latestHashRef = useRef<string | null>(null); // 👈 Replaced state with ref

  const { data, error, isLoading, mutate } = useSWR("/api/parse", fetcher, {
    // refreshInterval: 60000,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
    onSuccess: (newData) => {
      console.log("newData", newData);

      const currentHash = newData?.updatedHash;
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

  const [group, setGroup] = useState("1");

  // Запит на дозвіл на нотифікації
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // const groupData = {
  //   [`Години для ${group}-ї черги`]: data.parsed.groups[group],
  // };

  return (
    <div className="p-4 max-w-2xl mx-auto">
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
        {/* <GroupSelector group={group} setGroup={setGroup} /> */}
      </div>

      {/* <Calendar groupData={groupData} /> */}

      <div className="text-xs opacity-60 mt-6">
        Оновлено: {data?.lastUpdated}
      </div>
    </div>
  );
}
