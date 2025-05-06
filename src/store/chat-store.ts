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

interface ChatStore {
  friend: Friend | null;
  setFriend: (friend: Friend) => void; // Add setFriend to the interface
  resetFriend: () => void; // Add resetFriend to the interface
}

interface GroupChatStore {
  groupChat: Group | null;
  setGroup: (groupChat: Group) => void;
  resetGroup: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  friend: null,
  setFriend: (friend: Friend) => set({ friend }),
  resetFriend: () => set({ friend: null }), // Implement resetFriend
}));

export const useGroupChatStore = create<GroupChatStore>((set) => ({
  groupChat: null,
  setGroup: (groupChat: Group) => set({ groupChat }),
  resetGroup: () => set({ groupChat: null }),
}));