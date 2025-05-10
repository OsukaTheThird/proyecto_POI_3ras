import MessagesHeader from './messages-header';
import MessagesFooter from './messages-footer';
import MessagesChat from './messages-chat';
import { useChatStore } from '@/store/chat-store';

const Messages = () => {
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