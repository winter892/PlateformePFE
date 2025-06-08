import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

let stompClient: CompatClient | null = null;

function Chat() {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient?.subscribe("/topic/messages", (msg) => {
        const newMsg = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMsg]);
      });
    });
  }, []);

  const sendMessage = () => {
    if (stompClient && input.trim() !== "") {
      stompClient.send("/app/chat", {}, JSON.stringify({
        sender: "Vous",
        content: input,
      }));
      setInput("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.sender}</strong>: {m.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}

export default Chat;
