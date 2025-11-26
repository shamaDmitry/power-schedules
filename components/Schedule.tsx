"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { analyzeQueue } from "@/utils/test";
import { GROUP_NAMES } from "@/utils/groupNames";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<Record<string, string[]>>([]);
  const [selected, setSelected] = useState("1.1");
  const [queueData, setQueueData] = useState(null);

  const [analyzedData, setAnalyzedData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/schedule", { cache: "no-store" });
      const data = await res.json();
      setData(data.schedule);
      setIsLoading(false);
    };

    getData(); // fetch immediately
    const interval = setInterval(getData, 1800000); // 30min

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-5 w-full">
        <Spinner className="mx-auto size-6" />
      </div>
    );
  }

  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1 className="mb-5">{data.title}</h1>

      {GROUP_NAMES.map((group, index) => {
        return (
          <Button
            key={index}
            onClick={() => {
              setSelected(group);
              setQueueData(analyzeQueue(data, group));
            }}
            disabled={selected === group}
            className={cn({
              "text-red-500": queueData?.isOffNow,
            })}
          >
            {group}
          </Button>
        );
      })}

      <pre>{JSON.stringify(queueData, null, 2)}</pre>

      {/* <div>
        {Object.entries(data).map(([key, value]) => {
          if (key === "title") return null;

          return (
            <div key={key} className="flex items-center gap-5">
              <h2>{key}</h2>
              <p className="flex gap-4">
                {value.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
