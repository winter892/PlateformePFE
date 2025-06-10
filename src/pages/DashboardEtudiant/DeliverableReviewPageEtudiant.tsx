
import React, { useState } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
//import DashboardLayout from '@/components/Layout/DashboardLayout';
import DeliverableViewerEtudiant from '@/pages/DashboardEtudiant/DeliverableViewerEtudiant';
import ReviewHeaderEtudiant from '@/pages/DashboardEtudiant/ReviewHeaderEtudiant';
import ResizablePanelEtudiant from '@/pages/DashboardEtudiant/chatEtudiant/ResizablePanelEtudiant';
import LoadingState from '@/pages/DashboardEtudiant/LoadingStateEtudiant';
import { useDeliverable } from '@/hooks/useDeliverable';
import { useChat } from '@/hooks/useChat';

import ChatLivrable from "@/pages/DashboardEtudiant/chat/ChatLivrable"; 

const DeliverableReviewPageEtudiant = () => {
  const navigate = useNavigate();
  const { deliverable, loading, reviewStatus} = useDeliverable();
  const { 
    chatExpanded, 
    layoutConfig, 
    toggleChatPanel, 

  } = useChat();
  
    const { deliverableId } = useParams();

  const handleNavigateBack = () => {
    if (deliverable) {
      navigate(`/tasks`);
    }
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
