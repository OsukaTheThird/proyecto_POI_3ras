  import Friends from "@/components/chat/friends"
  import Messages from "@/components/chat/messages"
  import Profile from "@/components/chat/profile"
import Navbar from "./navbar"
import { usePresenceSystem } from "@/services/presence"

const ChatLayout = () => {
  usePresenceSystem(); // Inicializa el sistema de presencia
  
  return (
    <div className="h-screen">
      <div className="top-0 left-0 w-full bg-white">
        <Navbar />
      </div>
        <div className="grid grid-cols-[2fr_5fr_2fr] h-screen flex-grow">
        <Friends />
        <Messages message={""} time={""} photoURL={""} isCurrentUser={false} isLocation={false} />
        <Profile />
      </div>
    </div>
  )
}

export default ChatLayout