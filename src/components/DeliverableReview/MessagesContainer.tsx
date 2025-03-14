
import React from 'react';
import MessageItem from './MessageItem';
import { Message } from './interfaces/ChatInterfaces';

interface MessagesContainerProps {
  groupedMessages: {
    date: string;
    messages: Message[];
  }[];
  formatTime: (date: Date) => string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({
  groupedMessages,
  formatTime,
  messagesEndRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-3">
            <div className="border-t border-violet-100 flex-grow"></div>
            <div className="mx-3 text-xs text-violet-500 font-medium">{group.date}</div>
            <div className="border-t border-violet-100 flex-grow"></div>
          </div>
          
          {/* Messages for this date */}
          {group.messages.map(message => (
            <MessageItem 
              key={message.id} 
              message={message} 
              formatTime={formatTime} 
            />
          ))}
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;
