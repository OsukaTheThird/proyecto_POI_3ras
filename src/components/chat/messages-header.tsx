import React from 'react';
import { Button } from '@/components/ui/button';
import { BsBoxArrowLeft, BsTelephone, BsPeopleFill } from "react-icons/bs";
import { Group, useChatStore } from '@/store/chat-store';
import { Friend } from '@/store/chat-store';

interface MessagesHeaderProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}
const MessagesHeader: React.FC<MessagesHeaderProps> = ({  }) => {
  const { resetChat, getChatData, isGroupChat, userStatuses } = useChatStore();
  const chatData = getChatData();
 if (!chatData) return null;

  // Obtener estados relevantes
  const getStatusForChat = () => {
    if (!chatData) return null;
    
    if (isGroupChat()) {
      const groupData = chatData as Group;
      const onlineCount = groupData.uid
        .filter(uid => userStatuses.some(s => s.userId === uid && s.isOnline))
        .length;
      
      return `${onlineCount}/${groupData.uid.length} en línea`;
    } else {
      const friendData = chatData as Friend;
      const friendStatus = userStatuses.find(s => s.userId === friendData.uid);
      
      if (friendStatus?.isTyping) return 'Escribiendo...';
      return friendStatus?.isOnline ? 'En línea' : 'Desconectado';
    }
  };

  return (
    <header className='p-4 border-b flex items-center'>
      
      <img 
        src={chatData.photoURL || (isGroupChat() ? '/default-group-avatar.png' : '/default-user.png')} 
        alt={chatData.displayName} 
        className='rounded-md size-16'
        onError={(e) => {
          (e.target as HTMLImageElement).src = isGroupChat() 
            ? '/default-group-avatar.png' 
            : '/default-user.png';
        }}
      />
            <div className='flex-1 p-2'>
        <p className='text-lg font-semibold text-gray-700'>{chatData.displayName}</p>
        <p className='text-xs text-gray-500 flex items-center gap-1'>
          {getStatusForChat()}
          {isGroupChat() && <BsPeopleFill className="text-gray-400" />}
        </p>
      </div>
      
      
      <div className='p-4'>
        <Button>
          <BsTelephone />
        </Button>
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