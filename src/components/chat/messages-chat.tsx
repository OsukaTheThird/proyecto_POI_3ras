import { useEffect, useRef, useState } from 'react';
import Message from './message';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { format } from 'timeago.js';
import { Friend, Group, useChatStore } from '@/store/chat-store';

interface MessagesChatProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}

interface MessageInterface {
  uid: string;
  message: string;
  timestamp: number;
  isLocation: false;
  isEncrypted: false;
}

const MessagesChat: React.FC<MessagesChatProps> = ({  }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();
  const { currentUser } = useAuth();
  const { getRoomId, isGroupChat, getChatData, isEncrypted: isChatEncrypted } = useChatStore();
  const roomId = getRoomId();

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: Mostrar estado de encriptación
  console.log(`[MessagesChat] Chat encriptado: ${isChatEncrypted}, RoomID: ${roomId}`);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      const messagesData = doc.data()?.messages || [];
      console.log('[MessagesChat] Mensajes recibidos:', messagesData);

      const processedMessages = messagesData.map((msg: any) => {
        // Debug: Ver mensaje antes de procesar
        console.log(`[MessagesChat] Procesando mensaje:`, msg);
        
        return {
          ...msg,
          // Mantener el flag de encriptación si ya existe, o usar el estado actual del chat
          isEncrypted: msg.hasOwnProperty('isEncrypted') ? msg.isEncrypted : isChatEncrypted
        };
      });

      console.log('[MessagesChat] Mensajes procesados:', processedMessages);
      setMessages(processedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, db, isChatEncrypted]);

 useEffect(() => {
  if (!roomId) return;

  const roomRef = doc(db, 'rooms', roomId);
  const unsubscribe = onSnapshot(roomRef, async (doc) => {
    const messagesData = doc.data()?.messages || [];

    // Procesamos y desencriptamos los mensajes
    const processedMessages = await Promise.all(
      messagesData.map(async (msg: any) => {
        const isEncrypted = msg.hasOwnProperty('isEncrypted') ? msg.isEncrypted : isChatEncrypted;

        // Si el mensaje es encriptado y NO lo envió el usuario actual, lo desencriptamos
        if (isEncrypted && msg.uid !== currentUser?.uid) {
          try {
            msg.message = await decryptMessage(msg.message);
          } catch (e) {
            console.error("Error al desencriptar:", e);
            msg.message = "🔒 Error al desencriptar";
          }
        }

        return {
          ...msg,
          isEncrypted,
        };
      })
    );

    setMessages(processedMessages);
    setLoading(false);
  });

  return () => unsubscribe();
}, [roomId, db, isChatEncrypted, currentUser?.uid]);

  if (!roomId) {
    console.log('[MessagesChat] No hay roomId seleccionado');
    return null;
  }

  if (loading) {
    return <div className="p-4 text-center">Cargando mensajes...</div>;
  }

  console.log('[MessagesChat] Renderizando mensajes:', messages);

  return (
  <main ref={containerRef} className="p-4 flex-1 bg-gray-50 space-y-4 overflow-y-auto">
    {messages.map((message, index) => {
      const isCurrentUser = message.uid === currentUser?.uid;
      const chatData = getChatData();
      const senderPhoto = isCurrentUser 
          ? currentUser?.photoURL 
          : isGroupChat() 
            ? (chatData as Group)?.photoURL 
            : (chatData as Friend)?.photoURL;

        console.log(`[MessagesChat] Renderizando mensaje ${index}:`, {
          ...message,
          isCurrentUser,
          isEncrypted: message.isEncrypted
        });

        // Dummy synchronous decryption for demonstration; replace with real logic as needed
        function decryptMessage(message: string): string {
          // TODO: Replace with actual decryption logic
          return `[decrypted] ${message}`;
        }

return (
        <Message
          key={`${message.uid}-${message.timestamp}-${index}`}
          message={message.message}
          time={format(message.timestamp)}
          photoURL={senderPhoto || '/default-user.png'}
          isCurrentUser={isCurrentUser}
          isLocation={message.isLocation}
          isEncrypted={message.isEncrypted}  senderName={
    (isCurrentUser ? currentUser?.displayName : (chatData as Friend)?.displayName) ?? undefined
  }
/>

  );
})}
    </main>
  );
};

export default MessagesChat;

function decryptMessage(message: any): any {
  throw new Error('Function not implemented.');
}
