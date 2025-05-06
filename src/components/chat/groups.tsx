import { useEffect, useState } from "react";
import GroupCreation from "./group-creation";
import GroupItem from "./group-item";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { UserRoom } from "@/schemas/firestore-schema";
import { useFirestore, useUser } from "reactfire";

interface Group {
    uid: string[];
    displayName: string;
    photoURL: string;
    lastMessage: string;
    roomid: string;
}

const Groups = () => {
    const [group, setGroups] = useState<Group[]>([]);
    const db = useFirestore
    const {data: user, status} = useUser();
    //const { data: user, status } = useUser(); // Usa useUser() en lugar de useAuth()

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
    
            setGroups(data as Group[]);
          });
        });
    
        return () => unsubscribe();
      }, [user, status, db]); // Dependencias actualizadas
    
      return (
        <div className="grid grid-rows-[auto_1fr] h-screen border-r">
          <section className="border-b p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-3">Chats</h2>
            <GroupCreation />
          </section>
          <section className="custom-scrollbar">
            {group.map((friend) => (
              <GroupCreation key={friend.uid} {...friend} />
            ))}
          </section>
        </div>
      );
};

export default Groups;

//Aqui se mostraran el listado de grupos
