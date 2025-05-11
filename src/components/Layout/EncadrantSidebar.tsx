import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BellRing, 
  BarChart2,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onProfileClick?: () => void;
}

const EncadrentSidebar: React.FC<SidebarProps> = ({ onProfileClick }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/IndexEncadrant' },
    { icon: Users, label: 'Groupes', path: '/groups' },
    { icon: BellRing, label: 'Notifications', path: '/EncadrantNotifications' },
    { icon: BarChart2, label: 'Statistiques', path: '/statistics' },
  ];

  return (
    <div className="w-64 h-full fixed bg-gradient-to-b from-purple-600 to-purple-800 text-white shadow-lg">
      {/* Titre du sidebar */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Encadrement Academique</h1>
        <p className="text-sm opacity-80">Plateforme d'encadrement</p>
      </div>
      
      {/* Liens du menu */}
      <div className="mt-6 overflow-y-auto">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                aria-label={item.label}
                className={cn(
                  "flex items-center py-3 px-6 text-white hover:bg-purple-500 transition-colors rounded-lg",
                  isActive(item.path) && "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-semibold"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Profil et déconnexion */}
      <div className="absolute bottom-0 w-full border-t border-purple-700 p-4">
        {/* Bouton Profil */}
        <button
          onClick={() => navigate("/EncadrantProfile")}
          className="flex items-center w-full text-left p-2 rounded-lg hover:bg-purple-500 transition duration-300"
        >
          <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium">M.OUTANOUTE</p>
            <p className="text-xs opacity-80">Encadrant</p>
          </div>
        </button>

        {/* Bouton Déconnexion avec un dégradé fancy */}
        <button
          className="flex items-center w-full py-2 px-3 text-sm text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:from-purple-300 hover:via-purple-400 hover:to-purple-500 rounded-lg transition-all duration-300 ease-out"
          onClick={() => navigate("/")}
          aria-label="Déconnexion"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default EncadrentSidebar;