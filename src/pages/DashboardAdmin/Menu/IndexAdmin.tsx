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
          <p>Chargement des statistiques...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Tableau de Bord" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Étudiants" 
          value={stats.totalEtudiants} 
          type="students" 
        />
        <StatCard 
          title="Encadrants" 
          value={stats.totalEncadrants} 
          type="supervisors" 
        />
        <StatCard 
          title="Départements" 
          value={stats.totalDepartements} 
          type="departments" 
        />
        <StatCard 
          title="Filières" 
          value={stats.totalFilieres} 
          type="filieres" 
        />
        <StatCard 
          title="Projets en Cours" 
          value={stats.projetsEnCours} 
          type="ongoing" 
        />
        <StatCard 
          title="Projets Terminés" 
          value={stats.projetsTermines} 
          type="completed" 
        />
      </div>
    </Layout>
  );
};

export default IndexAdmin;