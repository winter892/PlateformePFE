import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { projectStatusCounts } from '@/lib/mock-data';
const ProjectsChart = () => {
  const data = [{
    name: 'En attente',
    value: projectStatusCounts.pending,
    color: '#FCD34D'
  }, {
    name: 'En cours',
    value: projectStatusCounts.inProgress,
    color: '#60A5FA'
  }, {
    name: 'Terminés',
    value: projectStatusCounts.completed,
    color: '#34D399'
  }, {
    name: 'Problèmes',
    value: projectStatusCounts.issue,
    color: '#F87171'
  }];
  return;
};
export default ProjectsChart;