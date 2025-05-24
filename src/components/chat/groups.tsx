import { useEffect, useState } from "react";
import GroupCreation from "./group-creation";
import GroupItem from "./group-item";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { UserRoom, RoomDB } from "@/schemas/firestore-schema";
import { useFirestore, useUser } from "reactfire";

interface Group {
    uid: string[];
    displayName: string;
    photoURL: string;
    lastMessage: string;
    roomid: string;
}

const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const db = useFirestore();
    const { data: user, status } = useUser();

    useEffect(() => {
        if (status === "loading" || !user) return;

        const unsubscribe = onSnapshot(
            query(collection(db, "rooms"),
                where("users", "array-contains", user.uid)),
            async (snapshot) => {
                const groupPromises = snapshot.docs.map(async (roomDoc) => {
                    const roomData = roomDoc.data() as RoomDB;

                    // Solo procesar grupos con más de 2 usuarios
                    if (roomData.users.length <= 2) return null;

                    // Obtener información de los miembros del grupo
                    const membersInfo = await Promise.all(
                        roomData.users.map(async (userId) => {
                            const userRef = doc(db, "users", userId);
                            const userDoc = await getDoc(userRef);
                            return userDoc.exists() ? userDoc.data() : null;
                        })
                    ).then(results => results.filter(Boolean));

                    // Crear nombre del grupo con los primeros 3 nombres de usuario
                    const groupName = membersInfo
                        .slice(0, 3)
                        .map(member => member?.displayName?.split(' ')[0])
                        .join(', ') + (membersInfo.length > 3 ? ` +${membersInfo.length - 3}` : '');

                    return {
                        uid: roomData.users,
                        displayName: roomData.groupName || groupName,
                        photoURL: roomData.groupPhoto || "/default-group-avatar.png",
                        lastMessage: roomData.lastMessage || "",
                        roomid: roomDoc.id
                    };
                });

                const groupsData = (await Promise.all(groupPromises)).filter(Boolean);
                setGroups(groupsData as Group[]);
            }
        );

        return () => unsubscribe();
    }, [user, status, db]);

    return (
        <div className="grid grid-rows-[auto_1fr] h-screen border-r">
            <section className="border-b p-4">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Grupos</h2>
                <GroupCreation />
            </section>
            <section className="custom-scrollbar overflow-y-auto">
                {groups.map((group) => (
                    <GroupItem key={group.roomid} {...group} />
                ))}
            </section>
        </div>
    );
};

export default Groups;