"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/store/useQueueStore";
import { RefreshCw } from "lucide-react";
import { Heading } from "@/components/typography/Heading";

const Header = () => {
  const { loading, fetchData } = useQueueStore();

  return (
    <header className="max-w-7xl mx-auto w-full p-4 flex items-center gap-5 justify-between flex-col sm:flex-row">
      <div>
        <Heading className="text-4xl font-bold mb-2">
          Графіки відключень електроенергії в м. Запоріжжя
        </Heading>

        <p className="">Моніторинг 12 черг електроенергії</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Button onClick={fetchData} disabled={loading} className="min-w-40">
          {loading && <RefreshCw className="animate-spin" />}

          <span className="font-semibold">Оновити данні</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
