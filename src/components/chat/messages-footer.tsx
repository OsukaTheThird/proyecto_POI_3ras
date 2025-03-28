import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BsFillSendFill } from "react-icons/bs";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUser, useFirestore } from 'reactfire'
interface MessagesFooterProps {
  friend: {
    displayName: string;
    photoURL: string;
    lastMessage: string;
    roomid: string;
  };
}

const MessagesFooter = ({ friend }: MessagesFooterProps) => {
  const [message, setMessage] = useState("");
  const { data: user } = useUser();
    const db = useFirestore();

  const handleSendMessage = async () => {
    if (!message || !user) return;

    try {
      const roomRef = doc(db, "rooms", friend.roomid);
      await updateDoc(roomRef, {
        messages: arrayUnion({
          message,
          timestamp: new Date().toISOString(),
          uid: user.uid
        })
      });
      console.log("Mensaje enviado");
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <footer className="p-4 border-t flex gap-x-2">
      <Input
        type="text"
        placeholder="Escribe un mensaje"
        className="w-full p-2 border rounded-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSendMessage}><BsFillSendFill /></Button>
    </footer>
  );
};

export default MessagesFooter;
