import { create } from 'zustand';

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
  setFriend: (friend: Friend) => void;
  setGroup: (group: Group) => void;
  resetChat: () => void;
  // Helpers para acceder fácilmente a los datos
  isGroupChat: () => boolean;
  getChatData: () => Friend | Group | null;
  getRoomId: () => string | null;
  onlineStatus: Record<string, boolean>; // userId -> online
  typingStatus: Record<string, boolean>; // userId -> typing
  setOnlineStatus: (userId: string, isOnline: boolean) => void;
  setTypingStatus: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentChat: null,
  
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
  
  resetChat: () => set({ currentChat: null }),
  
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
  }))
}));

// Elimina useGroupChatStore ya que ahora está unificado