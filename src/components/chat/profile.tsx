import { useAuth, useUser} from "reactfire";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/chat-store";

const Profile = () => {

  const auth = useAuth();
  const {data: user} = useUser();
  const {resetFriend} = useChatStore();

  const handleClickLogout = async () => {
    resetFriend();
    await auth.signOut();
  }
  
  return (
    <div className="p-4 text-center border-l">
      {user /*&& user.photoURL*/ ? (
        <>
          <img
          //cambiar a almacenamiento local en el servidor 
            src={user?.photoURL || "avatar.png"}
            //src="https://randomuser.me/api/portraits/med/men/44.jpg" 
            alt=""
            className="rounded-md mb-4 mx-auto w-24 h-24"
          />
          <h2 className="text-xl font-bold text-gray-700 mb-4">Profile</h2>
          <p className="font-semibold">{user?.displayName || "No name"}</p>
          <p className="text-gray-500 mb-2">{user?.email}</p>
          <Button
            className="w-full"
            onClick={handleClickLogout}
          >
            Logout
          </Button>
        </>
      ) : (
        <p>Loading info user...</p>
      )}
    </div>
  );
};

export default Profile