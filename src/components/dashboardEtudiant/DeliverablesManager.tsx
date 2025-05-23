
import React, { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye, FileText, Plus, Upload ,Trash2} from 'lucide-react';
import { useRef } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {LivrableResponse,LivrableCreate, Comment, Fichier } from '@/types/task';
import {AjouterUneLivrable,getLivrableByTacheid} from '@/services/EtudiantsService';

interface DeliverablesManagerProps {
  deliverables: LivrableResponse[];
  comments: Comment[];
  onAddComment: (deliverableId: string, text: string) => void;
  onAddDeliverable: (name: string, taskId: string, description: string,fichier:Fichier) => void;
  taskId: string;
  onDeleteDeliverable: (id: string) => void;
}

export const DeliverablesManager = ({
  deliverables: initialDeliverables, 
  comments,
  onAddComment,
  onAddDeliverable,
  onDeleteDeliverable,
  taskId
}: DeliverablesManagerProps) => {

  const [deliverables, setDeliverables] = useState<LivrableResponse[]>([]);

  useEffect(() => {
    setDeliverables(initialDeliverables);
  }, [initialDeliverables]);
    const [activeDeliverable, setActiveDeliverable] = useState<LivrableResponse | null>(
    initialDeliverables.length > 0 ? initialDeliverables[0] : null
  );
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isNewDeliverableFormVisible, setIsNewDeliverableFormVisible] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    name: '',
    description: '',
    taskId:'',
    fichier:''
  });
    const navigate = useNavigate();
  
  const navigateToDeliverable = (groupId: number, taskId: number, deliverableId: number) => {
    navigate(`/groups/${groupId}/tasks/${taskId}`);
    setIsNewDeliverableFormVisible(false);
  };
   
    
  const getCommentsForDeliverable = (deliverableId: string) => {
    return comments.filter(comment => comment.deliverableId === deliverableId);
  };

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const data = await getLivrableByTacheid(taskId);
        setDeliverables(data);
        if (data.length > 0) setActiveDeliverable(data[0]);
      } catch (error) {
        console.error("Impossible de récupérer les livrables :", error);
      }
    };

    fetchDeliverables();
  }, [taskId]); // se relance si l'id de tâche change

  const handleAddDeliverable = async (name: string, taskId: string, description: string) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("Aucun fichier sélectionné !");
      return;
    }
  
    const formData = new FormData();
    formData.append("nom_fichier", name);
    formData.append("descreption", description || "");
    formData.append("tache_id", taskId);
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("Aucun fichier sélectionné !");
      return;
    }
    if (selectedFiles && selectedFiles.length > 0) {
      formData.append("fichier", selectedFiles[0]);
      
    }
    try {
      const response = await AjouterUneLivrable(formData);
      const result = response.data;
  
      console.log('Livrable ajouté avec succès :', result);
      setDeliverables(prev => [...prev, result]);
      setIsNewDeliverableFormVisible(false);
      setNewDeliverable({ name: '', description: '', taskId: '', fichier: '' });
      setSelectedFiles(null); // correction ici aussi
    } catch (error) {
      console.error("Erreur lors de l'ajout du livrable :", error);
    }
  };
  
  

  //Upload un fichier 

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Simule un clic sur l'input
  };
  

  const handleAddComment = () => {
    if (newComment && activeDeliverable) {
      onAddComment(activeDeliverable.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 overflow-y-auto max-h-[60vh]">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Livrables disponibles</h3>
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsNewDeliverableFormVisible(true)}
            
          >
            <Plus className="w-4 h-4 mr-2" /> 
            Nouveau livrable
          </Button>
        </div>
        {isNewDeliverableFormVisible ? (
         <div className="border rounded-lg p-3 mb-4">
         <h4 className="font-medium mb-2">Nouveau livrable</h4>
         <div className="space-y-3">
           <Input 
             placeholder="Nom du fichier" 
             value={newDeliverable.name}
             onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
             required
           />
           <Input 
             placeholder="Description (optionnelle)" 
             value={newDeliverable.description}
             onChange={(e) => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
           />
           <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
             <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
             <div className="text-sm text-gray-500 mb-2">
               Glissez votre fichier ici ou
             </div>
             <Button
               size="sm"
               className="bg-green-600 hover:bg-green-700"
               onClick={handleButtonClick}
             >
               Parcourir les fichiers
             </Button>
             <input
               type="file"
               multiple
               ref={fileInputRef}
               className="hidden"
               onChange={(e) => {
                const files = e.target.files;
                setSelectedFiles(files); // <-- Mise à jour du state
                console.log("Fichiers sélectionnés :", files);
               }}
               required
             />
           </div>
           <div className="flex justify-end gap-2 mt-2">
             <Button 
               variant="outline" 
               size="sm"
               onClick={() => setIsNewDeliverableFormVisible(false)}
             >
               Annuler
             </Button>
             <Button 
               size="sm" 
               className="bg-green-600 hover:bg-green-700"
               onClick={() => handleAddDeliverable(newDeliverable.name, taskId, newDeliverable.description )}
               disabled={!newDeliverable.name || !selectedFiles}
             >
               Ajouter
             </Button>
           </div>
         </div>
       </div>
       
        ) : null}
        <div className="space-y-3">
          {deliverables.length > 0 ? (
            deliverables.map((deliverable) => (
              <div 
                key={deliverable.id} 
                className={`flex items-center justify-between p-3 border rounded-md hover:border-green-300 cursor-pointer transition-colors ${activeDeliverable?.id === deliverable.id ? 'bg-green-50 border-green-300' : ''}`}
                onClick={() => setActiveDeliverable(deliverable)}
              >
                <div className="flex items-center gap-2">
                  <div className="text-green-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deliverable.nom_fichier}</p>
                    <p className="text-xs text-gray-500">   Soumis le {new Date(deliverable.fichier.dateCreation).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 hover:bg-green-50" onClick={() => navigateToDeliverable( 1, 107, 1)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation(); // Pour ne pas déclencher onClick sur le parent
                      onDeleteDeliverable(deliverable.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
               </Button>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun livrable trouvé pour cette tâche</p>
             
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
