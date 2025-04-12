
import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onViewDeliverables: (taskId: string) => void;
}

export const TaskItem = ({ task, onDelete, onEdit, onViewDeliverables }: TaskItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors hover:shadow-sm cursor-pointer"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-medium">{task.title}</h3>
          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          <span className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDeliverables(task.id);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir livrables
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
