import Friends from "@/components/chat/friends"
import Messages from "@/components/chat/messages"
import Profile from "@/components/chat/profile"
import Navbar from "./navbar"

const ChatLayout = () => {
  return (
    <div className="h-screen">
      <Navbar />
        <div className="grid grid-cols-[2fr_5fr_2fr] h-screen flex-grow">
        <Friends />
        <Messages />
        <Profile />
      </div>
    </div>
  )
}

export default ChatLayout