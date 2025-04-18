import { useState, useEffect } from 'react';
import { getGroupes } from "@/services/userService";
import { Group, Project, Task } from '../types';
import { Users, FileText, CheckSquare } from 'lucide-react';

interface GroupItemProps {
  group: Group;
  project: Project;
  tasks: Task[];
  onClick: (group: Group) => void;
  onTasksClick: (groupId: number) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({
  group,
  project,
  tasks,
  onClick,
  onTasksClick
}) => {
  const [groupes, setGroupes] = useState<Group[]>([]); // Liste des groupes récupérés
  const [loading, setLoading] = useState<boolean>(false); // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur

  useEffect(() => {
    const fetchGroupes = async () => {
      setLoading(true);
      try {
        const groupeData = await getGroupes(); // Appel à l'API pour récupérer les groupes
        setGroupes(groupeData); // Met à jour l'état avec les groupes récupérés
        setError(null); // Réinitialisation de l'erreur en cas de succès
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError("Erreur lors de la récupération des groupes.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupes(); // Appel de la fonction pour récupérer les groupes
  }, []); // L'effet se déclenche seulement au montage du composant

  const groupTasks = tasks.filter(task => task.projectId === project.id);

  return (
    <div className="bg-white rounded-lg border border-violet-200 p-4 hover:shadow-md transition-shadow">
      {loading ? (
        <div>Chargement des groupes...</div> // Affichage pendant le chargement
      ) : error ? (
        <div className="text-red-500">{error}</div> // Affichage en cas d'erreur
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-violet-100 mr-3">
                <Users size={18} className="text-violet-700" />
              </div>
              <h3 className="font-medium text-violet-900">{group.intitulé}</h3> {/* Affichage du nom du groupe */}
            </div>
            
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {project.status === 'completed' ? 'Terminé' : 'En cours'}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-violet-600 mb-3">
            <FileText size={16} className="mr-2" />
            <span>{project.title}</span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-violet-500">Progression</span>
              <span className="text-xs font-medium text-violet-700">{project.progress}%</span>
            </div>
            <div className="w-full bg-violet-200 rounded-full h-1.5">
              <div
                className="bg-violet-600 h-1.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap mb-4">
            {group.members && Array.isArray(group.members) ? (
              group.members.map((member, index) => (
                <span
                  key={index}
                  className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {member}
                </span>
              ))
            ) : (
              <div className="text-xs text-red-500">Aucun membre trouvé</div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              className="flex-1 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors"
              onClick={() => onClick(group)}
            >
              Voir Détails
            </button>
            
            <button
              className="flex items-center px-3 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors"
              onClick={() => onTasksClick(group.id)}
            >
              <CheckSquare size={16} className="mr-1" />
              <span className="text-xs">Tâches</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GroupItem;
