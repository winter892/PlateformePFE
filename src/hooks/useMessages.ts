import { useEffect, useState } from "react";
import axios from "axios";

export interface Auteur {
  id: number;
  nom: string;
  role : string;
}

export interface MessageLivrable {
  id: number;
  contenu: string;
  dateEnvoi: string;
  auteur: Auteur;
}

export default function useMessages(livrableId: number): MessageLivrable[] {
  const [messages, setMessages] = useState<MessageLivrable[]>([]); // 👈 bien initialiser à []

  useEffect(() => {
   const fetchMessages = () => {
  const token = localStorage.getItem("token");

  axios.get(`http://localhost:8080/api/messages-livrable/${livrableId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        setMessages([]); // fallback en cas d'objet ou erreur
        console.error("La réponse n'est pas un tableau :", res.data);
      }
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des messages :", err);
      setMessages([]);
    });
};


    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, [livrableId]);

  return messages;
}
