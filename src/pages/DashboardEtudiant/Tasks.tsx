
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Task, Deliverable, Comment } from '@/types/task';
import { TaskFilter } from '@/components/dashboardEtudiant/TaskFilter';
import { TaskList } from '@/components/dashboardEtudiant/TaskList';
import { TaskForm } from '@/components/dashboardEtudiant/NewTaskForm';
import { DeliverablesManager } from '@/components/dashboardEtudiant/DeliverablesManager';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Analyser les besoins du projet',
      description: 'Réaliser une analyse détaillée des besoins fonctionnels du projet.',
      status: 'terminé',
      dueDate: '2023-10-15',
    },
    {
      id: '2',
      title: 'Concevoir l\'architecture',
      description: 'Définir l\'architecture technique de l\'application.',
      status: 'en cours',
      dueDate: '2023-10-22',
    },
    {
      id: '3',
      title: 'Développer le prototype',
      description: 'Créer un prototype fonctionnel pour validation.',
      status: 'à faire',
      dueDate: '2023-11-05',
    },
  ]);
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    {
      id: '1',
      taskId: '1',
      name: 'Rapport d\'analyse.pdf',
      fileUrl: '/documents/rapport.pdf',
      submittedAt: '2023-10-14',
    },
    {
      id: '2',
      taskId: '2',
      name: 'Schéma d\'architecture.png',
      fileUrl: '/documents/schema.png',
      submittedAt: '2023-10-20',
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      deliverableId: '1',
      author: 'P',
      text: 'Pouvez-vous ajouter plus de détails à cette section ?',
      timestamp: '14:30'
    },
    {
      id: '2',
      deliverableId: '1',
      author: 'E',
      text: 'Oui, je vais l\'améliorer et soumettre une nouvelle version.',
      timestamp: '14:35'
    },
    {
      id: '3',
      deliverableId: '2',
      author: 'P',
      text: 'Le schéma est très clair, merci !',
      timestamp: '10:15'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'à faire',
    dueDate: new Date().toISOString().split('T')[0],
  });
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeliverablesDialogOpen, setIsDeliverablesDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = () => {
    const task: Task = {
      id: uuidv4(),
      ...newTask,
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'à faire',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setIsNewTaskDialogOpen(false);
    toast({
      title: "Tâche créée",
      description: "La tâche a été créée avec succès.",
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  };

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
      setEditingTask(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Tâche modifiée",
        description: "La tâche a été modifiée avec succès.",
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask({...task});
    setIsEditDialogOpen(true);
  };

  const openDeliverablesDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeliverablesDialogOpen(true);
  };

  const handleAddDeliverable = (name: string, taskId: string, description: string) => {
    if (name && taskId) {
      const deliverable: Deliverable = {
        id: uuidv4(),
        taskId: taskId,
        name: name,
        fileUrl: `/documents/${name}`,
        submittedAt: new Date().toISOString().split('T')[0],
      };

      setDeliverables([...deliverables, deliverable]);
      
      // Ajouter un premier commentaire automatique
      const newAutoComment: Comment = {
        id: uuidv4(),
        deliverableId: deliverable.id,
        author: 'Système',
        text: 'Le livrable a été ajouté. N\'hésitez pas à discuter ici.',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setComments([...comments, newAutoComment]);
      
      toast({
        title: "Livrable ajouté",
        description: "Le livrable a été ajouté avec succès.",
      });
    }
  };

  const handleAddComment = (deliverableId: string, text: string) => {
    if (text && deliverableId) {
      const comment: Comment = {
        id: uuidv4(),
        deliverableId: deliverableId,
        author: 'E',
        text: text,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setComments([...comments, comment]);
      
      // Ajouter une réponse automatique après 1 seconde
      setTimeout(() => {
        const autoReply: Comment = {
          id: uuidv4(),
          deliverableId: deliverableId,
          author: 'P',
          text: 'Merci pour votre contribution. Je vais l\'examiner.',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setComments(prev => [...prev, autoReply]);
      }, 1000);
    }
  };

  return (
    <div className="p-6 ml-64 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Liste des tâches</h1>
        
        <div className="flex items-center justify-between mb-6">
          <TaskFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />

          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nouvelle tâche</DialogTitle>
                <DialogDescription>Créez une nouvelle tâche avec les détails correspondants.</DialogDescription>
              </DialogHeader>
              <TaskForm 
                task={newTask}
                onChange={setNewTask}
                onCancel={() => setIsNewTaskDialogOpen(false)}
                onSubmit={handleCreateTask}
              />
            </DialogContent>
          </Dialog>
        </div>

        <TaskList 
          tasks={filteredTasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={openEditDialog}
          onViewDeliverables={openDeliverablesDialog}
          onCreateTask={() => setIsNewTaskDialogOpen(true)}
        />
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
            <DialogDescription>Modifiez les détails de la tâche selon vos besoins.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              task={editingTask}
              onChange={setEditingTask}
              onCancel={() => {
                setEditingTask(null);
                setIsEditDialogOpen(false);
              }}
              onSubmit={handleEditTask}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Deliverables Dialog */}
      <Dialog open={isDeliverablesDialogOpen} onOpenChange={setIsDeliverablesDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Livrables</DialogTitle>
            <DialogDescription>Gérez les livrables associés à cette tâche.</DialogDescription>
          </DialogHeader>
          {selectedTaskId && (
            <DeliverablesManager 
              deliverables={deliverables.filter(d => d.taskId === selectedTaskId)}
              comments={comments}
              onAddComment={handleAddComment}
              onAddDeliverable={handleAddDeliverable}
              taskId={selectedTaskId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
