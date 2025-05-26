import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat-store';
import { FaMapMarkerAlt, FaLock } from 'react-icons/fa';

type MessageProps = {
  message: string;
  time: string;
  photoURL: string;
  isCurrentUser: boolean;
  isLocation: boolean;
  isEncrypted: boolean;
  senderName?: string;
};

const Message = ({ 
  message, 
  time, 
  /* photoURL, */ 
  isCurrentUser, 
  isEncrypted,
  isLocation,
  senderName 
}: MessageProps) => {
  const { decryptedMessages } = useChatStore();

  
  const renderContent = () => {
    if (isEncrypted) {
      // Buscar en los mensajes desencriptados
      const decrypted = decryptedMessages[message];
      if (decrypted) {
        return decrypted;
      }
      
      // Si no está desencriptado aún
      return (
        <div className="flex items-center gap-1 text-sm italic">
          <FaLock className="h-3 w-3" />
          Mensaje encriptado
        </div>
      );
    }
    // Mensaje de ubicación
    if (isLocation) {
      const url = isEncrypted ? decryptedMessages[message] : message;
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <FaMapMarkerAlt className="text-red-500" />
          Ver ubicación
        </a>
      );
    }

    // Mensaje normal
    return message;
  };

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {/* ... resto del renderizado ... */}
      <div className={cn(
        'max-w-xs p-3 rounded-lg',
        {
          'bg-blue-500 text-white': isCurrentUser && !isEncrypted,
          'bg-gray-200': !isCurrentUser && !isEncrypted,
          'bg-blue-100 border border-blue-300': isEncrypted && isCurrentUser,
          'bg-gray-100 border border-gray-400': isEncrypted && !isCurrentUser
        }
      )}>
        {!isCurrentUser && senderName && (
          <p className="font-semibold text-sm mb-1">{senderName}</p>
        )}
        
        <div className={cn({
          'text-gray-800': !isCurrentUser,
          'text-blue-100': isCurrentUser && !isLocation
        })}>
          {renderContent()}
        </div>
        
        <p className={cn('text-xs mt-1', {
          'text-blue-100': isCurrentUser,
          'text-gray-500': !isCurrentUser
        })}>
          {time}
        </p>
        
        {(isEncrypted || isLocation) && (
          <p className="text-xs mt-1 text-right">
            {isLocation ? '📍 Ubicación' : '🔒 Encriptado'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;