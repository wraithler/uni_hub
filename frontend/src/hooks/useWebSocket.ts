import { useEffect, useRef, useState } from 'react';
import { Message, WebSocketMessage } from '@/types';

const useWebSocket = (
  chatId: string,
  onMessageReceived: (message: WebSocketMessage) => void,
  onTyping: (sender: string) => void
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL;
    const ws = new WebSocket(`${url}/private_chat/${chatId}`);

    ws.onopen = () => {
      console.log('WS Connected');
    };

    ws.onclose = () => {
      console.log('WS Disconnected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        onMessageReceived(data);
      } else if (data.type === 'typing') {
        onTyping(data.sender);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [chatId]);

  const sendMessage = (message: Message) => {
    if (socket) {
      const data: WebSocketMessage = { type: 'message', content: message.content };
      socket.send(JSON.stringify(data));
    }
  };

  const sendTyping = () => {
    if (socket) {
      const data: WebSocketMessage = { type: 'typing' };
      socket.send(JSON.stringify(data));
    }
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  return { sendMessage, sendTyping, isTyping };
};

export default useWebSocket;
