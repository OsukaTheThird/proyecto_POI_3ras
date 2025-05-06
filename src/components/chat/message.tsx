import { cn } from '@/lib/utils';
import React from 'react'
interface MessageProps {
  message: string;
  time: string;
  photoURL: string;
  isCurrentUser: boolean;
}
const Message = ({ message, time, photoURL, isCurrentUser }: MessageProps) => {
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