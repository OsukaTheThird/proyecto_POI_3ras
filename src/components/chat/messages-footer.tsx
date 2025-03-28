import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BsFillSendFill } from "react-icons/bs";
import { arrayUnion, doc, updateDoc, getDoc, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useUser, useFirestore } from 'reactfire'
//import { get } from 'http';
import { UserDB } from '@/schemas/firestore-schema';
import { Friend } from '@/store/chat-store';

const updateLastMessage = async (db : Firestore, uid : string ,roomid : string ,message : string) => {
  const userRef = doc(db, "users", uid);
  const { rooms } = (await getDoc(userRef)).data() as UserDB;


const roomUpdateLastMessage = rooms.map((room) => {
if (room.roomid === roomid) {
return {
  ...room,
  lastMessage: message,
  timestamp: new Date().toISOString(),
};
}
return room;
});
await updateDoc(userRef, {
rooms: roomUpdateLastMessage,
});
}

interface MessagesFooterProps {
  friend: Friend;
}

const MessagesFooter = ({ friend }: MessagesFooterProps) => {
  const [message, setMessage] = useState("");
  const { data: user } = useUser();
    const db = useFirestore();
    const auth = getAuth();

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

      const currentRoomId=friend.roomid;
      //actualizar el lastMessage
    await updateLastMessage(db, auth.currentUser!.uid, friend.roomid, message);
    await updateLastMessage(db, friend.uid, currentRoomId, message);
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
