import { create } from 'zustand';
import CryptoJS from 'crypto-js'; // Necesitarás instalar esta dependencia

export interface Friend {
  uid: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomid: string;
}

export interface Group {
  uid: string[];
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomid: string;
}

type ChatType = 'friend' | 'group';

interface ChatStore {
  currentChat: {
    type: ChatType;
    data: Friend | Group;
  } | null;
  isEncrypted: boolean;
  encryptionKey: string | null;
  setFriend: (friend: Friend) => void;
  setGroup: (group: Group) => void;
  resetChat: () => void;
  isGroupChat: () => boolean;
  getChatData: () => Friend | Group | null;
  getRoomId: () => string | null;
  onlineStatus: Record<string, boolean>;
  typingStatus: Record<string, boolean>;
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
  setTypingStatus: (userId: string, isTyping: boolean) => void;
  // Nuevas funciones para encriptación
  toggleEncryption: (password?: string) => Promise<void>;
  encryptMessage: (message: string) => string;
  decryptMessage: (encryptedMessage: string) => string;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentChat: null,
  isEncrypted: false,
  encryptionKey: null,
  
  setFriend: (friend: Friend) => set({ 
    currentChat: { 
      type: 'friend', 
      data: friend 
    } 
  }),
  
  setGroup: (group: Group) => set({ 
    currentChat: { 
      type: 'group', 
      data: group 
    } 
  }),
  
  resetChat: () => set({ 
    currentChat: null,
    isEncrypted: false,
    encryptionKey: null 
  }),
  
  isGroupChat: () => {
    const { currentChat } = get();
    return currentChat?.type === 'group';
  },
  
  getChatData: () => {
    const { currentChat } = get();
    return currentChat?.data || null;
  },
  
  getRoomId: () => {
    const { currentChat } = get();
    return currentChat?.data.roomid || null;
  },
  
  onlineStatus: {},
  typingStatus: {},
  
  setOnlineStatus: (userId, isOnline) => set((state) => ({
    onlineStatus: { ...state.onlineStatus, [userId]: isOnline }
  })),
  
  setTypingStatus: (userId, isTyping) => set((state) => ({
    typingStatus: { ...state.typingStatus, [userId]: isTyping }
  })),
  
  // Funciones de encriptación
  toggleEncryption: async (password) => {
    const { isEncrypted, encryptionKey } = get();
    
    if (isEncrypted) {
      // Desactivar encriptación
      set({ isEncrypted: false, encryptionKey: null });
    } else {
      if (!password) return;
      // Activar encriptación con nueva clave
      const derivedKey = CryptoJS.SHA256(password).toString();
      set({ isEncrypted: true, encryptionKey: derivedKey });
    }
  },
  
  encryptMessage: (message) => {
    const { encryptionKey } = get();
    if (!encryptionKey) return message;
    return CryptoJS.AES.encrypt(message, encryptionKey).toString();
  },
  
  decryptMessage: (encryptedMessage) => {
    const { encryptionKey } = get();
    if (!encryptionKey) return encryptedMessage;
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedMessage; // Si falla, devuelve el original
    } catch {
      return encryptedMessage;
    }
  },
}));