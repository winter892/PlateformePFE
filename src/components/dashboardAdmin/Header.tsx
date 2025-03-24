
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const location = useLocation();
      const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center mb-8">
      
      <div>
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">{title}</h1>
        <p className="text-gray-500">Bienvenue dans votre espace d'administration</p>
      </div>
     
      
    </header>
  );
};

export default Header;
