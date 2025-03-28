import Friends from "@/components/chat/friends"
import Messages from "@/components/chat/messages"
import Profile from "@/components/chat/profile"
import Navbar from "./navbar"
import { useChatStore } from "@/store/chat-store"

const ChatLayout = () => {
  
  return (
    <div className="h-screen">
      <div className="absolute top-0 left-0 w-full bg-white shadow transition-opacity opacity-0 hover:opacity-100 duration-300">
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