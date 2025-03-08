import { useAuth } from "reactfire";
import { Button } from "../ui/button";

const Profile = () => {

  const auth = useAuth();

  const handleClickLogout = async () => {
    await auth.signOut();
  }
  
  console.log({
    currentUser: auth.currentUser,
  });

  return (
    <div className="p-4 text-center border-l">
      <img 
        src="https://randomuser.me/api/portraits/med/men/44.jpg" 
        alt="" 
        className="rounded-md mb-4 mx-auto w-24 h-24"
      />
      <h2 className="text-xl font-bold text-gray-700 mb-4">Perfil</h2>
      <p className="font-semibold">
        {
          auth.currentUser?.displayName || "No name"
        }</p>
      <p className="text-gray-500 mb-2">
        {
          auth.currentUser?.email
        }</p>
      <Button className="w-full" onClick={handleClickLogout}>Salir</Button>
    </div>
  )
}

export default Profile