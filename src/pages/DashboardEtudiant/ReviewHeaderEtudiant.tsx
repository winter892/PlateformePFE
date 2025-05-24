import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit3, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LivrableResponse } from '@/types/task';
import { getLivrableById } from '@/services/EtudiantsService';

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
  deliverables,
  reviewStatus,
  onRequestChanges,
  onApproveDeliverable,
  showAllGroupsConfirm,
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
console.log("llallla",deliverableId);

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
              Aucun livrable trouvé pour cette tâche
            </h1>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => toast.info('Le téléchargement démarrera bientôt...')}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
          >
            <Download size={16} className="mr-1" />
            Télécharger
          </button>

          {reviewStatus.status === 'pending' && !showAllGroupsConfirm && (
            <button
              onClick={() => onApproveDeliverable(false)}
              className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
            >
              <CheckCircle size={16} className="mr-1" />
              Valider ce livrable
            </button>
          )}

          {/*showAllGroupsConfirm && (
            <>
              <button
                onClick={() => onRequestChanges(true)}
                className="px-3 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors flex items-center"
              >
                <Edit3 size={16} className="mr-1" />
                Demander des modifications pour tous
              </button>
              <button
                onClick={() => onApproveDeliverable(true)}
                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-1" />
                Valider pour tous
              </button>
            </>
          )*/}
        </div>
      </div>
    </div>
  );
};

export default ReviewHeaderEtudiant;
