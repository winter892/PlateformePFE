"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Task } from '@/types/task';

interface NewTaskFormProps {
  task: Omit<Task, 'id'>;
  onCancel: () => void;
  onChange: (task: Omit<Task, 'id'>) => void;
  onSubmit: () => void;
  isEditing?: boolean;
}

export const TaskForm = ({ 
  task, 
  onCancel, 
  onChange, 
  onSubmit,
  isEditing = false 
}: NewTaskFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Titre</Label>
        <Input 
          placeholder="Titre de la tâche" 
          value={task.title}
          onChange={(e) => onChange({...task, title: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          placeholder="Description de la tâche" 
          value={task.description || ''}
          onChange={(e) => onChange({...task, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Statut</Label>
          <p className="h-10 flex items-center px-3 py-2 rounded-md border border-input bg-muted text-sm">
            {task.status || "à faire"}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Date d'échéance</Label>
          <Input 
            type="date" 
            value={task.dueDate.toString() || ''} 
            onChange={(e) => onChange({...task, dueDate: e.target.value})}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
          disabled={!task.title}
        >
          {isEditing ? 'Enregistrer' : 'Créer'}
        </Button>
      </DialogFooter>
    </div>
  );
};
