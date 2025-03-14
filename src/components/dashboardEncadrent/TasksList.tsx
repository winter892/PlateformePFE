import React from 'react';
import TaskItem from '../TaskItem';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Task } from '@/types';
interface TasksListProps {
  tasks: Task[];
  title?: string;
  showProject?: boolean;
  limit?: number;
}
const TasksList: React.FC<TasksListProps> = ({
  tasks,
  title = "Tasks",
  showProject = false,
  limit
}) => {
  const displayTasks = limit ? tasks.slice(0, limit) : tasks;
  return <Card className="h-full">
      
      
    </Card>;
};
export default TasksList;