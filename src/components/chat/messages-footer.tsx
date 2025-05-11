import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BsFillSendFill } from "react-icons/bs";
import { arrayUnion, doc, Firestore, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { Friend, Group, useChatStore } from '@/store/chat-store';

interface MessagesFooterProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}


const MessagesFooter: React.FC<MessagesFooterProps> = ({  }) => {
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const db = useFirestore();
  const { getRoomId, getChatData, isGroupChat } = useChatStore();
  const roomId = getRoomId();
  const chatData = getChatData();

  const { setTypingStatus } = useChatStore();

  // Indicador de "escribiendo"
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Activar indicador de "escribiendo"
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
    
    // Reiniciar el timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 3000);
  };

  const updateTypingStatus = async (typing: boolean) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        'status.isTyping': typing,
        'status.lastUpdated': serverTimestamp()
      });
      
      // Actualizar el store local
      setTypingStatus(currentUser.uid, typing);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        updateTypingStatus(false);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message || !currentUser || !roomId || !chatData) return;

    try {
      const messageData = {
        message,
        timestamp: new Date().toISOString(),
        uid: currentUser.uid
      };

      // Actualizar la sala de chat
      await updateDoc(doc(db, "rooms", roomId), {
        messages: arrayUnion(messageData),
        lastMessage: message,
        lastMessageTime: new Date().toISOString()
      });

      // Actualizar lastMessage para todos los miembros
      if (isGroupChat()) {
        const groupData = chatData as Group;
        await Promise.all(
          groupData.uid.map(async (userId) => {
            await updateLastMessage(db, userId, roomId, message);
          })
        );
      } else {
        // Para chat individual
        const friendData = chatData as Friend;
        await updateLastMessage(db, currentUser.uid, roomId, message);
        await updateLastMessage(db, friendData.uid, roomId, message);
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateLastMessage = async (db: Firestore, uid: string, roomid: string, message: string) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;
    
    const rooms = userDoc.data().rooms || [];
    const updatedRooms = rooms.map((room: any) => {
      if (room.roomid === roomid) {
        return {
          ...room,
          lastMessage: message,
          timestamp: new Date().toISOString(),
        };
      }
      return room;
    });
    
    await updateDoc(userRef, { rooms: updatedRooms });
  };

  return (
    <footer className="p-4 border-t flex gap-x-2">
      <Input
        type="text"
        placeholder={isGroupChat() ? "Escribe al grupo..." : "Escribe un mensaje..."}
        className="w-full p-2 border rounded-lg"
        value={message}
        onChange={handleInputChange}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <Button onClick={handleSendMessage}>
        <BsFillSendFill />
      </Button>
    </footer>
  );
};

export default MessagesFooter;