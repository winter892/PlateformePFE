import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const COLORS = {
  termine: '#10B981',
  en_cours: '#3B82F6',
  en_retard: '#EF4444'
};

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGroupes: 0,
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    progresMoyen: 0
  });
  const [groupes, setGroupes] = useState([]);
  const [etudiantsParGroupe, setEtudiantsParGroupe] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encadrantId = localStorage.getItem('id');
        if (!encadrantId) return;

        const [dashboardRes, groupesRes, etudiantsRes] = await Promise.all([
          api.get(`/dashboard/encadrant/${encadrantId}`),
          api.get(`/dashboard/encadrant/${encadrantId}/groupes`),
          api.get(`/dashboard/encadrant/${encadrantId}/etudiants-par-groupe`)
        ]);

        setStats(dashboardRes.data);
        setGroupes(groupesRes.data);
        setEtudiantsParGroupe(etudiantsRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Données pour les graphiques existants
  const pieData = [
    { 
      name: 'Terminés', 
      value: stats.projetsTermines,
      icon: <CheckCircle className="text-green-500" size={16} />,
      color: COLORS.termine
    },
    { 
      name: 'En cours', 
      value: stats.projetsEnCours,
      icon: <Clock className="text-blue-500" size={16} />,
      color: COLORS.en_cours
    },
    { 
      name: 'En retard', 
      value: groupes.filter(g => g.status === 'en_retard').length,
      icon: <AlertCircle className="text-red-500" size={16} />,
      color: COLORS.en_retard
    }
  ];

  const progressData = groupes.map(groupe => ({
    name: groupe.intitule,
    progress: groupe.progress,
    status: groupe.status,
    projet: groupe.projetTitre
  }));

  // Préparer les données pour le nouveau graphique circulaire des étudiants
  const etudiantsPieData = etudiantsParGroupe.map(groupe => ({
    name: groupe.groupeIntitule,
    value: groupe.nombreEtudiants,
    projet: groupe.projetTitre
  }));

  // Couleurs pour le diagramme circulaire des étudiants
  const generateColors = (count) => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * hueStep}, 70%, 60%)`);
    }
    return colors;
  };

  const etudiantsColors = generateColors(etudiantsPieData.length);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-violet-900 mb-2">Statistiques Dynamiques</h1>
        <p className="text-violet-500">Tableau de bord complet pour le suivi des groupes et étudiants</p>
      </div>
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-violet-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Groupes</h3>
          <p className="text-2xl font-bold text-violet-600">{stats.totalGroupes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-violet-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Projets</h3>
          <p className="text-2xl font-bold text-violet-600">{stats.totalProjets}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-violet-100">
          <h3 className="text-gray-500 text-sm font-medium">Progression Moyenne</h3>
          <p className="text-2xl font-bold text-violet-600">{stats.progresMoyen.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-violet-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Étudiants</h3>
          <p className="text-2xl font-bold text-violet-600">
            {etudiantsParGroupe.reduce((sum, groupe) => sum + groupe.nombreEtudiants, 0)}
          </p>
        </div>
      </div>

      {/* Première ligne de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique à secteurs - Statut des projets */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-violet-600" size={20} />
            Répartition des projets
          </h2>
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
                    value, 
                    <span key="name" className="flex items-center">
                      {pieData.find(d => d.name === name)?.icon}
                      <span className="ml-2">{name}</span>
                    </span>
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Graphique à barres - Progression par groupe */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4 flex items-center">
            <Clock className="mr-2 text-violet-600" size={20} />
            Progression par groupe
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    'Progression'
                  ]}
                  content={({ payload }) => (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-medium">{payload?.[0]?.payload.name}</p>
                      <p>Projet: {payload?.[0]?.payload.projet}</p>
                      <p className="flex items-center">
                        Progression: {payload?.[0]?.value}%
                      </p>
                      <p className="flex items-center">
                        Statut: 
                        {payload?.[0]?.payload.status === 'termine' && 
                          <CheckCircle className="ml-2 text-green-500" size={16} />}
                        {payload?.[0]?.payload.status === 'en_cours' && 
                          <Clock className="ml-2 text-blue-500" size={16} />}
                        {payload?.[0]?.payload.status === 'en_retard' && 
                          <AlertCircle className="ml-2 text-red-500" size={16} />}
                        <span className="ml-1 capitalize">
                          {payload?.[0]?.payload.status.replace('_', ' ')}
                        </span>
                      </p>
                    </div>
                  )}
                />
                <Legend />
                <Bar 
                  dataKey="progress" 
                  name="Progression" 
                  radius={[4, 4, 0, 0]}
                >
                  {progressData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.status]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deuxième ligne - Nouveau graphique circulaire des étudiants */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4 flex items-center">
            <Users className="mr-2 text-violet-600" size={20} />
            Répartition des étudiants par groupe
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={etudiantsPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {etudiantsPieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={etudiantsColors[index % etudiantsColors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} étudiants`,
                    <span key="name" className="flex items-center">
                      <Users className="mr-1" size={14} />
                      {name}
                    </span>
                  ]}
                  content={({ payload }) => (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-medium">{payload?.[0]?.payload.name}</p>
                      <p>Projet: {payload?.[0]?.payload.projet}</p>
                      <p className="flex items-center">
                        Étudiants: {payload?.[0]?.value}
                      </p>
                    </div>
                  )}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  wrapperStyle={{
                    paddingLeft: '20px'
                  }}
                  formatter={(value, entry, index) => (
                    <span className="text-xs">
                      {value} ({etudiantsPieData[index]?.value} étudiants)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Tableau détaillé */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-violet-100">
          <h2 className="text-lg font-medium text-violet-800 flex items-center">
            <Users className="mr-2" size={20} />
            Détail des groupes et étudiants
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groupe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progression</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupes.map((groupe) => {
                const realStatus = groupe.progress >= 100 ? 'termine' : groupe.status;
                const etudiantsCount = etudiantsParGroupe.find(g => g.groupeId === groupe.id)?.nombreEtudiants || 0;
                
                return (
                  <tr key={groupe.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {groupe.intitule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {groupe.projetTitre || 'Aucun projet'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Users className="mr-1" size={12} />
                        {etudiantsCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{
                            width: `${groupe.progress}%`,
                            backgroundColor: COLORS[realStatus]
                          }}
                        ></div>
                      </div>
                      <span className="mt-1 inline-block">{groupe.progress.toFixed(1)}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${realStatus === 'termine' ? 'bg-green-100 text-green-800' : ''}
                        ${realStatus === 'en_cours' ? 'bg-blue-100 text-blue-800' : ''}
                        ${realStatus === 'en_retard' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {realStatus === 'termine' && <CheckCircle className="mr-1" size={12} />}
                        {realStatus === 'en_cours' && <Clock className="mr-1" size={12} />}
                        {realStatus === 'en_retard' && <AlertCircle className="mr-1" size={12} />}
                        {realStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;