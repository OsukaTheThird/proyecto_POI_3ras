import FriendSearch from "./friend-search";
import FriendsItem from "./friends-item"

const Friends = () => {
  return (
    <div className='grid grid-rows-[auto_1fr] h-screen'>
      <section className='border-b p-4'>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Chats</h2>
         <FriendSearch />
       </section>
      <section className="custom-scrollbar">

        {Array.from({length: 15}).map((_, i) => (
          <FriendsItem key={i}/>
        ))}
        
      </section>
    </div>
  );
};

export default Friends