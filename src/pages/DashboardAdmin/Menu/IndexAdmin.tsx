import React, { useEffect, useState } from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import StatCard from "../../../components/dashboardAdmin/StatCard";
import { getAdminStats } from "../../../services/userService";

interface AdminStats {
  totalEtudiants: number;
  totalEncadrants: number;
  totalDepartements: number;
  totalFilieres: number;
  projetsEnCours: number;
  projetsTermines: number;
}

const IndexAdmin = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalEtudiants: 0,
    totalEncadrants: 0,
    totalDepartements: 0,
    totalFilieres: 0,
    projetsEnCours: 0,
    projetsTermines: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Header title="Tableau de Bord" />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Tableau de Bord" />
      
    

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Étudiants" 
          value={stats.totalEtudiants} 
          type="students" 
          trend="up"
          percentage={12.5}
        />
        <StatCard 
          title="Encadrants" 
          value={stats.totalEncadrants} 
          type="supervisors" 
          trend="stable"
        />
        <StatCard 
          title="Départements" 
          value={stats.totalDepartements} 
          type="departments" 
          trend="up"
          percentage={5.2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Filières" 
          value={stats.totalFilieres} 
          type="filieres" 
          trend="up"
          percentage={8.3}
        />
        <StatCard 
          title="Projets en Cours" 
          value={stats.projetsEnCours} 
          type="ongoing" 
          trend="up"
          percentage={15.7}
        />
        <StatCard 
          title="Projets Terminés" 
          value={stats.projetsTermines} 
          type="completed" 
          trend="down"
          percentage={3.2}
        />
      </div>

      
    </Layout>
  );
};

export default IndexAdmin;