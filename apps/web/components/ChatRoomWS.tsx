"use client"
import { useEffect, useState } from 'react';

export default function ChatRoomWS({ chats, roomId } : { chats: never[], roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); // Store received messages
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return; // Prevent creating a socket if token is not available

    const newSocket = new WebSocket(`${WS_URL}?token=${token}`);

    newSocket.onopen = () => {
      console.log('Connected to WebSocket');
      newSocket.send(JSON.stringify({ type: "join_room", roomId: roomId }));
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]); // Store received messages
    };

    setSocket(newSocket);

    return () => {
      console.log('Closing WebSocket...');
      newSocket.close();
    };
  }, [token, roomId]);

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && newMessage.trim()) {
      socket.send(JSON.stringify({ type: "chat", roomId, message: newMessage }));
      setMessages((prev) => [...prev, newMessage])
      setNewMessage(''); // Clear input after sending
    }
  };

  return (
    <div>
      <h2>CHAT ROOM WS CLIENT</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleForm}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Reply back"
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}
