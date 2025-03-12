
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Sidebar: React.FC<SidebarProps> = ({ onProfileClick }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
    { icon: Users, label: 'Groupes', path: '/groups' },
    { icon: BellRing, label: 'Notifications', path: '/notifications' },
    { icon: BarChart2, label: 'Statistiques', path: '/statistics' },
  ];

  return (
    <div className="w-64 bg-white border-r border-violet-100 fixed h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-violet-900">Edura</h1>
        <p className="text-sm text-violet-500">Plateforme d'encadrement</p>
      </div>
      
      <div className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center py-3 px-6 text-violet-800 hover:bg-violet-50 transition-colors",
                  isActive(item.path) && "bg-violet-100 text-violet-900 font-medium border-r-4 border-violet-600"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-full border-t border-violet-100 p-4">
        <div className="flex items-center mb-4 cursor-pointer" onClick={onProfileClick}>
          <div className="bg-violet-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-900">Dr. Jean Dupont</p>
            <p className="text-xs text-violet-500">Encadrant</p>
          </div>
        </div>
        
        <button className="flex items-center w-full py-2 px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
