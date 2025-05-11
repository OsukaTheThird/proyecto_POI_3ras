import { Timestamp } from "firebase/firestore";

export interface UserRoom{
    roomid: string;
    lastMessage: string;
    timestamp: string;
    friendId: string;
}

//coleccion de usuarios
export interface UserDB {
    displayName: string;
    email: string;
    password: string;
    photoURL: string;
    decorationId: string;
    uid: string;
    friends: string[];
    rooms: UserRoom[];
    status?: {
    state: 'online' | 'offline';
    isTyping: boolean;
    lastSeen: Timestamp;
    lastUpdated: Timestamp;
  };
}

export interface Message{
    message: string;
    timestamp: string;
    uid: string;
}

//coleccion de grupos(rooms)
export interface RoomDB {
    groupName: string;
    messages: Message[];
    lastMessage?: string;
    timestamp?: string;
    groupPhoto?: string;
    users: string[]; //UserDB(?)
    
}

//simulacion de la base de datos
export const users: Record<string, UserDB> = {
    user1: {
      displayName: "user1",
      email: "user1@domain.com",
      password: "123456",
      photoURL: "https://...",
      decorationId: "1",
      uid: "user1",
      friends: ["user2"],
      rooms: [
        {
          roomid: "room1",
          lastMessage: "Hola",
          timestamp: "2021-07-10T15:00:00",
          friendId: "user2",
        },
      ],
    },
    user2: {
      displayName: "user2",
      email: "user2@domain.com",
      password: "123456",
      photoURL: "https://...",
      decorationId: "1",
      uid: "user2",
      friends: ["user1"],
      rooms: [
        {
          roomid: "room1",
          lastMessage: "Hola",
          timestamp: "2021-07-10T15:00:00",
          friendId: "user1",
        },
      ],
    },
  };
  
  export const rooms: Record<string, RoomDB> = {
    room1: {
      groupName:"Grupo amigos",
      messages: [
        {
          message: "Hola",
          timestamp: "2021-07-10T15:00:00",
          uid: "user1",
        },
        {
          message: "Hola",
          timestamp: "2021-07-10T15:00:00",
          uid: "user2",
        },
      ],
      users: ["user1", "user2"],
    },
  };