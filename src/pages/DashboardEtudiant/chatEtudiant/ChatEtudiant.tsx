import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import ChatPanelEtudiant from "./ChatPanelEtudiant";
import { Message } from "@/components/DeliverableReview/interfaces/ChatInterfaces";
import { getUserById } from '@/services/userService';

const ChatEtudiant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<any>(null);
  const iduser = localStorage.getItem('id');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    
    stompClient.connect({}, () => {
      console.log("🟢 Connecté au serveur WebSocket");
      
      stompClient.subscribe("/topic/messages", (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        receivedMessage.timestamp = new Date(receivedMessage.timestamp);
        setMessages((prev) => [...prev, receivedMessage]);
      });

      setClient(stompClient);
    });

    return () => {
      stompClient.disconnect(() => console.log("🔴 Déconnecté"));
    };
  }, []);

  useEffect(() => {
    if (iduser) {
      getUserById(iduser)
        .then(data => setStudentInfo(data))
        .catch(err => console.error(err));
    }
  }, [iduser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (client && newMessage.trim()) {
      const messagePayload: Message = {
        id: Date.now(),
        sender: "student",
        senderName: studentInfo ? `${studentInfo.nom} ${studentInfo.prenom}` : "Étudiant",
        content: newMessage,
        timestamp: new Date(),
      };
      client.send("/app/chat", {}, JSON.stringify(messagePayload));
      setMessages((prev) => [...prev, messagePayload]);
      setNewMessage("");
    }
  };

  return (
    <ChatPanelEtudiant
      messages={messages}
      newMessage={newMessage}
      onMessageChange={setNewMessage}
      onSendMessage={sendMessage}
      messagesEndRef={messagesEndRef}
      onToggleChat={() => {}}
    />
  );
};

export default ChatEtudiant;
