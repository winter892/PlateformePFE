
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
  trendValue?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
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
    <div className={cn("dashboard-card p-5 card-hover", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="stat-label">{title}</h3>
        <div className="text-violet-500">{icon}</div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="stat-number">{value}</div>
        
        {trendDirection && trendValue && (
          <div className={cn(
            "text-xs font-medium flex items-center",
            trendDirection === 'up' ? 'text-green-600' : 
            trendDirection === 'down' ? 'text-red-600' : 
            'text-gray-500'
          )}>
            <span className="mr-1">
              {trendDirection === 'up' ? '↑' : 
               trendDirection === 'down' ? '↓' : 
               '→'}
            </span>
            {trendValue}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
