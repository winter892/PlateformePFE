import React from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  LogOut,
  BarChart3
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      path: "/IndexAdmin",
      name: "Tableau de bord",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: "/comptes",
      name: "Comptes",
      icon: <Users className="w-5 h-5" />
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
    <div className="bg-dashboard-sidebar w-64 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-5 border-b border-indigo-800">
        <h1 className="text-white text-xl font-semibold">Gestion des Projets</h1>
      </div>
      
      <div className="flex flex-col gap-1 py-5">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={sidebar-link ${location.pathname === item.path ? 'active' : ''}}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-0 w-full border-t border-violet-100 p-4">
      <button
        className="flex items-center w-full py-2 px-3 text-sm text-balck-600 hover:bg-red-50 rounded-lg transition-colors"
        onClick={() => navigate("/login")}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </button>
      </div>
    </div>
  );
};

export default Sidebar;