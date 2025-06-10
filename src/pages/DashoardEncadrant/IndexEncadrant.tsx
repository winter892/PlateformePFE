import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatCard from '@/components/dashboardEncadrent/StatCard';
import ProjectsChart from '@/components/dashboardEncadrent/ProjectsChart';
import { FolderOpen, Clock, CheckCircle, BarChart2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { getUserById } from '@/services/userService';
import axios from 'axios';

// Configuration Axios
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface EncadrantStats {
  totalGroupes: number;
  totalProjets: number;
  projetsEnCours: number;
  projetsTermines: number;
  progresMoyen: number;
  progressionTrend?: 'up' | 'down' | 'stable';
  groupesTrend?: 'up' | 'down' | 'stable';
}

const IndexEncadrant = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState<EncadrantStats>({
    totalGroupes: 0,
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    progresMoyen: 0,
    progressionTrend: 'stable',
    groupesTrend: 'stable'
  });
  const [loading, setLoading] = useState(true);

  // Fonction pour analyser la tendance
  const analyzeTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  // Fonction pour récupérer les statistiques de l'encadrant
  const fetchEncadrantStats = async (encadrantId: string): Promise<EncadrantStats> => {
    try {
      const response = await api.get(`/dashboard/encadrant/${encadrantId}`);
      const data = response.data || {
        totalGroupes: 0,
        totalProjets: 0,
        projetsEnCours: 0,
        projetsTermines: 0,
        progresMoyen: 0
      };

      // Ici vous pourriez ajouter une logique pour calculer les tendances
      // Par exemple en comparant avec des données précédentes
      return {
        ...data,
        progressionTrend: analyzeTrend(data.progresMoyen, 0), // Remplacez 0 par la valeur précédente si disponible
        groupesTrend: analyzeTrend(data.totalGroupes, 0) // Remplacez 0 par la valeur précédente si disponible
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return {
        totalGroupes: 0,
        totalProjets: 0,
        projetsEnCours: 0,
        projetsTermines: 0,
        progresMoyen: 0,
        progressionTrend: 'stable',
        groupesTrend: 'stable'
      };
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.section-animation');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, index * 100);
    });

    // Fetch user data and stats
    const fetchData = async () => {
      const id = localStorage.getItem('id');
      if (id) {
        try {
          const [userData, statsData] = await Promise.all([
            getUserById(id),
            fetchEncadrantStats(id)
          ]);
          setUserInfo(userData);
          setStats(statsData);
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const handleTeacherClick = () => {
    navigate('/EncadrantProfile');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Fonction pour déterminer l'icône de tendance
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable' | undefined) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout onProfileClick={handleTeacherClick}>
      <div className="mb-8 section-animation">
        <h1 className="text-2xl font-semibold text-violet-900 mb-1">
          Bienvenue, {' '}
          <span 
            className="cursor-pointer hover:text-violet-700 underline" 
            onClick={handleTeacherClick}
          >
            {userInfo ? `${userInfo.prenom} ${userInfo.nom}` : 'Professeur'}
          </span>
        </h1>
        <p className="text-violet-500">Tableau de bord de suivi des projets</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 section-animation">
        <StatCard 
          title="Groupes encadrés" 
          value={stats.totalGroupes} 
          icon={<Users size={24} className="text-blue-500" />}
          trend={stats.groupesTrend}
          additionalInfo={
            stats.groupesTrend && (
              <span className="flex items-center ml-2">
                {renderTrendIcon(stats.groupesTrend)}
              </span>
            )
          }
        />
        
        <StatCard 
          title="Total projets" 
          value={stats.totalProjets} 
          icon={<FolderOpen size={24} className="text-purple-500" />}
        />
        
        <StatCard 
          title="Projets en cours" 
          value={stats.projetsEnCours} 
          icon={<Clock size={24} className="text-yellow-500" />}
        />
        
        <StatCard 
          title="Projets terminés" 
          value={stats.projetsTermines} 
          icon={<CheckCircle size={24} className="text-green-500" />}
        />
      </div>

      {/* Graphique de progression */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 section-animation">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Progression moyenne des projets</h2>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-violet-700 mr-2">
              {stats.progresMoyen.toFixed(1)}%
            </span>
            {renderTrendIcon(stats.progressionTrend)}
          </div>
        </div>
        <ProjectsChart progress={stats.progresMoyen} />
      </div>

      {/* Section projets récents (optionnelle) */}
      <div className="bg-white rounded-lg shadow p-6 section-animation">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Aperçu des projets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-700">En cours</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.projetsEnCours}</p>
            <p className="text-sm text-gray-500">Projets actifs</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-700">Terminés</h3>
            <p className="text-3xl font-bold text-green-500">{stats.projetsTermines}</p>
            <p className="text-sm text-gray-500">Projets finalisés</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IndexEncadrant;