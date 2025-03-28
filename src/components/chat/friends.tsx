import {useEffect, useState} from "react";
import FriendSearch from "./friend-search";
import FriendsItem from "./friends-item"
import { useAuth, useFirestore } from "reactfire";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { UserDB, UserRoom } from "@/schemas/firestore-schema";

interface Friend {
  uid: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomid: string;
}
const Friends = () => {

  const [friends, setFriends] = useState<Friend[]>([]);
  
  const db = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    const getFriends = async () => {
      const res = await fetch("https://randomuser.me/api/?results=15&nat=mx");
      const { results } = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = results.map((user: any) => ({
        uID: user.login.uuid,
        displayName: user.name.first,
        photoURL: user.picture.large,
        lastMessage: "Hi, i am " + user.name.first,
      }));

      setFriends(data);
    };

    getFriends();
  }, []);

  useEffect(() => {
    const userRef = doc(db, "users", auth.currentUser!.uid) 
    const unsuscribe = onSnapshot(userRef, (document) => {
      //console.log("Current data: ", doc.data()?.rooms);
      const friendPromises = document.data()?.rooms.map(async (room: UserRoom) => {
        const friendRef = doc(db, "users", room.friendId);
        console.log(room)
        return getDoc(friendRef);
      });

      Promise.all(friendPromises).then((friends) => {
        const data = friends.map((friend) => {
          const room: UserRoom = document
            .data()
            ?.rooms.find((room: UserRoom) => room.friendId === friend.id);

          // console.log({ room });
          const data = friend.data();

          console.log({
            uid: data.uid,
            displayName: data.displayName,
            photoURL: data.photoURL,
            roomid: room?.roomid,
            lastMessage: room?.lastMessage,
          });

          return {
            uid: data.uid,
            displayName: data.displayName,
            photoURL: data.photoURL,
            roomid: room?.roomid,
            lastMessage: room?.lastMessage,
          };
        });

        setFriends(data);
      });
    });

    return unsuscribe;
  }, [])

  return (
    <div className='grid grid-rows-[auto_1fr] h-screen border-r'>
      <section className='border-b p-4'>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Chats</h2>
         <FriendSearch />
       </section>
      <section className="custom-scrollbar">

        {friends.map((friend) => (
          <FriendsItem key={friend.uid}
          {...friend}/>
        ))}
        
      </section>
    </div>
  );
};

export default Friends