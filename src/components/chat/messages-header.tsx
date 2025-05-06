import React from 'react'
import { Button } from '@/components/ui/button';
import { BsBoxArrowLeft, BsTelephone } from "react-icons/bs";
import { useChatStore } from '@/store/chat-store';


const MessagesHeader = () => {

  const { resetFriend, friend } = useChatStore();
  return (
    <header className=' p-4 border-b flex items-center '>
      <img src={friend?.photoURL} alt="" className='rounded-md size-16' />
      <div className=' flex-1 p-2'>
        <p className='text-lg font-semibold text-gray-700'> {friend?.displayName}</p>
        <p className='text-xs text-gray-500'> Activo</p>
      </div>
      {/* 
       */}

      <div className='p-4'>
        <Button>
          <BsTelephone />
        </Button>
      </div>

      <div className=''>
        <Button
          onClick={resetFriend}
          type="submit"
          className='w-full'>
          <BsBoxArrowLeft />
        </Button>

      </div>
    </header>

  )
}

export default MessagesHeader;