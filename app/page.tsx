import Schedule from "@/components/Schedule";
import StatsOverview from "@/components/StatsOverview";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center font-sans min-h-screen p-4 max-w-7xl mx-auto">
      <StatsOverview />

      <Schedule />
    </div>
  );
}
