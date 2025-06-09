import { Group, Project } from '@/types';
import { Users, FileText, CheckSquare } from 'lucide-react';
import React from 'react';
interface GroupItemProps {
  group: Group;
  project: Project;
  progress: number;
  status: 'in_progress' | 'completed' | 'pending';
  onClick: (group: Group) => void;
  onTasksClick: (groupId: number) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({
  group,
  project,
  progress,
  status,
  onClick,
  onTasksClick
}) => {
  return (
    <div className="bg-white rounded-lg border border-violet-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-violet-100 mr-3">
            <Users size={18} className="text-violet-700" />
          </div>
          <h3 className="font-medium text-violet-900">{group.intitule}</h3>
        </div>
        
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-gray-100 text-gray-800' : 
            'bg-blue-100 text-blue-800'
          }`}
        >
          {status === 'completed' ? 'Terminé' : status === 'pending' ? 'À faire' : 'En cours'}
        </span>
      </div>
      
      <div className="flex items-center text-sm text-violet-600 mb-3">
        <FileText size={16} className="mr-2" />
        <span>{project.titre}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-violet-500">Progression</span>
          <span className="text-xs font-medium text-violet-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-violet-200 rounded-full h-1.5">
          <div
            className="bg-violet-600 h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {group.members && group.members.length > 0 && (
        <>
          
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
// This component displays a group item with its details, including the group name, project title, progress, status, and members.
// It also provides buttons to view details and tasks associated with the group.