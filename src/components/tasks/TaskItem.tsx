
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { differenceInDays, isAfter, parse } from "date-fns"; // si task.dueDate est en ISO string



interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onViewDeliverables: (taskId: string) => void;
}

export const TaskItem = ({ task, onDelete, onViewDeliverables }: TaskItemProps) => {
  
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'à faire': return 'bg-yellow-100 text-yellow-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const dueDate = parse(task.dueDate.toString(), "dd/MM/yyyy", new Date());
const today = new Date();

  const isLate = isAfter(today, dueDate) && task.status.toLowerCase() !== 'terminé';
  const lateDays = isLate ? differenceInDays(today, dueDate) : 0;
  console.log(`Task ${task.id} is late by ${lateDays} day(s)`);
  console.log(`Task ${task.id} status: ${task.status}`);
  console.log(`Task ${task.id} due date: ${task.dueDate}`);
  console.log(dueDate);
  console.log(`Today's date: ${today}`);
  return (
<div
  className={`flex items-center justify-between p-4 rounded-lg shadow-lg transition-colors ${
    isLate ? 'bg-red-100' : 'bg-white hover:bg-gray-100'
  }`}
>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <h3 className="font-medium">{task.title}</h3>
        
        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
        <span className="text-sm text-gray-500">{task.dueDate}</span>
      </div>
      {isLate && (
        <p className="text-sm text-red-600">
           En retard de {lateDays} jour{lateDays > 1 ? 's' : ''} – date limite dépassée.
        </p>
      )}
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
  );
};
