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
  setEncryptionKey: (password: string) => void;
  encryptMessage: (message: string) => { encrypted: string; original: string };
  decryptMessage: (encrypted: string) => string;
  toggleEncryption: () => void;
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
  
  setEncryptionKey: (password: string) => {
    // Usamos PBKDF2 para derivación de clave más segura
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 1000
    }).toString();
    set({ encryptionKey: key });
  },

  encryptMessage: (message) => {
    const { isEncrypted } = get();
    
    if (!isEncrypted) {
      return { encrypted: message, original: message };
    }
    
    // Encriptación real solo para consola/datos
    const encrypted = `ENC:${CryptoJS.AES.encrypt(message, 'clave-secreta').toString()}`;
    console.log('Mensaje encriptado:', encrypted); // Log en consola
    
    return { encrypted, original: message }; // Devuelve original para UI
  },
decryptMessage: (encrypted) => {
    if (!encrypted.startsWith('ENC:')) return encrypted;
    
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encrypted.slice(4), 
        'clave-secreta'
      ).toString(CryptoJS.enc.Utf8);
      
      console.log('Mensaje desencriptado:', decrypted); // Log en consola
      return decrypted || encrypted;
    } catch {
      return encrypted;
    }
  },
  toggleEncryption: async () => {
  const { isEncrypted } = get();
  
  if (isEncrypted) {
    // Desactivar encriptación
    set({ isEncrypted: false, encryptionKey: null });
  } else {
    // Activar encriptación con clave fija (o sin clave)
    const fixedKey = "clave-secreta"; // O genera una clave aleatoria
    set({ isEncrypted: true, encryptionKey: fixedKey });
  }
},
}));