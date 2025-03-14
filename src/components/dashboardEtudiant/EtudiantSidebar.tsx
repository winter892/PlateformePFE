import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FileText, Bell, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const EtudiantSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/IndexEtudiant", color: "from-green-400 to-green-600" },
    { icon: CheckSquare, label: "Tâches", path: "/tasks", color: "from-green-400 to-green-600" },
    { icon: Bell, label: "Notifications", path: "/EtudiantNotifications", color: "from-green-400 to-green-600" },
  ];

  const bottomMenuItems = [
    { icon: User, label: "Profile", path: "/Etudiantprofile", color: "from-green-400 to-green-600" },
  ];

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { 
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Fonction pour la déconnexion
  const handleLogout = () => {
    // Ajouter la logique de déconnexion ici, par exemple réinitialiser l'état ou supprimer le token
    navigate("/login"); // Redirige vers la page de connexion après déconnexion
  };

  return (
    <motion.aside 
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="h-full px-3 py-4 flex flex-col">
        <div className="flex items-center mb-8 pl-2">
          <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">S</div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">StudyTrack</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.path}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-300",
                  location.pathname === item.path 
                    ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-l-4 border-green-500" 
                    : "text-gray-600 hover:bg-green-50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3",
                  location.pathname === item.path ? "text-green-500" : "text-gray-500"
                )} />
                <span className="font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          {bottomMenuItems.map((item, index) => (
            <motion.div 
              key={item.path}
              variants={itemVariants}
              transition={{ delay: (index + menuItems.length) * 0.1 }}
            >
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-300",
                  location.pathname === item.path 
                    ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-l-4 border-green-500"
                    : "text-gray-600 hover:bg-green-50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mr-3",
                  location.pathname === item.path ? "text-green-500" : "text-gray-500"
                )} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bouton de déconnexion */}
        <div className="absolute bottom-4 left-0 right-0 mx-3 border-t border-gray-200 p-4">
          <button
            className="flex items-center justify-center w-full py-2 px-3 text-white bg-gradient-to-r from-green-700 to-green-500 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default EtudiantSidebar;
