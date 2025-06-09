import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../components/dashboardAdmin/Layout";
import Header from "../../../components/dashboardAdmin/Header";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import { Download, BarChart2, PieChart, LineChart } from "lucide-react";
import { getAdminStats } from "../../../services/userService";

ChartJS.register(...registerables);

interface AdminStats {
  totalEtudiants: number;
  totalEncadrants: number;
  totalDepartements: number;
  totalFilieres: number;
  projetsEnCours: number;
  projetsTermines: number;
}

const Statistiques = () => {
  const chartRef = useRef<HTMLDivElement>(null);
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
        console.error("Erreur lors du chargement des stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current);
        saveAs(dataUrl, `statistiques-${new Date().toISOString().split('T')[0]}.png`);
      } catch (error) {
        console.error("Erreur lors de l'exportation:", error);
      }
    }
  };

  // Données pour les graphiques
  const barChartData = {
    labels: ["Projets en cours", "Projets terminés"],
    datasets: [
      {
        label: "Statut des projets",
        data: [stats.projetsEnCours, stats.projetsTermines],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(16, 185, 129, 0.7)"
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(16, 185, 129, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Étudiants", "Encadrants"],
    datasets: [
      {
        data: [stats.totalEtudiants, stats.totalEncadrants],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(239, 68, 68, 0.7)"
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ["Départements", "Filières"],
    datasets: [
      {
        label: "Structures académiques",
        data: [stats.totalDepartements, stats.totalFilieres],
        fill: false,
        backgroundColor: "rgba(245, 158, 11, 0.7)",
        borderColor: "rgba(245, 158, 11, 1)",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <Header title="Statistiques" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Statistiques" />
      
      <div ref={chartRef} className="space-y-8 animate-fade-in">
        {/* En-tête avec bouton d'export */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Statistiques globales</h2>
            <p className="text-sm text-gray-500">Données actualisées en temps réel</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>

        {/* Grille de graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique à barres - Projets */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <BarChart2 size={20} />
              <h3 className="font-medium">Répartition des projets</h3>
            </div>
            <Bar 
              data={barChartData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y} projets`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>

          {/* Graphique circulaire - Utilisateurs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <PieChart size={20} />
              <h3 className="font-medium">Utilisateurs</h3>
            </div>
            <Pie 
              data={pieChartData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>

          {/* Graphique linéaire - Structures */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <LineChart size={20} />
              <h3 className="font-medium">Structures académiques</h3>
            </div>
            <Line 
              data={lineChartData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y} ${context.label.toLowerCase()}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Statistiques résumées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col">
            <p className="text-sm text-blue-600 font-medium">Taux de complétion</p>
            <p className="text-2xl font-bold my-2">
              {stats.projetsEnCours + stats.projetsTermines > 0 
                ? Math.round((stats.projetsTermines / (stats.projetsEnCours + stats.projetsTermines)) * 100) 
                : 0}%
            </p>
            <p className="text-xs text-gray-500">
              {stats.projetsTermines} projets terminés sur {stats.projetsEnCours + stats.projetsTermines}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg flex flex-col">
            <p className="text-sm text-green-600 font-medium">Ratio encadrement</p>
            <p className="text-2xl font-bold my-2">
              {stats.totalEncadrants > 0 
                ? (stats.totalEtudiants / stats.totalEncadrants).toFixed(1) 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {stats.totalEtudiants} étudiants / {stats.totalEncadrants} encadrants
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg flex flex-col">
            <p className="text-sm text-purple-600 font-medium">Filières par département</p>
            <p className="text-2xl font-bold my-2">
              {stats.totalDepartements > 0 
                ? (stats.totalFilieres / stats.totalDepartements).toFixed(1) 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {stats.totalFilieres} filières / {stats.totalDepartements} départements
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Statistiques;