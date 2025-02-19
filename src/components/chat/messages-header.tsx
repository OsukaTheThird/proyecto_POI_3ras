import React from 'react'
import { Button } from '@/components/ui/button';
import { BsBoxArrowLeft } from "react-icons/bs";


const MessagesHeader = () => {
  return (
    <header className=' p-4 border-b flex items-center '>
    <img src="https://randomuser.me/api/portraits/men/40.jpg" alt="" className='rounded-md size-16'/>
     <div className=' flex-1 p-2'>
      <p className='text-lg font-semibold text-gray-700'> Daniel</p>
      <p className='text-xs text-gray-500'> Activo</p>
     </div>
     <div className=''><Button
            type="submit"
            className='w-full'
            >
<BsBoxArrowLeft />
</Button>
        
     </div>
    </header>
 
  )
}

export default MessagesHeader;