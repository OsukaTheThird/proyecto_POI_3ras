import { useEffect, useState } from "react";
import FriendSearch from "./friend-search";
import FriendsItem from "./friends-item";
import { useUser, useFirestore } from "reactfire";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { UserRoom } from "@/schemas/firestore-schema";

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
  const { data: user, status } = useUser(); // Usa useUser() en lugar de useAuth()

  useEffect(() => {
    if (status === "loading" || !user) return; // Esperar a que el usuario esté disponible

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, async (document) => {
      if (!document.exists()) return;

      const friendPromises = document.data()?.rooms?.map(async (room: UserRoom) => {
        const friendRef = doc(db, "users", room.friendId);
        return getDoc(friendRef);
      }) || [];

      Promise.all(friendPromises).then((friends) => {
        const data = friends.map((friendDoc) => {
          if (!friendDoc.exists()) return null;
          
          const friendData = friendDoc.data();
          const room: UserRoom | undefined = document.data()?.rooms.find(
            (room: UserRoom) => room.friendId === friendDoc.id
          );

          return {
            uid: friendData.uid,
            displayName: friendData.displayName,
            photoURL: friendData.photoURL,
            roomid: room?.roomid || "",
            lastMessage: room?.lastMessage || "",
          };
        }).filter(Boolean); // Filtra posibles `null`

        setFriends(data as Friend[]);
      });
    });

    return () => unsubscribe();
  }, [user, status, db]); // Dependencias actualizadas

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen border-r">
      <section className="border-b p-4">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Chats</h2>
        <FriendSearch />
      </section>
      <section className="custom-scrollbar">
        {friends.map((friend) => (
          <FriendsItem key={friend.uid} {...friend} />
        ))}
      </section>
    </div>
  );
};

export default Friends;
