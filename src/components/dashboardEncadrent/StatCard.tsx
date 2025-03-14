import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
  trendValue?: number;
  trendDirection?: "up" | "down" | "neutral";
}

const StatCard = ({
  title,
  value,
  icon,
  className,
  trendValue,
  trendDirection,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-violet-100 bg-white shadow-md p-5 flex flex-col justify-between",
        "transition-all duration-300 hover:shadow-lg", // Ajoute une légère animation au survol
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="text-violet-500">{icon}</div>
      </div>

      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>

        {trendDirection && trendValue && (
          <div
            className={cn(
              "text-xs font-medium flex items-center",
              trendDirection === "up"
                ? "text-green-600"
                : trendDirection === "down"
                ? "text-red-600"
                : "text-gray-500"
            )}
          >
            <span className="mr-1">
              {trendDirection === "up" ? "▲" : trendDirection === "down" ? "▼" : "→"}
            </span>
            {trendValue}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
