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

interface UserStatus {
  userId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen?: string;
}

type ChatType = 'friend' | 'group';

interface ChatStore {
  currentChat: {
    type: ChatType;
    data: Friend | Group;
  } | null;
  userStatuses: UserStatus[];
  setFriend: (friend: Friend) => void;
  setGroup: (group: Group) => void;
  resetChat: () => void;
  // Helpers para acceder fácilmente a los datos
  isGroupChat: () => boolean;
  getChatData: () => Friend | Group | null;
  getRoomId: () => string | null;
  setUserStatus: (status: UserStatus) => void;
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
    userStatuses: [],

  setUserStatus: (status) => set((state) => ({
    userStatuses: [
      ...state.userStatuses.filter(s => s.userId !== status.userId),
      status
    ]
  })),
  
  setTypingStatus: (userId, isTyping) => set((state) => ({
    userStatuses: state.userStatuses.map(s => 
      s.userId === userId ? {...s, isTyping} : s
    )
  })),
}));


