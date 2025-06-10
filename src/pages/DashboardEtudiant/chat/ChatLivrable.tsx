import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useMessages, { MessageLivrable } from "@/hooks/useMessages";
import ChatHeaderEtudiant from '@/pages/DashboardEtudiant/chatEtudiant/ChatHeaderEtudiant';
import MessageInputEtudiant from '@/pages/DashboardEtudiant/messageEtudiant/MessageInputEtudiant';
import { getUserById } from '@/services/userService';
import { ChatLivrableProps } from '@/components/DeliverableReview/interfaces/ChatInterfaces';
import MessagesContainerEtudiant from '@/pages/DashboardEtudiant/messageEtudiant/MessagesContainerEtudiant'; // ✅
import { RawMessage, Message } from './ChatInterfaces'; // ✅

const ChatLivrable: React.FC<ChatLivrableProps> = ({ livrableId, userId, onToggleChat = () => {} }) => {
  const messages: MessageLivrable[] = useMessages(livrableId);
  const [contenu, setContenu] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // ✅

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const data = await getUserById(userId);
          setUserInfo(data);
        } catch (error) {
          console.error("Erreur lors du chargement des donnés :", error);
        }
      }
    };

    fetchData();
  }, [userId]);

  if (!userId || !userInfo) {
    return <div className="p-4">Chargement des informations...</div>;
  }

  const currentUser = {
    id: userInfo.id,
    nom: userInfo.nom,
    role: userInfo.role
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const groupMessagesByDate = (messagess: RawMessage[]) => {
    const grouped: Record<string, Message[]> = {};

    messages.forEach((msg) => {
      const date = new Date(msg.dateEnvoi).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!grouped[date]) grouped[date] = [];

      const sender =
        msg.auteur.id === currentUser.id
          ? "self"
          : msg.auteur.role === "ENCADRANT"
          ? "teacher"
          : "other";

      grouped[date].push({
        id: msg.id,
        content: msg.contenu,
        timestamp: new Date(msg.dateEnvoi),
        sender,
        senderName: msg.auteur.nom
      });
    });

    return Object.entries(grouped).map(([date, messages]) => ({
      date,
      messages,
    }));
  };

  const envoyerMessage = () => {
    if (contenu.trim() === "") return;

    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:8080/api/messages-livrable",
        {
          livrableId,
          auteurId: userId,
          contenu,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => setContenu(""))
      .catch((error) => {
        console.error("Erreur lors de l'envoi du message :", error);
      });
  };
const rawMessages: RawMessage[] = messages.map((msg) => ({
  id: msg.id,
  contenu: msg.contenu,
  dateEnvoi: msg.dateEnvoi,
  auteur: {
    id: msg.auteur.id,
    nom: msg.auteur.nom,
    role: msg.auteur.role as "ENCADRANT" | "ETUDIANT" // ✅ conversion explicite
  }
}));

  return (
    <div className="flex flex-col h-screen">
      {/* Header du chat */}
      <ChatHeaderEtudiant onToggleChat={onToggleChat ?? (() => {})} />

      {/* Corps principal du chat */}
      <div className="flex flex-col flex-1 border p-2 shadow overflow-hidden">
        {/* Liste des messages avec structure avancée */}
        <MessagesContainerEtudiant
          groupedMessages={groupMessagesByDate(rawMessages)}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
        />

        {/* Input message */}
        <MessageInputEtudiant
          newMessage={contenu}
          onMessageChange={setContenu}
          onSendMessage={envoyerMessage}
          handleKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              envoyerMessage();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatLivrable;
