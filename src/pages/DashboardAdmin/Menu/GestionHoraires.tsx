
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Power } from "lucide-react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";

const HoraireCard = ({ 
  title, 
  icon, 
  path,
  bgColor = "bg-white"
}: { 
  title: string; 
  icon: React.ReactNode;
  path: string;
  bgColor?: string;
}) => {
  return (
    <Link 
      to={path} 
      className={`${bgColor} rounded-lg shadow-sm p-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-200 gap-4 min-h-[200px]`}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-center">{title}</h3>
    </Link>
  );
};

const GestionHoraires = () => {
  return (
    <Layout>
      
      <Header title="Gestion des horaires" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <HoraireCard 
          title="Planning des soutenances" 
          icon={<Calendar className="w-8 h-8" />}
          path="/gestion-horaires/soutenances"
        />
        <HoraireCard 
          title="Planning des dates limites dépôt rapport" 
          icon={<Clock className="w-8 h-8" />}
          path="/gestion-horaires/dates-limites"
        />
        <HoraireCard 
          title="Activer/Désactiver la plateforme" 
          icon={<Power className="w-8 h-8" />}
          path="/gestion-horaires/activation"
        />
      </div>
    </Layout>
  );
};

export default GestionHoraires;
