
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { groups } from '@/lib/mock-data';

export const useDeliverable = () => {
  const { groupId, taskId, deliverableId } = useParams();
  const navigate = useNavigate();
  const [deliverable, setDeliverable] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewStatus, setReviewStatus] = useState({
    progress: 40,
    status: 'pending' as 'pending' | 'approved' | 'needsRevision'
  });

  useEffect(() => {
    loadDeliverableData();
  }, [groupId, taskId, deliverableId, navigate]);

  const loadDeliverableData = () => {
    setTimeout(() => {
      const group = groups.find(g => g.id === Number(groupId));
      if (!group) {
        toast.error("Groupe non trouvé");
        navigate('/groups');
        return;
      }
      const mockDeliverable = {
        id: Number(deliverableId),
        title: "Rapport d'analyse des besoins",
        type: "pdf",
        content: "https://example.com/sample.pdf",
        submissionDate: "2023-05-15",
        status: "submitted",
        annotations: [],
        student: {
          id: 1,
          name: "Marie Dupont",
          role: "Chef de projet",
          avatar: "/avatar1.png"
        }
      };
      setDeliverable(mockDeliverable);
      setLoading(false);
    }, 1000);
  };

  return {
    deliverable,
    loading,
    reviewStatus,
    setReviewStatus,
    groupId,
    taskId,
  };
};
