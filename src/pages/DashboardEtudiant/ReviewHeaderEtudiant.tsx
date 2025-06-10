import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit3, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LivrableResponse } from '@/types/task';
import { getLivrableById } from '@/services/EtudiantsService';
import { getFichierFromDeliverable } from "@/services/EtudiantsService";

interface ReviewHeaderProps {
  deliverables: LivrableResponse[];
  reviewStatus: {
    progress: number;
    status: 'pending' | 'approved' | 'needsRevision';
  };
  onRequestChanges: (applyToAll: boolean) => void;
  onApproveDeliverable: (applyToAll: boolean) => void;
  showAllGroupsConfirm: boolean;
  handleNavigateBack: () => void;
}

const ReviewHeaderEtudiant: React.FC<ReviewHeaderProps> = ({

  handleNavigateBack,
}) => {
  const { deliverableId } = useParams();
  const navigate = useNavigate();
  const [livrable, setLivrable] = useState<LivrableResponse | null>(null);

  useEffect(() => {
    const fetchLivrable = async () => {
      try {
        if (!deliverableId) return;
        const data = await getLivrableById(deliverableId);
        setLivrable(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération du livrable.");
        setLivrable(null);
      }
    };

    fetchLivrable();
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


  return (
    <div className="bg-white border-b border-green-100 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleNavigateBack}
            className="mr-4 text-green-700 hover:text-green-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {livrable ? (
            <div>
              <h1 className="text-xl font-medium text-green-900">{livrable.nom_fichier}</h1>
              <div className="flex items-center text-sm text-green-600">
                {livrable.fichier?.dateCreation && (
                  <span className="mr-2">
                    Soumis le{' '}
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
          ) : (
            <h1 className="text-xl font-medium text-green-900">
             Chargement du fichier...
            </h1>
          )}
        </div>

        <div className="flex space-x-2">
          <button
             onClick={handleDownload}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
          >
            <Download size={16} className="mr-1" />
            Télécharger
          </button>

          
        </div>
      </div>
    </div>
  );
};

export default ReviewHeaderEtudiant;
