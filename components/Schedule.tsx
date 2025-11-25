"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Schedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/schedule", { cache: "no-store" });

      setData(await res.json());
      setIsLoading(false);
    };

    getData(); // fetch immediately
    const interval = setInterval(getData, 1800000); // 30min

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="p-5 w-full">
        <Spinner className="mx-auto size-6" />
      </div>
    );
  }

  return <pre className="m-5">{JSON.stringify(data, null, 2)}</pre>;
}
