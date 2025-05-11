import Groups from "@/components/chat/groups"
import Messages from "@/components/chat/messages"
import Navbar from "./navbar"
import GroupProfile from "@/components/chat/group-profile"
import { usePresenceSystem } from "@/services/presence";
const GroupLayout = () => {
  usePresenceSystem(); // Inicializa el sistema de presencia
  
  return (
    <div className="h-screen">
      <div className="absolute top-0 left-0 w-full bg-white shadow">
        <Navbar />
      </div>
      <div className="grid grid-cols-[2fr_5fr_2fr] h-screen flex-grow">
        <Groups />
        <Messages message={""} time={""} photoURL={""} isCurrentUser={false} isLocation={false} />
        <GroupProfile />
      </div>
    </div>
  );
};

export default GroupLayout;