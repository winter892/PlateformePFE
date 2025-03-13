
import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onViewDeliverables: (taskId: string) => void;
  onCreateTask: () => void;
}

export const TaskList = ({ 
  tasks, 
  onDeleteTask, 
  onEditTask, 
  onViewDeliverables,
  onCreateTask
}: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onViewDeliverables={onViewDeliverables}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <CheckSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucune tâche trouvée</h3>
          <p className="text-gray-500 mb-4">Essayez de modifier vos filtres ou créez une nouvelle tâche</p>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={onCreateTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>
      )}
    </div>
  );
};
