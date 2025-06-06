
import React from 'react';
import { Message } from '@/components/DeliverableReview/interfaces/ChatInterfaces';

interface MessageItemProps {
  message: Message;
  formatTime: (date: Date) => string;
}

const MessageItemEtudiant: React.FC<MessageItemProps> = ({ message, formatTime }) => {
  return (
    <div className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[60%] rounded-lg p-3 ${message.sender === 'teacher' ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-900'}`}>
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium text-xs">
          
            {message.sender === 'teacher' ? 'Vous' : message.senderName}
          </span>
          <span className="text-xs opacity-70 ml-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
  
      </div>
    </div>
  );
};

export default MessageItemEtudiant;
