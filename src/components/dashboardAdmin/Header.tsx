
import React from "react";

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
    </header>
  );
};

export default Header;
