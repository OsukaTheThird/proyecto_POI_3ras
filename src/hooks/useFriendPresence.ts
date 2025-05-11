// hooks/useFriendPresence.ts
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useChatStore } from '@/store/chat-store';

export const useFriendPresence = (friendId?: string) => {
  const db = useFirestore();
  const { setOnlineStatus } = useChatStore();

  useEffect(() => {
    if (!friendId) return;

    const friendPresenceRef = doc(db, 'presence', friendId);
    const unsubscribe = onSnapshot(friendPresenceRef, (doc) => {
      if (doc.exists()) {
        setOnlineStatus(friendId, doc.data().status === 'online');
      }
    });

    return () => unsubscribe();
  }, [friendId, db, setOnlineStatus]);
};