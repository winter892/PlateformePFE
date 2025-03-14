
import React from 'react';
import { Task } from '@/types';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  showProject?: boolean;
  onClick?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, showProject = false, onClick }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'problem':
        return <AlertCircle className="text-red-500" size={18} />;
      default:
        return <Clock className="text-amber-500" size={18} />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'completed':
        return 'Terminée';
      case 'problem':
        return 'Problème';
      default:
        return 'En cours';
    }
  };

  const getStatusClass = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'problem':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  // Calculate days remaining
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className="bg-white rounded-lg p-4 border border-violet-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-violet-800">{task.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <p className="text-sm text-violet-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="text-xs text-violet-500 ml-1">
            {task.comments.length} commentaire{task.comments.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className={`text-xs font-medium ${daysRemaining < 3 ? 'text-red-600' : 'text-violet-600'}`}>
          {daysRemaining > 0 
            ? `${daysRemaining} jour${daysRemaining !== 1 ? 's' : ''} restant${daysRemaining !== 1 ? 's' : ''}`
            : 'Échéance dépassée'}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
