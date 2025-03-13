
import { groups, projects } from '@/lib/mock-data';
import { Users } from 'lucide-react';
import GroupItem from '../GroupItem';
import { useNavigate } from 'react-router-dom';

const GroupsPanel = () => {
  const navigate = useNavigate();

  const handleGroupClick = (groupId: number) => {
    console.log(`Group ${groupId} clicked`);
    // Navigate to group details page when implemented
  };

  const handleTasksClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="dashboard-card h-full">
      <div className="divide-y divide-violet-100 max-h-[400px] overflow-y-auto">
        {groups.map(group => {
          const project = projects.find(p => p.id === group.projectId);
          return project ? (
            <div key={group.id} className="p-4">
              <GroupItem 
                group={group} 
                project={project} 
                tasks={[]} 
                onClick={() => handleGroupClick(group.id)} 
                onTasksClick={() => handleTasksClick(group.id)}
              />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default GroupsPanel;
