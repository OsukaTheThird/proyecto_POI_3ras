import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat-store';
import { FaMapMarkerAlt } from 'react-icons/fa';

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
  photoURL, 
  isCurrentUser, 
  isEncrypted,
  isLocation,
  senderName 
}: MessageProps) => {
  const { decryptMessage, isEncrypted: isChatEncrypted } = useChatStore();

  const renderContent = () => {
    if (isLocation) {
      const url = isEncrypted ? decryptMessage(message) : message;
      return <a href={url}>📍 Ver ubicación</a>;
    }

    if (isEncrypted) {
      try {
        // Solo desencriptar si el mensaje parece encriptado
        if (!message.match(/^[A-Za-z0-9+/=]+$/)) {
          return "🔒 [Formato inválido]";
        }
        const decrypted = decryptMessage(message);
        return decrypted.startsWith("🔒") ? decrypted : `🔒 ${decrypted}`;
      } catch {
        return "🔒 [Error de desencriptación]";
      }
    }
    return message;
  };
  

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <img 
          src={photoURL} 
          alt={senderName || 'Usuario'} 
          className="w-8 h-8 rounded-full mt-1" 
        />
      )}
      
      <div className={cn(
        'max-w-xs p-3 rounded-lg',
        {
          'bg-blue-500 text-white': isCurrentUser && !isLocation,
          'bg-gray-200': !isCurrentUser && !isLocation,
          'bg-blue-100': isLocation && !isCurrentUser,
          'bg-blue-300': isLocation && isCurrentUser,
          'border border-gray-400': isEncrypted
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