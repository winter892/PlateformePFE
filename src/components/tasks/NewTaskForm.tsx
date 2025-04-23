"use client"; // très important dans les composants client du App Router

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Task } from '@/types/task';

import { AddTache } from '@/services/EtudiantsService';
import { toast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";




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
 
  isEditing = false 
}: NewTaskFormProps) => {

  const router = useNavigate(); // pour naviguer

  const handleSubmit = async () => {
    try {
      await AddTache({
        titre: task.title,
        description: task.description,
        statut: task.status,
        dateLimite: task.dueDate || new Date().toISOString().split("T")[0],
        projet_id: 1
      });
  
      toast({
        title: "Tâche créée !",
        description: "Votre tâche a bien été ajoutée.",
      });
  
      // Petite pause avant de rediriger
      setTimeout(() => {
        router("/tasks");
            }, 2);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive"
      });
    }
  };
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
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={task.status}
            onChange={(e) => onChange({...task, status: e.target.value as Task['status']})}
          >
            <option value="à faire">à faire</option>
            <option value="en cours">en cours</option>
            <option value="terminé">terminé</option>
          </select>
        </div>
        <div className="space-y-2">
        <Label>Date d'échéance</Label>
        <Input 
          type="date" 
          value={task.dueDate.toString() || ''} // sécurité
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
          onClick={handleSubmit}
          disabled={!task.title}
        >
          {isEditing ? 'Enregistrer' : 'Créer'}
        </Button>
      </DialogFooter>
    </div>
  );
};
