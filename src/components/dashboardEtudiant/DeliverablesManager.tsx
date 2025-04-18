
import React, { useState } from 'react';
import { Eye, FileText, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Deliverable, Comment } from '@/types/task';

interface DeliverablesManagerProps {
  deliverables: Deliverable[];
  comments: Comment[];
  onAddComment: (deliverableId: string, text: string) => void;
  onAddDeliverable: (name: string, taskId: string, description: string) => void;
  taskId: string;
}

export const DeliverablesManager = ({
  deliverables,
  comments,
  onAddComment,
  onAddDeliverable,
  taskId
}: DeliverablesManagerProps) => {
  const [activeDeliverable, setActiveDeliverable] = useState<Deliverable | null>(
    deliverables.length > 0 ? deliverables[0] : null
  );
  const [newComment, setNewComment] = useState('');
  const [isNewDeliverableFormVisible, setIsNewDeliverableFormVisible] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    name: '',
    description: ''
  });

  const getCommentsForDeliverable = (deliverableId: string) => {
    return comments.filter(comment => comment.deliverableId === deliverableId);
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.name) {
      onAddDeliverable(newDeliverable.name, taskId, newDeliverable.description);
      setNewDeliverable({
        name: '',
        description: ''
      });
      setIsNewDeliverableFormVisible(false);
    }
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
                placeholder="Nom du fichier avec extension" 
                value={newDeliverable.name}
                onChange={(e) => setNewDeliverable({...newDeliverable, name: e.target.value})}
              />
              <Input 
                placeholder="Description (optionnelle)" 
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable({...newDeliverable, description: e.target.value})}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-500 mb-2">
                  Glissez votre fichier ici ou
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Parcourir les fichiers
                </Button>
                <input type="file" className="hidden" />
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
                  onClick={handleAddDeliverable}
                  disabled={!newDeliverable.name}
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
                    <p className="text-sm font-medium">{deliverable.name}</p>
                    <p className="text-xs text-gray-500">Soumis le {new Date(deliverable.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600 hover:bg-green-50">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun livrable trouvé pour cette tâche</p>
              <Button 
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => setIsNewDeliverableFormVisible(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un livrable
              </Button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
