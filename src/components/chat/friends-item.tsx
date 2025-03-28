import { useChatStore } from "@/store/chat-store";

interface FriendsItemProps {
  uid: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
  roomid: string;
}

const FriendsItem = ({
  uid,
  displayName,
  photoURL,
  lastMessage,
  roomid,
}: FriendsItemProps) => {
  const { friend, setFriend } = useChatStore(); // Acceder al estado del chat actual

  return (
    <article
      className={`flex items-center gap-x-3 py-2 px-4 border-b ${
        friend ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"
      }`}
      onClick={() => {
        if (friend) {
          alert("Debes salir del chat actual antes de seleccionar otro.");
          return;
        }
        setFriend({ uid, displayName, photoURL, lastMessage, roomid });
      }}
    >
      <img src={photoURL} alt="" className="w-14 h-14 rounded-full" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-gray-800">{displayName}</h3>
        <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
      </div>
    </article>
  );
};

export default FriendsItem;
