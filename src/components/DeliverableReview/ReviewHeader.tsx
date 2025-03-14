
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit3, CheckCircle } from 'lucide-react';
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
            <h1 className="text-xl font-medium text-violet-900">{deliverable.title}</h1>
            <div className="flex items-center text-sm text-violet-600">
              <span className="mr-2">
                Soumis le {new Date(deliverable.submissionDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => toast.info("Le téléchargement démarrera bientôt...")} 
            className="px-3 py-2 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors flex items-center"
          >
            <Download size={16} className="mr-1" />
            Télécharger
          </button>

          {reviewStatus.status === 'pending' && !showAllGroupsConfirm && (
            <>
              <button 
                onClick={() => onRequestChanges(false)} 
                className="px-3 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors flex items-center"
              >
                <Edit3 size={16} className="mr-1" />
                Demander des modifications
              </button>
              <button 
                onClick={() => onApproveDeliverable(false)} 
                className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-1" />
                Valider ce livrable
              </button>
            </>
          )}

          {showAllGroupsConfirm && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;
