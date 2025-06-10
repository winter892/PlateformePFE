import React from 'react';
import { Message } from '@/pages/DashboardEtudiant/chat/ChatInterfaces';

interface MessageItemProps {
  message: Message;
  formatTime: (date: Date) => string;
}

const MessageItemEtudiant: React.FC<MessageItemProps> = ({ message, formatTime }) => {
  const isSelf = message.sender === 'self';
  const isTeacher = message.sender === 'teacher';

  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isTeacher
            ? 'bg-violet-100 text-violet-900'
            : isSelf
            ? 'bg-blue-100 text-blue-900'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium text-xs">
            {isSelf ? 'Vous' : message.senderName}
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
