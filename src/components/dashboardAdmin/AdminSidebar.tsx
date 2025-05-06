import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  LogOut,
  BarChart3
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      path: "/IndexAdmin",
      name: "Tableau de bord",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
   
    {
      path: "/gestion-horaires",
      name: "Gestion des horaires",
      icon: <Clock className="w-5 h-5" />
    },
    {
      path: "/statistiques",
      name: "Statistiques",
      icon: <BarChart3 className="w-5 h-5" />
    }
  
  ];

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-600 w-64 h-screen flex flex-col fixed left-0 top-0 text-white shadow-lg">
      {/* Titre du sidebar */}
      <div className="p-5 border-b border-blue-800">
        <h1 className="text-white text-xl font-semibold">Espace Administrative </h1>
      </div>
      
      {/* Liens du menu */}
      <div className="flex flex-col gap-2 py-5 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 py-2 px-4 text-white hover:bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg transition-all duration-300 
              ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-800 to-blue-600' : ''}`}
            aria-label={item.name}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Bouton Déconnexion */}
      <div className="p-4 border-t border-blue-500 mt-auto">
        <button
          className="flex items-center w-full py-2 px-4 text-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-700 hover:to-blue-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={() => navigate("/")}
          aria-label="Déconnexion"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;