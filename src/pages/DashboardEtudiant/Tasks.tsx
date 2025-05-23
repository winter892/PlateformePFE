import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Task, LivrableCreate,LivrableResponse, Comment, Fichier } from "@/types/task";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/NewTaskForm";
import {
  getTaches,
  deleteTache,
  getLivrableByTacheid,
  AddTache,
  getProjetIdByUser,
  deletLivrableAndFile
} from "../../services/EtudiantsService";
import { DeliverablesManager } from "@/components/dashboardEtudiant/DeliverablesManager";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [deliverables, setDeliverables] = useState<LivrableResponse[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    status: "à faire",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeliverablesDialogOpen, setIsDeliverablesDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const id = localStorage.getItem('id');
        const TachesData = await getTaches(Number(id));
        const formattedTasks = TachesData.map((t: any) => ({
          id: t.id.toString(),
          title: t.titre,
          description: t.description,
          status: t.statut,
          dueDate: t.dateLimite
            ? new Date(t.dateLimite).toLocaleDateString("fr-FR")
            : "",
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
      }
    };
    fetchTaches();
  }, []);

  useEffect(() => {
    const fetchDeliverables = async () => {
      if (selectedTaskId) {
        try {
          const data = await getLivrableByTacheid(selectedTaskId);
          setDeliverables(data);
        } catch (error) {
          console.error("Impossible de récupérer les livrables :", error);
        }
      }
    };
    fetchDeliverables();
  }, [selectedTaskId]);

  const refreshTasks = async () => {
    try {
      const id = localStorage.getItem('id');
      const TachesData = await getTaches(Number(id));
      const formattedTasks = TachesData.map((t: any) => ({
        id: t.id.toString(),
        title: t.titre,
        description: t.description,
        status: t.statut,
        dueDate: t.dateLimite
          ? new Date(t.dateLimite).toLocaleDateString("fr-FR")
          : "",
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };


  const handleCreateTask = async () => {
    try {
      const Etudiantid = localStorage.getItem('id');
      const projetId = await getProjetIdByUser(Etudiantid);
  
      await AddTache({
        titre: newTask.title,
        description: newTask.description,
        statut: newTask.status,
        dateLimite: newTask.dueDate,
        projet_id: projetId,
      });
  
      toast({
        title: "Tâche créée !",
        description: "Votre tâche a bien été ajoutée.",
        className: "border bg-green-50 border-green-500 text-green-800",
      });
  
      setIsNewTaskDialogOpen(false); // Fermer la modale
      await refreshTasks(); // Rafraîchir la liste
      setNewTask({
        title: "",
        description: "",
        status: "à faire",
        dueDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive"
      });
    }
  };
  
  

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTache(id);
      await refreshTasks();
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
        className: "text-red-800 border-red-300",
      });
    } catch (error) {
      console.error("Erreur de suppression :", error);
      toast({
        title: "Erreur",
        description: "La suppression de la tâche a échoué.Car il y a des livrables associés.",
        className: "text-red-800 border-red-300",
        
      });
    }
  };
  useEffect(() => {
    const fetchDeliverables = async () => {
      if (isDeliverablesDialogOpen && selectedTaskId) {
        const data = await getLivrableByTacheid(selectedTaskId);
        setDeliverables(data);
      }
    };
    fetchDeliverables();
  }, [isDeliverablesDialogOpen, selectedTaskId]);
  
  
  const handleDeleteLivrable = async (id: string) => {
    try {
      await deletLivrableAndFile(id);
      setDeliverables((prev) => prev.filter(livrable => livrable.id !== id));

      toast({
        title: "Livrable supprimée",
        description: "Le livrable a été supprimée avec succès.",
        className: "text-red-800 border-red-300",
      });
    } catch (error) {
      console.error("Erreur de suppression :", error);
      toast({
        title: "Erreur",
        description: "La suppression de livrable a échoué.",
        variant: "destructive",
      });
    }
  };
  const handleEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)));
      setEditingTask(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Tâche modifiée",
        description: "La tâche a été modifiée avec succès.",
      });
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const openDeliverablesDialog = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDeliverablesDialogOpen(true);
  };

  const handleAddDeliverable = (name: string, taskId: string, description: string, fichier:Fichier) => {
    const deliverable: LivrableResponse = {
      id: uuidv4(),
      tache_id: taskId,
      nom_fichier: name,
      descreption: description,
      fichier:fichier
    };

    const newAutoComment: Comment = {
      id: uuidv4(),
      deliverableId: deliverable.id,
      author: "Système",
      text: "Le livrable a été ajouté. N'hésitez pas à discuter ici.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setComments([...comments, newAutoComment]);
    toast({ title: "Livrable ajouté", description: "Le livrable a été ajouté avec succès." });
  };

  const handleAddComment = (deliverableId: string, text: string) => {
    const comment: Comment = {
      id: uuidv4(),
      deliverableId,
      author: "E",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setComments([...comments, comment]);

    setTimeout(() => {
      const autoReply: Comment = {
        id: uuidv4(),
        deliverableId,
        author: "P",
        text: "Merci pour votre contribution. Je vais l'examiner.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setComments((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
                <DialogDescription>
                  Créez une nouvelle tâche avec les détails correspondants.
                </DialogDescription>
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

      <Dialog open={isDeliverablesDialogOpen} onOpenChange={setIsDeliverablesDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Livrables</DialogTitle>
            <DialogDescription>Gérez les livrables associés à cette tâche.</DialogDescription>
          </DialogHeader>
          {selectedTaskId && (
            <DeliverablesManager
              deliverables={deliverables}
              comments={comments}
              onAddComment={handleAddComment}
              onAddDeliverable={handleAddDeliverable}
              onDeleteDeliverable={handleDeleteLivrable}
              taskId={selectedTaskId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
