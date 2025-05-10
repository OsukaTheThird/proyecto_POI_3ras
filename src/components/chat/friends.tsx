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
  if (status === "loading" || !user) return;

  console.log("Setting up listener for user:", user.uid);
  const userRef = doc(db, "users", user.uid);
  
  const unsubscribe = onSnapshot(userRef, async (document) => {
    if (!document.exists()) {
      console.log("User document does not exist");
      return;
    }

    const userData = document.data();
    console.log("User data:", userData);
    
    const roomsList = userData?.rooms || [];
    console.log("Rooms found:", roomsList.length);

    // Verifica que cada room tenga un friendId válido
    const validRooms = roomsList.filter((room: any) => {
      if (!room.friendId || typeof room.friendId !== 'string') {
        console.warn("Invalid room found - missing friendId:", room);
        return false;
      }
      return true;
    });

    const friendPromises = validRooms.map(async (room: any) => {
      try {
        console.log("Fetching friend with ID:", room.friendId);
        if (!room.friendId) {
          console.error("FriendId is missing in room:", room);
          return null;
        }
        
        const friendRef = doc(db, "users", room.friendId);
        const friendDoc = await getDoc(friendRef);
        
        if (!friendDoc.exists()) {
          console.log("Friend document does not exist for ID:", room.friendId);
          return null;
        }
        
        const friendData = friendDoc.data();
        console.log("Friend data retrieved:", friendData);
        
        return {
          uid: friendData.uid,
          displayName: friendData.displayName || 'Unknown',
          photoURL: friendData.photoURL || '',
          roomid: room.roomid || '',
          lastMessage: room.lastMessage || '',
        };
      } catch (error) {
        console.error("Error fetching friend:", error);
        return null;
      }
    });

    Promise.all(friendPromises)
      .then((friends) => {
        const validFriends = friends.filter(Boolean);
        console.log("Valid friends found:", validFriends.length);
        setFriends(validFriends as Friend[]);
      })
      .catch(error => {
        console.error("Error in Promise.all:", error);
      });
  });

  return () => {
    console.log("Unsubscribing from listener");
    unsubscribe();
  };
}, [user, status, db]);// Dependencias actualizadas

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
