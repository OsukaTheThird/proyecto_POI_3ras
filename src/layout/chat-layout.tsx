import Friends from "@/components/chat/friends"
import Messages from "@/components/chat/messages"
import Profile from "@/components/chat/profile"

const ChatLayout = () => {
  return (
    <div className="grid grid-cols-[2fr_5fr_2fr] h-screen">
      <Friends />
      <Messages />
      <Profile />
    </div>
  )
}

export default ChatLayout