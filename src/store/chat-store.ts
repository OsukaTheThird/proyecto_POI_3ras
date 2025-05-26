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

interface Message {
  isEncrypted: boolean;
  message: string | { encrypted: string };
  // Puedes agregar más campos según tu modelo real
}

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
  decryptedMessages: Record<string, string>;
  toggleEncryption: () => Promise<void>;
  decryptAllMessages: () => Promise<void>;
  messages: Message[]; // <-- Add this line
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentChat: null,
  isEncrypted: false,
  encryptionKey: null,
  decryptedMessages: {},
  messages: [], // <-- Initialize messages as an empty array

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
  },  toggleEncryption: async () => {
    const { isEncrypted, decryptAllMessages } = get();
    if (isEncrypted) {
      await decryptAllMessages();
    }
    set({ isEncrypted: !isEncrypted });
  },

  decryptAllMessages: async () => {
    const { messages, decryptMessage } = get();
    const decrypted: Record<string, string> = {};
    
    for (const msg of messages) {
      if (msg.isEncrypted && typeof msg.message === 'object' && 'encrypted' in msg.message) {
        try {
          decrypted[msg.message.encrypted] = await decryptMessage(msg.message.encrypted);
        } catch (error) {
          console.error("Error decrypting message:", error);
          decrypted[msg.message.encrypted] = "🔒 Error al desencriptar";
        }
      }
    }
    
    set({ decryptedMessages: decrypted });
  },
}));