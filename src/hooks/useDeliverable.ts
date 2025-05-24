
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { groups } from '@/lib/mock-data';
import { getFichierFromDeliverable } from '@/services/EtudiantsService';
  import { Deliverable } from '../pages/DashboardEtudiant/Deliverables';
  

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

  function formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  const loadDeliverableData = async () => {
    console.log("id du livrable ",deliverableId)
    if (!deliverableId) {
      toast.error("ID de livrable manquant");
      return;
    }
  
    try {
      // ✅ Appel API pour récupérer le fichier réel
      const blob = await getFichierFromDeliverable(deliverableId);
      console.log("Blob récupéré :", blob); // Vérifiez ici si le blob est valide

      const fileUrl = URL.createObjectURL(blob);
      console.log("URL du fichier :", fileUrl);
      const realDeliverable: Deliverable = {
        id: deliverableId,
        name: "Nom du fichier",
        taskName: "Nom de la tâche associée",
        submittedAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        status: 'en attente',
        fileUrl: fileUrl,
        fileSize: formatBytes(blob.size),
        fileType: blob.type,
        comments: 0
      };
  
      setDeliverable(realDeliverable);
    } catch (error) {
      console.error("Erreur de chargement du livrable :", error);
      toast.error("Erreur lors du chargement du livrable.");
      navigate("/groups"); // ou un autre fallback ?
    } finally {
      setLoading(false);
    }
  };
  
  
  return {
    deliverable,
    loading,
    reviewStatus,
    setReviewStatus,
  
  };
};
