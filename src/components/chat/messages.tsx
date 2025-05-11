import MessagesHeader from './messages-header';
import MessagesFooter from './messages-footer';
import MessagesChat from './messages-chat';
import { useChatStore } from '@/store/chat-store';
import { FaMapMarkerAlt } from 'react-icons/fa';
  
// Define the MessageProps type
type MessageProps = {
  message: string;
  time: string;
  photoURL: string;
  isCurrentUser: boolean;
  isLocation: boolean;
};

const Messages = ({ message, time, photoURL, isCurrentUser, isLocation }: MessageProps) => {
  if (isLocation) {
    // Extraer la URL de Google Maps del mensaje
    const mapsUrl = message.replace('Mi ubicación: ', '');
    
    return (
      <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && (
          <img 
            src={photoURL} 
            alt="Sender" 
            className="w-8 h-8 rounded-full mt-1" 
          />
        )}
        <div className={`max-w-xs p-3 rounded-lg ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`underline ${isCurrentUser ? 'text-blue-100' : 'text-blue-600'}`}
            >
              Ver ubicación en mapa
            </a>
          </div>
          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {time}
          </p>
        </div>
      </div>
    );
  }
  const { currentChat, isGroupChat, getChatData } = useChatStore();
  const chatData = getChatData();
  
  if(!currentChat) return (
    <div className='grid h-screen place-items-center'>
      <div className='flex items-center justify-center'>
        <p className='text-lg text-gray-500'>Selecciona un chat para comenzar</p>
      </div>
    </div>
  );
  
  return (
    <article className='grid grid-rows-[auto_1fr_auto] h-screen border-r'>
      <MessagesHeader chat={chatData} isGroup={isGroupChat()} />
      <MessagesChat chat={chatData} isGroup={isGroupChat()} />
      <MessagesFooter chat={chatData} isGroup={isGroupChat()} />
    </article>
  );
}

export default Messages;