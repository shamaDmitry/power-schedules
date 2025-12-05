"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/store/useQueueStore";
import { RefreshCw } from "lucide-react";
import { Heading } from "@/components/typography/Heading";

const Header = () => {
  const { loading } = useQueueStore();

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
      </div>
    </header>
  );
};

export default Header;
