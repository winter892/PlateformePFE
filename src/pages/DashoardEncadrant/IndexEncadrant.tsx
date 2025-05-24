import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import StatCard from '@/components/dashboardEncadrent/StatCard';
import ProjectsChart from '@/components/dashboardEncadrent/ProjectsChart';
import TasksList from '@/components/dashboardEncadrent/TasksList';
import { dashboardStats } from '@/lib/mock-data';
import { FolderOpen, Clock, CheckCircle, BellRing, BarChart2, CheckSquare } from 'lucide-react';
import { getUserById } from '@/services/userService';

const IndexEncadrant = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // Apply staggered animation on mount
  useEffect(() => {
    const elements = document.querySelectorAll('.section-animation');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, index * 100);
    });

    // Fetch user data
    const fetchUserData = async () => {
      const id = localStorage.getItem('id');
      if (id) {
        try {
          const data = await getUserById(id);
          setUserInfo(data);
        } catch (error) {
          console.error("Erreur lors du chargement des données utilisateur:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleTeacherClick = () => {
    navigate('/EncadrantProfile');
  };

  // Import tasks from mock-data
  const { tasks } = dashboardStats;
  const id = localStorage.getItem('id');

  return (
    <DashboardLayout onProfileClick={handleTeacherClick}>
      <div className="mb-8 section-animation">
        <h1 className="text-2xl font-semibold text-violet-900 mb-1">
          Bienvenue !!{' '}
          <span 
            className="cursor-pointer hover:text-violet-700 underline" 
            onClick={handleTeacherClick}
          >
            {userInfo ? `${userInfo.nom} ${userInfo.prenom}` : 'Chargement...'}
          </span>
        </h1>
        <p className="text-violet-500">Voici un aperçu des projets académiques</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8 section-animation">
        <StatCard title="Total des projets" value={dashboardStats.totalProjects} icon={<FolderOpen size={24} />} trendValue={5} trendDirection="up" />
        <StatCard title="Projets en cours" value={dashboardStats.projectsInProgress} icon={<Clock size={24} />} />
        <StatCard title="Projets terminés" value={dashboardStats.projectsCompleted} icon={<CheckCircle size={24} />} trendValue={10} trendDirection="up" />
        <StatCard title="Tâches en attente" value={dashboardStats.pendingTasks} icon={<CheckSquare size={24} />} trendValue={2} trendDirection="down" />
        <StatCard title="Notifications" value={dashboardStats.unreadNotifications} icon={<BellRing size={24} />} />
        <StatCard title="Progrès moyen" value={`${dashboardStats.averageProgress}%`} icon={<BarChart2 size={24} />} trendValue={8} trendDirection="up" />
      </div>
      
      {/* Tasks List */}
      <div className="section-animation">
        <TasksList tasks={tasks} title="Tâches" limit={5} />
      </div>
    </DashboardLayout>
  );
};

export default IndexEncadrant;