// hooks/useConnectionTracker.ts
import { useEffect } from 'react';
import { useAuth } from 'reactfire';
import { useChatStore } from '@/store/chat-store';

export const useConnectionTracker = () => {
  const { currentUser } = useAuth();
  const { setOnlineStatus } = useChatStore();

  useEffect(() => {
    if (!currentUser) return;

    // Simulamos estado online cuando el componente se monta
    setOnlineStatus(currentUser.uid, true);

    // Podrías agregar lógica para detectar desconexión
    const handleBeforeUnload = () => {
      setOnlineStatus(currentUser.uid, false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setOnlineStatus(currentUser.uid, false);
    };
  }, [currentUser, setOnlineStatus]);
};