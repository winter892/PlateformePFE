
import React from 'react';
import ChatHeader from './ChatHeaderEtudiant';
import MessagesContainer from '../messageEtudiant/MessagesContainerEtudiant';
import MessageInput from '../messageEtudiant/MessageInputEtudiant';
import { ChatPanelProps } from '@/components/DeliverableReview/interfaces/ChatInterfaces';
import { formatTime, groupMessagesByDate } from '@/components/DeliverableReview/utils/dateUtils';

const ChatPanelEtudiant: React.FC<ChatPanelProps> = ({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  messagesEndRef,
  onToggleChat
}) => {
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <ChatHeader onToggleChat={onToggleChat} />
      
      {/* Messages container */}
      <MessagesContainer 
        groupedMessages={groupedMessages} 
        formatTime={formatTime} 
        messagesEndRef={messagesEndRef} 
      />
      
      {/* Message input */}
      <MessageInput 
        newMessage={newMessage} 
        onMessageChange={onMessageChange} 
        onSendMessage={onSendMessage} 
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatPanelEtudiant;
