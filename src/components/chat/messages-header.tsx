import React from 'react';
import { Button } from '@/components/ui/button';
import { BsBoxArrowLeft, BsTelephone, BsPeopleFill } from "react-icons/bs";
import { Group, useChatStore } from '@/store/chat-store';
import { Friend } from '@/store/chat-store';
import { Link } from 'react-router-dom';

interface MessagesHeaderProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}


const MessagesHeader: React.FC<MessagesHeaderProps> = ({ }) => {
  const { resetChat, getChatData, isGroupChat, onlineStatus, typingStatus } = useChatStore();
  const chatData = getChatData();

  if (!chatData) return null;

  // Obtener estado del chat
  const getStatusForChat = () => {
    if (isGroupChat()) {
      const groupData = chatData as Group;
      const onlineCount = groupData.uid.filter(uid => onlineStatus[uid]).length;
      return `${onlineCount}/${groupData.uid.length} en línea`;
    } else {
      const friendData = chatData as Friend;
      if (typingStatus[friendData.uid]) return 'Escribiendo...';
      return onlineStatus[friendData.uid] ? 'En línea' : 'Desconectado';
    }
  };

  return (
    <header className='p-4 border-b flex items-center'>
      <div className="relative">
        <img
          src={chatData.photoURL || (isGroupChat() ? '/default-group-avatar.png' : '/default-user.png')}
          alt={chatData.displayName}
          className='rounded-md size-16'
        />
        {/* Indicador de estado (solo para chats individuales) */}
        {!isGroupChat() && (
          <span className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white 
            ${onlineStatus[(chatData as Friend).uid] ? 'bg-green-500' : 'bg-gray-400'} 
            w-3 h-3
          `} />
        )}
      </div>

      <div className='flex-1 p-2'>
        <p className='text-lg font-semibold text-gray-700'>{chatData.displayName}</p>
        <p className={`text-xs flex items-center gap-1 ${!isGroupChat() && typingStatus[(chatData as Friend).uid] ? 'text-blue-500' :
          !isGroupChat() && onlineStatus[(chatData as Friend).uid] ? 'text-green-500' : 'text-gray-500'
          }`}>
          {getStatusForChat()}
          {isGroupChat() && <BsPeopleFill className="text-gray-400" />}
        </p>
      </div>
      <div className='p-4'>

        <Link to="/call">
          <Button id='callButton'>
            <BsTelephone />
          </Button>
        </Link>

      </div>

      <div>
        <Button
          onClick={resetChat}
          type="submit"
          className='w-full'
        >
          <BsBoxArrowLeft />
        </Button>
      </div>
    </header>
  );
};

export default MessagesHeader;