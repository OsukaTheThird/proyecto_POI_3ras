import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BsFillSendFill, BsGeoAlt } from "react-icons/bs";
import { arrayUnion, doc, Firestore, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { Friend, Group, useChatStore } from '@/store/chat-store';

interface MessagesFooterProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}

const MessagesFooter: React.FC<MessagesFooterProps> = ({ }) => {
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  const db = useFirestore();
  const { getRoomId, getChatData, isGroupChat, setTypingStatus, isEncrypted, encryptMessage } = useChatStore();
  const roomId = getRoomId();
  const chatData = getChatData();

  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (currentUser) {
      setTypingStatus(currentUser.uid, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(currentUser.uid, false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (currentUser) {
        setTypingStatus(currentUser.uid, false);
      }
    };
  }, [currentUser, setTypingStatus]);

  const handleSendMessage = async () => {
    if (!message || !currentUser || !roomId || !chatData) return;

    try {
      // Encriptar el mensaje si está activa la encriptación
      const messageToSend = isEncrypted ? encryptMessage(message) : message;
      const lastMessageDisplay = isEncrypted ? "🔒 Mensaje encriptado" : message;

      const messageData = {
        message: messageToSend,
        timestamp: new Date().toISOString(),
        uid: currentUser.uid,
        isEncrypted: isEncrypted // Añadimos este flag para identificar mensajes encriptados
      };

      // Actualizar la sala de chat
      await updateDoc(doc(db, "rooms", roomId), {
        messages: arrayUnion(messageData),
        lastMessage: lastMessageDisplay,
        lastMessageTime: new Date().toISOString()
      });

      // Actualizar lastMessage para todos los miembros
      if (isGroupChat()) {
        const groupData = chatData as Group;
        await Promise.all(
          groupData.uid.map(async (userId) => {
            await updateLastMessage(db, userId, roomId, lastMessageDisplay);
          })
        );
      } else {
        // Para chat individual
        const friendData = chatData as Friend;
        await updateLastMessage(db, currentUser.uid, roomId, lastMessageDisplay);
        await updateLastMessage(db, friendData.uid, roomId, lastMessageDisplay);
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

  const handleSendLocation = async () => {
    if (!currentUser || !roomId || !chatData) return;

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const locationMessage = isEncrypted ? encryptMessage(mapsUrl) : mapsUrl;
          const lastMessageDisplay = "📍 Ubicación compartida";

          const messageData = {
            message: locationMessage,
            timestamp: new Date().toISOString(),
            uid: currentUser.uid,
            isLocation: true,
            isEncrypted: isEncrypted
          };

          await updateDoc(doc(db, "rooms", roomId), {
            messages: arrayUnion(messageData),
            lastMessage: lastMessageDisplay,
            lastMessageTime: new Date().toISOString()
          });

          if (isGroupChat()) {
            const groupData = chatData as Group;
            await Promise.all(
              groupData.uid.map(async (userId) => {
                await updateLastMessage(db, userId, roomId, lastMessageDisplay);
              })
            );
          } else {
            const friendData = chatData as Friend;
            await updateLastMessage(db, currentUser.uid, roomId, lastMessageDisplay);
            await updateLastMessage(db, friendData.uid, roomId, lastMessageDisplay);
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert("No se pudo obtener la ubicación. Asegúrate de haber concedido los permisos.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } catch (error) {
      console.error("Error enviando ubicación:", error);
    }
  };

  return (
    <footer className="p-4 border-t flex gap-x-2 items-center">
      <Button 
        variant="outline" 
        className="p-2"
        onClick={handleSendLocation}
        title="Enviar ubicación"
      >
        <BsGeoAlt />
      </Button>
      
      <Input
        type="text"
        placeholder={isGroupChat() ? "Escribe al grupo..." : "Escribe un mensaje..."}
        className="flex-1 p-2 border rounded-lg"
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