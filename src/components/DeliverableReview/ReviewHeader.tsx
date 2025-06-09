
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Edit3, CheckCircle } from 'lucide-react';
import { getFichierFromDeliverable } from "@/services/EtudiantsService";
import { useParams, useNavigate } from 'react-router-dom';
import { getLivrableById } from '@/services/EtudiantsService';
import { getTacheById , updateTacheStatut} from '@/services/userService'; 
import { LivrableResponse } from '@/types/task';

import { toast } from 'sonner';

interface ReviewHeaderProps {
  deliverable: any;
  reviewStatus: {
    progress: number;
    status: 'pending' | 'approved' | 'needsRevision';
  };
  onRequestChanges: (applyToAll: boolean) => void;
  onApproveDeliverable: (applyToAll: boolean) => void;
  showAllGroupsConfirm: boolean;
  handleNavigateBack: () => void;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  deliverable,
  reviewStatus,
  onRequestChanges,
  onApproveDeliverable,
  showAllGroupsConfirm,
  handleNavigateBack
}) => {
    const { deliverableId } = useParams();
    const navigate = useNavigate();
    const [livrable, setLivrable] = useState<LivrableResponse | null>(null);
  
   const [tacheStatut, setTacheStatut] = useState<string | null>(null); // état du statut de la tâche

useEffect(() => {
  const fetchLivrableAndTache = async () => {
    try {
      if (!deliverableId) return;
      
      const data = await getLivrableById(deliverableId);
      setLivrable(data);
console.log("Livrable récupéré :", data);
      if (data && data.tache.id) {
        console.log("ID de la tâche :", data.tache.id);
        const tache = await getTacheById(data.tache.id);
        setTacheStatut(tache?.statut || null);
      }

    } catch (error) {
      toast.error("Erreur lors de la récupération du livrable ou de la tâche.");
    }
  };

  fetchLivrableAndTache();
}, [deliverableId]);
  //telecharger une livrable 
  const handleDownload = async () => {
    try {
      toast.info("Le téléchargement démarrera bientôt...");
  
      const blob = await getFichierFromDeliverable(deliverableId);
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = livrable.nom_fichier || "livrable";
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      URL.revokeObjectURL(url); // Libérer l'URL après le téléchargement
    } catch (error) {
      toast.error("Erreur lors du téléchargement du fichier.");
      console.error("Erreur téléchargement livrable :", error);
    }
  };
const handleApproveDeliverable = async () => {
  try {
    if (!livrable || !livrable.tache?.id) {
      toast.error("Tâche introuvable pour ce livrable"); 
      return;
    }

    const statut = "terminé"; // statut à mettre à jour
    await updateTacheStatut(livrable.tache.id, statut);

    // Mettre à jour immédiatement l'état local pour refléter le changement
    setTacheStatut("terminé");
    onApproveDeliverable(false); // exécuter immédiatement
  } catch (error) { 
    toast.error("Erreur lors de la validation du livrable");
    console.error(error);
  }
};

  
  return (
    <div className="bg-white border-b border-violet-100 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={handleNavigateBack} 
            className="mr-4 text-violet-700 hover:text-violet-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
              <h1 className="text-xl font-medium text-green-900">{livrable.nom_fichier}</h1>
            <div className="flex items-center text-sm text-violet-600">
               {livrable.fichier?.dateCreation && (
                  <span className="mr-2">
                    Soumis le{'   '}
                    {new Date(livrable.fichier.dateCreation).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleDownload()} 
            className="px-3 py-2 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors flex items-center"
          >
            <Download size={16} className="mr-1" />
            Télécharger 
          </button>

          {tacheStatut !== "terminé" && (
            <>
                
            <button 
              onClick={handleApproveDeliverable}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
            >
              <CheckCircle size={16} className="mr-1" />
              Valider ce livrable
            </button>
   
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;
