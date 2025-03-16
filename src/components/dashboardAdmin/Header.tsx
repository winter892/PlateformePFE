
import React from "react";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-black-600 mb-2">{title}</h1>
        <p className="text-gray-500">Bienvenue dans votre espace d'administration</p>
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;
