import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { tasks, projects, groups } from '@/lib/mock-data';
import { Task, Group, StatFilter } from '@/types';
const StatisticsPage = () => {
  const [filter, setFilter] = useState<StatFilter>({});

  // Filter tasks based on selected criteria
  const filteredTasks = tasks.filter(task => {
    if (filter.group && task.projectId !== projects.find(p => p.groupId === filter.group)?.id) {
      return false;
    }
    // Additional filters can be added here
    return true;
  });

  // Calculate task status counts
  const taskStatusCounts = {
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    problem: filteredTasks.filter(t => t.status === 'problem').length
  };

  // Prepare data for the pie chart
  const pieData = [{
    name: 'Terminées',
    value: taskStatusCounts.completed,
    color: '#10B981'
  }, {
    name: 'En cours',
    value: taskStatusCounts.inProgress,
    color: '#3B82F6'
  }, {
    name: 'Problèmes',
    value: taskStatusCounts.problem,
    color: '#EF4444'
  }];

  // Prepare data for the progress bar chart
  const progressData = projects.map(project => {
    const group = groups.find(g => g.id === project.groupId);
    return {
      name: group ? group.intitule : `Groupe ${project.groupId}`,
      progress: project.progress
    };
  });
  return <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-violet-900 mb-2">Statistiques</h1>
        <p className="text-violet-500">Analyse des projets et des tâches</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Status Chart */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4">Status des Groupes</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Projects Progress Chart */}
        <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm">
          <h2 className="text-lg font-medium text-violet-800 mb-4">Progression des projets</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      
    </DashboardLayout>;
};
export default StatisticsPage;