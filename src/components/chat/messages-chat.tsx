import { useEffect, useRef,useState } from 'react';
import Message from './message';
import { ref } from 'firebase/storage';
//import { Message } from 'react-hook-form';
import { Message as MessageInterface } from '@/schemas/firestore-schema';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { format } from 'timeago.js';

interface MessagesChatProps {
    friend: {
        displayName: string;
        photoURL: string;
        lastMessage: string;
        roomid: string;
    }
}
const MessagesChat = ({friend}:MessagesChatProps) => {
const containerRef = useRef<HTMLDivElement>(null);
const db = useFirestore();
const {currentUser} = useAuth();

console.log(containerRef);
 const[message, setMessage] = useState<MessageInterface[]>([]);
useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }   
}, [message]);

useEffect(() => {
    const roomRef = doc(db, 'rooms', friend.roomid);
    const unSubscribe = onSnapshot(roomRef, (document) => {
        console.log(document.data());
        setMessage(document.data()?.messages ?? []);
    })
    return () => unSubscribe();
}, []);
//este corchete va hacer pendiente de que algo cambie
  return (
    
<main ref={containerRef} className='p-4 flex-1 bg-green-200 space-y-2 cursor-pointer custom-scrollbar'>
{message.map((message,index) => (
    <Message key={index} 
    message={message.message}
    time={format(message.timestamp)}
    photoURL={message.uid === currentUser?.uid 
        ? currentUser?.photoURL || '' 
        : friend.photoURL}
    isCurrentUser={message.uid === currentUser?.uid}
    />
))}
      </main>  )
}

export default MessagesChat;