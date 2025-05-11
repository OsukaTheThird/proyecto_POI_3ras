import { useEffect } from 'react';
import { useAuth } from 'reactfire';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useChatStore } from '@/store/chat-store';

export const usePresence = () => {
  const db = useFirestore();
  const { currentUser } = useAuth();
  const { setUserStatus } = useChatStore();

  // Monitorear estado de los usuarios
  useEffect(() => {
    if (!currentUser) return;

    // Actualizar mi propio estado como "en línea"
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserStatus({
          userId: currentUser.uid,
          isOnline: data?.status?.state === 'online',
          isTyping: data?.status?.isTyping || false,
          lastSeen: data?.status?.lastSeen
        });
      }
    });

    // Configurar estado inicial
    updateDoc(userRef, {
      'status.state': 'online',
      'status.lastSeen': serverTimestamp()
    });

    // Manejar desconexión
    const handleBeforeUnload = () => {
      updateDoc(userRef, {
        'status.state': 'offline',
        'status.lastSeen': serverTimestamp()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateDoc(userRef, {
        'status.state': 'offline',
        'status.lastSeen': serverTimestamp()
      });
    };
  }, [currentUser, db, setUserStatus]);
};