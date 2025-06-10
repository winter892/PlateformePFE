import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

interface ProjectStats {
  id: number;
  title: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'problem';
  groupName: string;
}

interface GroupStats {
  id: number;
  name: string;
  projectCount: number;
  averageProgress: number;
}

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectStats[]>([]);
  const [groups, setGroups] = useState<GroupStats[]>([]);
  const [filter, setFilter] = useState({});

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const encadrantId = localStorage.getItem('id');
        if (!encadrantId) return;

        const [projectsRes, groupsRes] = await Promise.all([
          api.get(`/projects/encadrant/${encadrantId}`),
          api.get(`/groups/encadrant/${encadrantId}`)
        ]);

        setProjects(projectsRes.data || []);
        setGroups(groupsRes.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    // Données pour le diagramme circulaire (statut des projets)
    const statusCounts = {
      completed: projects.filter(p => p.status === 'completed').length,
      in_progress: projects.filter(p => p.status === 'in_progress').length,
      problem: projects.filter(p => p.status === 'problem').length,
      not_started: projects.filter(p => p.status === 'not_started').length
    };

    const pieData = [
      { name: 'Terminés', value: statusCounts.completed, color: '#10B981', icon: <CheckCircle size={16} /> },
      { name: 'En cours', value: statusCounts.in_progress, color: '#3B82F6', icon: <Clock size={16} /> },
      { name: 'Problèmes', value: statusCounts.problem, color: '#EF4444', icon: <AlertCircle size={16} /> },
      { name: 'Non commencés', value: statusCounts.not_started, color: '#9CA3AF', icon: null }
    ];

    // Données pour le diagramme à barres (progression par groupe)
    const barData = groups.map(group => ({
      name: group.name,
      progress: group.averageProgress,
      projectCount: group.projectCount
    }));

    return { pieData, barData };
  };

  const { pieData, barData } = prepareChartData();

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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-violet-900 mb-2">Statistiques des projets</h1>
        <p className="text-violet-500">Analyse des groupes et projets encadrés</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique circulaire - Statut des projets */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4">Répartition des projets par statut</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  outerRadius={80} 
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} projet(s)`, 
                    name
                  ]}
                />
                <Legend 
                  iconType="circle"
                  formatter={(value, entry, index) => (
                    <span className="flex items-center text-sm">
                      {pieData[index].icon && React.cloneElement(pieData[index].icon, { className: "mr-2" })}
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Graphique à barres - Progression par groupe */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4">Progression moyenne par groupe</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'progress' ? `${value}%` : `${value} projet(s)`,
                    name === 'progress' ? 'Progression' : 'Nombre de projets'
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="progress" 
                  name="Progression moyenne" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="projectCount" 
                  name="Nombre de projets" 
                  fill="#D8B4FE" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Résumé statistique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-violet-100 shadow-sm">
          <h3 className="font-medium text-gray-700">Groupes encadrés</h3>
          <p className="text-3xl font-bold text-violet-600">{groups.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-violet-100 shadow-sm">
          <h3 className="font-medium text-gray-700">Projets actifs</h3>
          <p className="text-3xl font-bold text-blue-500">
            {projects.filter(p => p.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-violet-100 shadow-sm">
          <h3 className="font-medium text-gray-700">Progression moyenne</h3>
          <p className="text-3xl font-bold text-purple-500">
            {projects.length > 0 
              ? `${(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length).toFixed(1)}%` 
              : '0%'}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;