// StatCard.tsx
import React from "react";
import { Users, Clock, CheckSquare, User, Building, BookOpen } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  type: "students" | "supervisors" | "ongoing" | "completed" | "departments" | "filieres";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, type }) => {
  const getIconAndBg = () => {
    switch (type) {
      case "students":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: <Users className="w-7 h-7" />,
        };
      case "supervisors":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          icon: <User className="w-7 h-7" />,
        };
      case "ongoing":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          icon: <Clock className="w-7 h-7" />,
        };
      case "completed":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          icon: <CheckSquare className="w-7 h-7" />,
        };
      case "departments":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          icon: <Building className="w-7 h-7" />,
        };
      case "filieres":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          icon: <BookOpen className="w-7 h-7" />,
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          icon: <Users className="w-7 h-7" />,
        };
    }
  };

  const { bg, text, icon } = getIconAndBg();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-3 rounded-full ${bg} ${text}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;