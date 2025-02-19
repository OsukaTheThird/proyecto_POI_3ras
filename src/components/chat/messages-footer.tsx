import React from 'react'
import { Button } from '../ui/button';
import { useState } from 'react';
import {Input} from '../ui/input';
import { BsFillSendFill } from "react-icons/bs";


const MessagesFooter = () => {
   const [message, setMessage] = useState("");

   const handleSendMessage = async() => {
    console.log(message);
   };
  return (

    <footer className='p-4 border-t flex gap-x-2'>
    
      <Input type="text" placeholder="Escribe un mensaje" className='w-full p-2 border rounded-lg '
      value={message}
      onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={handleSendMessage}><BsFillSendFill /></Button>
  </footer>  );
};
export default MessagesFooter;