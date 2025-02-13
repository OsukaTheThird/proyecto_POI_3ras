import FriendsItem from "./friends-item"

const Friends = () => {
  return (
    <div className='grid grid-rows-[auto_1fr]'>
      <section className='border-b p-4'>
        <h2>Chats</h2>
         <div>Buscar amigos</div>
       </section>
      <section className=''>

        {Array.from({length: 10}).map((_, i) => (
          <FriendsItem key={i}/>
        ))}
        
      </section>
    </div>
  )
}

export default Friends