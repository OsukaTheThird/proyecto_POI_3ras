import { useFriendPresence } from '@/hooks/useFriendPresence';
import { cn } from '@/lib/utils';
import { Friend, useChatStore } from '@/store/chat-store';
import React from 'react';

interface MessageProps {
  message: string;
  time: string;
  photoURL: string;
  isCurrentUser: boolean;
  senderName?: string;
  isEncrypted?: boolean; // Nuevo prop para identificar mensajes encriptados
  isLocation?: boolean; // Para manejar mensajes de ubicación
}

const Message = ({ 
  message, 
  time, 
  photoURL, 
  isCurrentUser, 
  senderName,
  isEncrypted = false,
  isLocation = false 
}: MessageProps) => {
  const { currentChat, getChatData, isEncrypted: isChatEncrypted, decryptMessage } = useChatStore();
  const chatData = getChatData();

  useFriendPresence(currentChat?.type === 'friend' ? (chatData as Friend)?.uid : undefined);

  const displayMessage = () => {
    // Si el mensaje es una ubicación
    if (isLocation) {
      try {
        const url = isEncrypted ? decryptMessage(message) : message;
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📍 Ver ubicación
          </a>
        );
      } catch {
        return "📍 [Ubicación encriptada]";
      }
    }

    // Si el mensaje está encriptado
    if (isEncrypted) {
      try {
        // Solo el usuario actual puede desencriptar sus propios mensajes
        // Los mensajes de otros usuarios requieren que el chat esté en modo desencriptado
        if (isCurrentUser || !isChatEncrypted) {
          return decryptMessage(message);
        }
        return "🔒 [Mensaje encriptado]";
      } catch {
        return "🔒 [Error al desencriptar]";
      }
    }

    // Mensaje normal
    return message;
  };

  return (
    <article className={cn('flex gap-x-2', { 
      "flex-row-reverse": isCurrentUser, 
      "flex-row": !isCurrentUser 
    })}>
      {!isCurrentUser && (
        <img src={photoURL} alt={senderName || 'Usuario'} className='rounded-full size-10' />
      )}
      
      <div className={cn('p-2 rounded-md max-w-[70%]', { 
        "bg-white": isCurrentUser,
        "bg-gray-100": !isCurrentUser,
        "border border-gray-300": isEncrypted,
        "bg-blue-50": isLocation
      })}>
        {!isCurrentUser && senderName && (
          <p className="font-semibold text-sm mb-1">{senderName}</p>
        )}
        
        <p className={cn({
          "text-green-800": !isCurrentUser && !isEncrypted,
          "text-gray-800": isCurrentUser && !isEncrypted,
          "text-gray-500": isEncrypted
        })}>
          {displayMessage()}
        </p>
        
        <p className='text-xs text-gray-500 text-right mt-1'>{time}</p>
        
        {(isEncrypted || isLocation) && (
          <p className="text-xs text-gray-400 mt-1 text-right">
            {isLocation ? '📍 Ubicación' : '🔒 Encriptado'}
          </p>
        )}
      </div>
      
      {isCurrentUser && (
        <img src={photoURL} alt="Tú" className='rounded-full size-10' />
      )}
    </article>
  );
};

export default Message;