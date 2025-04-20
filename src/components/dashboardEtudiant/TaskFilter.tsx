
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TaskFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export const TaskFilter = ({ 
  searchQuery, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange 
}: TaskFilterProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher une tâche..."
          className="pl-10 w-64"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className={cn(
            "text-sm",
            !selectedStatus && "bg-primary-100 text-primary-700"
          )}
          onClick={() => onStatusChange(null)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Tous
        </Button>
        {['à faire', 'en cours', 'terminé'].map(status => (
          <Button
            key={status}
            variant="outline"
            className={cn(
              "text-sm",
              selectedStatus === status && "bg-primary-100 text-primary-700"
            )}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
};
