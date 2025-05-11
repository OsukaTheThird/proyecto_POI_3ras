import Friends from "@/components/chat/friends"
import Messages from "@/components/chat/messages"
import Profile from "@/components/chat/profile"
import Navbar from "./navbar"
import { useChatStore } from "@/store/chat-store"
import { usePresence } from "@/lib/presence-service"

const ChatLayout = () => {
    usePresence(); // Inicializa el servicio de presencia
  
  return (
    <div className="h-screen">
      <div className="top-0 left-0 w-full bg-white">
        <Navbar />
      </div>
        <div className="grid grid-cols-[2fr_5fr_2fr] h-screen flex-grow">
        <Friends />
        <Messages />
        <Profile />
      </div>
    </div>
  )
}

export default ChatLayout