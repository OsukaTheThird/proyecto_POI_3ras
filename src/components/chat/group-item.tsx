import { useChatStore } from '@/store/chat-store';

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
    const { setGroup, currentChat } = useChatStore();

    // Verificar si este grupo es el chat actual
    const isActive = currentChat?.type === 'group' && currentChat.data.roomid === roomid;

    return (
        <article
            className={`flex items-center gap-x-3 py-2 px-4 border-b ${
                isActive ? "bg-gray-200" : "hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={() => {
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