// services/presence.ts
import { useEffect } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDatabase, onDisconnect, ref } from 'firebase/database';
import { useAuth, useFirestore } from 'reactfire';
import { useChatStore } from '@/store/chat-store';

export const usePresenceSystem = () => {
  const db = useFirestore();
  const { currentUser } = useAuth();
  const { setOnlineStatus } = useChatStore();

  useEffect(() => {
    if (!currentUser) return;

    // 1. Crear referencia al documento de presencia
    const userPresenceRef = doc(db, 'presence', currentUser.uid);

    // 2. Configurar el estado como "online"
    const setOnline = async () => {
      await setDoc(userPresenceRef, {
        status: 'online',
        lastChanged: serverTimestamp(),
        userId: currentUser.uid
      }, { merge: true });

      const dbRealtime = getDatabase();
      const userPresenceRealtimeRef = ref(dbRealtime, `presence/${currentUser.uid}`);
      onDisconnect(userPresenceRealtimeRef).set({
        status: 'offline',
        lastChanged: serverTimestamp()
      });
    };

    // 4. Monitorear cambios en otros usuarios
    const unsubscribe = onSnapshot(doc(db as any, 'presence', currentUser?.uid), (snap) => {
      if (snap.exists()) {
        setOnlineStatus(currentUser.uid, snap.data().status === 'online');
      }
    });

    setOnline();

    return () => {
      unsubscribe();
      // Opcional: puedes marcar como offline al desmontar
      setDoc(userPresenceRef, {
        status: 'offline',
        lastChanged: serverTimestamp()
      }, { merge: true });
    };
  }, [currentUser, db, setOnlineStatus]);
};