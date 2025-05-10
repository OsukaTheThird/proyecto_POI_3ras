import { useGroupChatStore } from "@/store/chat-store";

interface GroupItemProps {
    uid: string[];
    displayName: string;
    photoURL: string;
    lastMessage: string;
    roomid: string;
}

const GroupItem = ({
    uid,
    displayName,
    photoURL,
    lastMessage,
    roomid,
}: GroupItemProps) => {
    // Filtramos directamente en el componente
    if (uid.length <= 2 || !displayName) {
        return null; // No renderizar si no cumple las condiciones
    }

    const { groupChat, setGroup } = useGroupChatStore();

    return (
        <article
            className={`flex items-center gap-x-3 py-2 px-4 border-b ${
                groupChat ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"
            }`}
            onClick={() => {
                if (groupChat) {
                    alert("Debes salir del chat actual antes de seleccionar otro.");
                    return;
                }
                setGroup({ uid, displayName, photoURL, lastMessage, roomid });
            }}
        >
            <img 
                src={photoURL || "/default-group-avatar.png"} 
                alt={displayName} 
                className="w-14 h-14 rounded-full" 
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-group-avatar.png";
                }}
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-800">{displayName}</h3>
                <p className="text-xs text-gray-500 truncate">{lastMessage || "No hay mensajes"}</p>
                <p className="text-xs text-gray-400">Miembros: {uid.length}</p>
            </div>
        </article>
    );
};

export default GroupItem;