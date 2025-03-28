
import MessagesHeader from './messages-header';
import MessagesFooter from './messages-footer';
import MessagesChat from './messages-chat';
import { useChatStore } from '@/store/chat-store';
const Messages = () => {
  const {friend} = useChatStore();
  if(!friend) return (
    <div className='grid h-screen place-items-center'>
      <div className='flex items-center justify-center'>
        <p className='text-lg text-gray-500'>Selecciona un amigo para chatear</p>
      </div>
    </div>);
  return (
    <article className='grid grid-rows-[auto_1fr_auto] h-screen border-r'>
      <MessagesHeader />
      <MessagesChat  friend={friend}/>
      <MessagesFooter friend={friend}/>
      </article>
  )
}

export default Messages;