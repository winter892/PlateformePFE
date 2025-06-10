
import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeliverableViewer from '@/components/DeliverableReview/DeliverableViewer';
import ChatPanel from '@/components/DeliverableReview/ChatPanel';
import ReviewHeader from '@/components/DeliverableReview/ReviewHeader';
import ResizablePanel from '@/components/DeliverableReview/ResizablePanel';
import LoadingState from '@/components/DeliverableReview/LoadingState';
import { useDeliverable } from '@/hooks/useDeliverable';
import { useChat } from '@/hooks/useChat';
import ChatLivrable from "@/pages/DashboardEtudiant/chat/ChatLivrable"; 

import { ArrowLeft } from 'lucide-react';
import ChatLivrableEncadrant from './chat/ChatLivrableEncadrant';

const DeliverableReviewPage = () => {
  const navigate = useNavigate();
  const { deliverable, loading, reviewStatus, setReviewStatus } = useDeliverable();
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
  
  const [setShowAllGroupsConfirm] = useState(false);

  const handleNavigateBack = () => {
    navigate('/groups');
  };


  const handleApproveDeliverable = (applyToAll = false) => {
    setReviewStatus({
      progress: 100,
      status: 'approved'
    });
    
  };


  if (loading) {
    return <LoadingState />;
  }

   const userIdd = localStorage.getItem('id');
  const teken = localStorage.getItem('token');
  const userIddd= parseInt(userIdd);
   const { deliverableId } = useParams();
  const deliverableIdd = parseInt(deliverableId || '0');

  if (!userIdd || !deliverableIdd) {
    return <div className="p-4">Livrable non trouvé.</div>;
  }
  
  console.log("id user ",teken);
  return (
    
    
      <div className="flex h-[calc(100vh-0.5rem)] overflow-hidden">
        <ResizablePanel 
          chatExpanded={chatExpanded} 
          onToggle={toggleChatPanel}
          layoutConfig={layoutConfig}
        >
        <ChatLivrableEncadrant onToggleChat={toggleChatPanel} livrableId={deliverableIdd} userId={userIddd} />

        </ResizablePanel>
        
        <div className={`transition-all duration-300 bg-gray-50 ${layoutConfig.viewerWidth}`}>
          <div className="h-full flex flex-col">
            <ReviewHeader 
              deliverable={deliverable}
              reviewStatus={reviewStatus}
              onApproveDeliverable={handleApproveDeliverable}
              handleNavigateBack={handleNavigateBack}
            />
            
            <div className="flex-1 overflow-auto p-6">
              <DeliverableViewer 
                deliverable={deliverable} 
              />
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default DeliverableReviewPage;
