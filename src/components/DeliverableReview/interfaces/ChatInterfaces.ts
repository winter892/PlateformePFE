
export interface Message {
    id: number;
    sender: 'teacher' | 'student';
    senderName: string;
    content: string;
    timestamp: Date;
    attachments?: {
      name: string;
      url: string;
    }[];
  }
  
  export interface ChatPanelProps {
    messages: Message[];
    newMessage: string;
    onMessageChange: (message: string) => void;
    onSendMessage: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onToggleChat: () => void;
  }
  