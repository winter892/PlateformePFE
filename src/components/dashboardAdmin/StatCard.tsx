// StatCard.tsx
import React from "react";
import { Users, Clock, CheckSquare, User, Building, BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  type: "students" | "supervisors" | "ongoing" | "completed" | "departments" | "filieres";
  trend?: "up" | "down" | "stable";
  percentage?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type, trend, percentage }) => {
  const getIconAndBg = () => {
    const baseStyles = {
      students: {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100",
        text: "text-blue-600",
        icon: <Users className="w-6 h-6" />,
        border: "border-l-4 border-blue-500",
      },
      supervisors: {
        bg: "bg-gradient-to-br from-green-50 to-green-100",
        text: "text-green-600",
        icon: <User className="w-6 h-6" />,
        border: "border-l-4 border-green-500",
      },
      ongoing: {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100",
        text: "text-purple-600",
        icon: <Clock className="w-6 h-6" />,
        border: "border-l-4 border-purple-500",
      },
      completed: {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100",
        text: "text-orange-600",
        icon: <CheckSquare className="w-6 h-6" />,
        border: "border-l-4 border-orange-500",
      },
      departments: {
        bg: "bg-gradient-to-br from-red-50 to-red-100",
        text: "text-red-600",
        icon: <Building className="w-6 h-6" />,
        border: "border-l-4 border-red-500",
      },
      filieres: {
        bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
        text: "text-yellow-600",
        icon: <BookOpen className="w-6 h-6" />,
        border: "border-l-4 border-yellow-500",
      },
    };

    return baseStyles[type] || baseStyles.students;
  };

  const { bg, text, icon, border } = getIconAndBg();

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "stable":
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${bg} p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${border} hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${text} bg-white bg-opacity-50`}>
          {icon}
        </div>
      </div>
      
      {(trend && percentage) && (
        <div className="flex items-center mt-4 text-sm">
          <span className="flex items-center mr-2">
            {getTrendIcon()}
          </span>
          <span className={trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}>
            {percentage}% {trend === "up" ? "augmentation" : trend === "down" ? "diminution" : "stable"}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;