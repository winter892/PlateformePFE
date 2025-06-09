
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import DeliverableViewer from '@/components/DeliverableReview/DeliverableViewer';
import ChatPanel from '@/components/DeliverableReview/ChatPanel';
import ReviewHeader from '@/components/DeliverableReview/ReviewHeader';
import ResizablePanel from '@/components/DeliverableReview/ResizablePanel';
import LoadingState from '@/components/DeliverableReview/LoadingState';
import { useDeliverable } from '@/hooks/useDeliverable';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft } from 'lucide-react';

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
  
  const [showAllGroupsConfirm, setShowAllGroupsConfirm] = useState(false);

  const handleNavigateBack = () => {
    navigate('/groups');
  };

  const handleAddAnnotation = (annotation: string) => {
    toast.success("Annotation ajoutée");
    const annotationMessage = {
      id: messages.length + 1,
      sender: 'teacher' as const,
      senderName: 'Jean Dupont',
      content: `J'ai ajouté une annotation: "${annotation}"`,
      timestamp: new Date()
    };
    setMessages([...messages, annotationMessage]);
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
      senderName: 'Jean Dupont',
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
      senderName: 'Jean Dupont',
      content: message,
      timestamp: new Date()
    };
    
    setMessages([...messages, changesMessage]);
  };

  if (loading) {
    return <LoadingState />;
  }

  
  return (
    
    
      <div className="flex h-[calc(100vh-0.5rem)] overflow-hidden">
        <ResizablePanel 
          chatExpanded={chatExpanded} 
          onToggle={toggleChatPanel}
          layoutConfig={layoutConfig}
        >
          <ChatPanel 
            messages={messages} 
            newMessage={newMessage} 
            onMessageChange={setNewMessage} 
            onSendMessage={handleSendMessage} 
            messagesEndRef={messagesEndRef} 
            onToggleChat={toggleChatPanel} 
          />
        </ResizablePanel>
        
        <div className={`transition-all duration-300 bg-gray-50 ${layoutConfig.viewerWidth}`}>
          <div className="h-full flex flex-col">
            <ReviewHeader 
              deliverable={deliverable}
              reviewStatus={reviewStatus}
              onRequestChanges={handleRequestChanges}
              onApproveDeliverable={handleApproveDeliverable}
              showAllGroupsConfirm={showAllGroupsConfirm}
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
