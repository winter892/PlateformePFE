
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface Message {
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

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatExpanded, setChatExpanded] = useState(true);
  const [layoutConfig, setLayoutConfig] = useState({
    chatWidth: 'w-1/3',
    viewerWidth: 'flex-1'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    const mockMessages: Message[] = [
      {
        id: 1,
        sender: 'student',
        senderName: 'Marie Dupont',
        content: "Bonjour Professeur, j'ai soumis le rapport d'analyse comme convenu.",
        timestamp: new Date(Date.now() - 3600000 * 2)
      },
      {
        id: 2,
        sender: 'teacher',
        senderName: 'Jean Dupont',
        content: "Merci Marie, je vais l'examiner et vous donner mes retours.",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 3,
        sender: 'student',
        senderName: 'Marie Dupont',
        content: "Parfait, n'hésitez pas si vous avez des questions sur la partie 3 concernant l'architecture proposée.",
        timestamp: new Date(Date.now() - 1800000)
      }
    ];
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMessageObj: Message = {
      id: messages.length + 1,
      sender: 'teacher',
      senderName: 'Jean Dupont',
      content: newMessage.trim(),
      timestamp: new Date()
    };
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    simulateStudentResponse();
  };

  const simulateStudentResponse = () => {
    setTimeout(() => {
      const studentResponse: Message = {
        id: messages.length + 2,
        sender: 'student',
        senderName: 'Marie Dupont',
        content: "Merci pour votre retour, je vais prendre en compte vos remarques.",
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, studentResponse]);
      toast.info("Nouveau message de Marie Dupont");
    }, 8000);
  };

  const toggleChatPanel = () => {
    setChatExpanded(!chatExpanded);
    if (chatExpanded) {
      setLayoutConfig({
        chatWidth: 'w-14',
        viewerWidth: 'flex-1'
      });
    } else {
      setLayoutConfig({
        chatWidth: 'w-1/3',
        viewerWidth: 'flex-1'
      });
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    chatExpanded,
    layoutConfig,
    toggleChatPanel,
    messagesEndRef,
    setMessages,
  };
};
