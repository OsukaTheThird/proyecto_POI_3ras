import { useEffect, useRef, useState } from 'react';
import Message from './message';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from 'reactfire';
import { format } from 'timeago.js';
import { useChatStore } from '@/store/chat-store';
import { Friend, Group } from '@/store/chat-store';

interface MessagesChatProps {
  chat: Friend | Group | null;
  isGroup: boolean;
}


const MessagesChat: React.FC<MessagesChatProps> = ({  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const db = useFirestore();
    const { currentUser } = useAuth();
    const { getChatData, getRoomId, isGroupChat } = useChatStore();
    
    interface MessageInterface {
        uid: string;
        message: string;
        timestamp: number;
    }
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [membersData, setMembersData] = useState<Record<string, {photoURL: string, displayName: string}>>({});
    const roomId = getRoomId();

    // Cargar mensajes
    useEffect(() => {
        if (!roomId) return;

        const roomRef = doc(db, 'rooms', roomId);
        const unSubscribe = onSnapshot(roomRef, (document) => {
            setMessages(document.data()?.messages ?? []);
        });
        return () => unSubscribe();
    }, [roomId, db]);

    // Cargar datos de miembros (para grupos)
    useEffect(() => {
        if (!isGroupChat() || !roomId) return;

        const fetchMembersData = async () => {
            const roomDoc = await getDoc(doc(db, 'rooms', roomId));
            if (!roomDoc.exists()) return;

            const members = roomDoc.data().users || [];
            const membersSnapshot = await Promise.all(
                members.map((memberId: string) => getDoc(doc(db, 'users', memberId)))
            );
            
            const data: Record<string, {photoURL: string, displayName: string}> = {};
            membersSnapshot.forEach((doc) => {
                if (doc.exists()) {
                    data[doc.id] = {
                        photoURL: doc.data().photoURL || '',
                        displayName: doc.data().displayName || 'Usuario'
                    };
                }
            });
            setMembersData(data);
        };

        fetchMembersData();
    }, [roomId, isGroupChat, db]);

    // Auto-scroll al recibir nuevos mensajes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!roomId) return null;

    return (
        <main ref={containerRef} className='p-4 flex-1 bg-green-200 space-y-2 cursor-pointer custom-scrollbar'>
            {messages.map((message, index) => {
                const isCurrentUser = message.uid === currentUser?.uid;
                let photoURL = '';
                let senderName = '';

                if (isCurrentUser) {
                    photoURL = currentUser?.photoURL || '';
                } else if (isGroupChat()) {
                    photoURL = membersData[message.uid]?.photoURL || '/default-user.png';
                    senderName = membersData[message.uid]?.displayName || 'Usuario';
                } else {
                    const chatData = getChatData();
                    photoURL = chatData?.photoURL || '/default-user.png';
                }

                return (
                    <Message 
                        key={index}
                        message={message.message}
                        time={format(message.timestamp)}
                        photoURL={photoURL}
                        isCurrentUser={isCurrentUser}
                        senderName={!isCurrentUser && isGroupChat() ? senderName : undefined}
                    />
                );
            })}
        </main>
    );
};

export default MessagesChat;