import Groups from "@/components/chat/groups"
import Messages from "@/components/chat/messages"
import Profile from "@/components/chat/profile"
import GroupInfo	 from "@/components/chat/group-info"
import Navbar from "./navbar"

const GroupLayout = () => {
    return (
        <div className="h-screen">
          <div className="absolute top-0 left-0 w-full bg-white shadow transition-opacity opacity-0 hover:opacity-100 duration-300">
            <Navbar />
          </div>
            <div className="grid grid-cols-[2fr_5fr_2fr] h-screen flex-grow">
            <Groups />
            <Messages />
            <GroupInfo />
          </div>
        </div>
      )
}

export default GroupLayout;