
import React, { useState } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import { toast } from 'sonner';
//import DashboardLayout from '@/components/Layout/DashboardLayout';
import DeliverableViewerEtudiant from '@/pages/DashboardEtudiant/DeliverableViewerEtudiant';
import ChatPanel from '@/pages/DashboardEtudiant/chatEtudiant/ChatPanelEtudiant';
import ReviewHeaderEtudiant from '@/pages/DashboardEtudiant/ReviewHeaderEtudiant';
import ResizablePanelEtudiant from '@/pages/DashboardEtudiant/chatEtudiant/ResizablePanelEtudiant';
import LoadingState from '@/pages/DashboardEtudiant/LoadingStateEtudiant';
import { useDeliverable } from '@/hooks/useDeliverable';
import { useChat } from '@/hooks/useChat';

import ChatLivrable from "@/pages/DashboardEtudiant/chat/ChatLivrable"; 
import { ArrowLeft } from 'lucide-react';

const DeliverableReviewPageEtudiant = () => {
  const navigate = useNavigate();
  const { deliverable, loading, reviewStatus, setReviewStatus} = useDeliverable();
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    chatExpanded, 
    layoutConfig, 
    toggleChatPanel, 
    messagesEndRef,
    setMessages
  } = useChat();
  
  const [showAllGroupsConfirm, setShowAllGroupsConfirm] = useState(false);
    const { deliverableId } = useParams();

  const handleNavigateBack = () => {
    if (deliverable) {
      navigate(`/tasks`);
    }
  };

  

  const handleApproveDeliverable = (applyToAll = false) => {
    setReviewStatus({
      progress: 100,
      status: 'approved'
    });
    
    const message = applyToAll
      ? "J'ai validé ce livrable pour tous les groupes. Excellent travail collectif !"
      : "J'ai validé ce livrable. Excellent travail !";
    
    toast.success(applyToAll ? "Livrable validé pour tous les groupes !" : "Livrable validé avec succès !");
    
    if (applyToAll) {
      setShowAllGroupsConfirm(false);
    }
    
    const approvalMessage = {
      id: messages.length + 1,
      sender: 'teacher' as const,
      senderName: 'Mouhammed OUTANNOUT',
      content: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, approvalMessage]);
  };

  const handleRequestChanges = (applyToAll = false) => {
    setReviewStatus({
      progress: 70,
      status: 'needsRevision'
    });
    
    const message = applyToAll
      ? "J'ai besoin que tous les groupes effectuent des modifications sur ce livrable, notamment sur la partie analyse des besoins qui manque de précision."
      : "J'ai besoin de quelques modifications sur ce livrable, notamment sur la partie analyse des besoins qui manque de précision.";
    
    toast.info(applyToAll ? "Demande de modifications envoyée à tous les groupes" : "Demande de modifications envoyée");
    
    if (applyToAll) {
      setShowAllGroupsConfirm(false);
    }
    
    const changesMessage = {
      id: messages.length + 1,
      sender: 'teacher' as const,
      senderName: 'Mouhammed OUTANNOUT',
      content: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, changesMessage]);
  };

  if (loading) {
    return <LoadingState />;
  }

  const userIdd = localStorage.getItem('id');
  const teken = localStorage.getItem('token');
  const userIddd= parseInt(userIdd);
  const deliverableIdd = parseInt(deliverableId || '0');

  if (!userIdd || !deliverableIdd) {
    return <div className="p-4">Livrable non trouvé.</div>;
  }
  console.log("id user ",teken);
  return (

   
      <div className="flex h-[calc(100vh-0.5rem)] overflow-hidden">

        <ResizablePanelEtudiant
        chatExpanded={chatExpanded}
        onToggle={toggleChatPanel}
        layoutConfig={layoutConfig}
      >
        <ChatLivrable onToggleChat={toggleChatPanel} livrableId={deliverableIdd} userId={userIddd} />

        </ResizablePanelEtudiant>
        
        <div className={`transition-all duration-300 bg-gray-50 ${layoutConfig.viewerWidth}`}>
          <div className="h-full flex flex-col">
            <ReviewHeaderEtudiant 
              deliverables={deliverable}
              reviewStatus={reviewStatus}
              onRequestChanges={handleRequestChanges}
              onApproveDeliverable={handleApproveDeliverable}
              showAllGroupsConfirm={showAllGroupsConfirm}
              handleNavigateBack={handleNavigateBack}
            />
            
            <div className="flex-1 overflow-auto p-6">
              <DeliverableViewerEtudiant 
                deliverable={deliverable} 
              />
            </div>
          </div>
        </div>
      </div>

    
  );
};

export default DeliverableReviewPageEtudiant;
