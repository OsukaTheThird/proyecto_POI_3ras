interface FriendsItemProps {
  displayName: string;
  photoURL: string;
  lastMessage: string;
}

const FriendsItem = ({
  displayName,
  photoURL,
  lastMessage,
}: FriendsItemProps) => {
  return (
    <article className='flex items-center gap-x-3 py-2 px-4 border-b hover:bg-gray-200'>
          <img 
            src={photoURL} 
            alt="" 
            className='w-14 h-14 rounded-full'/>
          <div>
            <h3 className='font-semibold text-lg text-gray-800'>{displayName}</h3>
            <p className='text-xs text-gray-500'>{lastMessage}</p>
          </div>
        </article>
  )
}

export default FriendsItem