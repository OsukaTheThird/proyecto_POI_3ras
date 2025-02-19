import {useEffect, useState} from "react";
import FriendSearch from "./friend-search";
import FriendsItem from "./friends-item"

interface Friend {
  uID: string;
  displayName: string;
  photoURL: string;
  lastMessage: string;
}
const Friends = () => {

  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await fetch("https://randomuser.me/api/?results=15&nat=mx");
      const { results } = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = results.map((user: any) => ({
        uID: user.login.uuid,
        displayName: user.name.first,
        photoURL: user.picture.large,
        lastMessage: "Hi, i am " + user.name.first,
      }));

      setFriends(data);
    };

    getFriends();
  }, []);

  return (
    <div className='grid grid-rows-[auto_1fr] h-screen border-r'>
      <section className='border-b p-4'>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Chats</h2>
         <FriendSearch />
       </section>
      <section className="custom-scrollbar">

        {friends.map((friend) => (
          <FriendsItem key={friend.uID}
          {...friend}/>
        ))}
        
      </section>
    </div>
  );
};

export default Friends