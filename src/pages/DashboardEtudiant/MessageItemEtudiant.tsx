
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
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="bg-white bg-opacity-50 rounded p-2 text-xs flex items-center">
                <div className="mr-2">📎</div>
                <span className="truncate flex-1">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItemEtudiant;
