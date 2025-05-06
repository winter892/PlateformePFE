
import React from "react";
import { Users, Clock, CheckSquare, User } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  type: "students" | "supervisors" | "ongoing" | "completed";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type }) => {
  const getIconAndBg = () => {
    switch (type) {
      case "students":
        return {
          bg: "bg-dashboard-blue",
          icon: <Users className="w-7 h-7" />,
          defaultValue: 1265
        };
      case "supervisors":
        return {
          bg: "bg-dashboard-green",
          icon: <User className="w-7 h-7" />,
          defaultValue: 40
        };
      case "ongoing":
        return {
          bg: "bg-dashboard-purple",
          icon: <Clock className="w-7 h-7" />,
          defaultValue: 615
        };
      case "completed":
        return {
          bg: "bg-dashboard-orange",
          icon: <CheckSquare className="w-7 h-7" />,
          defaultValue: 40
        };
      default:
        return {
          bg: "bg-blue-500",
          icon: <Users className="w-7 h-7" />,
          
        };
    }
  };

  const { bg, icon,defaultValue } = getIconAndBg();

  return (
    <div className="stats-card animate-slide-in">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className={`stats-icon ${bg}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-4xl font-bold">{defaultValue}</p>
      </div>
    </div>
  );
};

export default StatCard;
