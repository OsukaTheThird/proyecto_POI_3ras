import { useFriendPresence } from '@/hooks/useFriendPresence';
import { cn } from '@/lib/utils';
import { Friend, useChatStore } from '@/store/chat-store';
interface MessageProps {
  message: string;
  time: string;
  photoURL: string;
  isCurrentUser: boolean;
      senderName?: string; // Add senderName as an optional property

}
const Message = ({ message, time, photoURL, isCurrentUser }: MessageProps) => {
    const { currentChat, getChatData } = useChatStore();
  const chatData = getChatData();

  // Escuchar presencia del amigo (solo para chats individuales)
  useFriendPresence(currentChat?.type === 'friend' ? (chatData as Friend)?.uid : undefined);

  return (
    <article className={cn('flex gap-x-2', { "flex-row-reverse": isCurrentUser, "flex-row": !isCurrentUser })}>
      <img src={photoURL} alt="" className='rounded-full size-10' />
      <div className={cn('bg-green-400 p-2 rounded-md max-w-[70%]', { "bg-white": isCurrentUser })}>
        <p>{message}</p>
        <p className='text-xs text-gray-500 text-right'> {time}</p>

      </div>
    </article>

  )
}

export default Message;