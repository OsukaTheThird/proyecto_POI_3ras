const FriendsItem = () => {
  return (
    <article className='flex items-center gap-x-3 py-2 px-4 border-b hover:bg-gray-200'>
          <img 
            src="https://randomuser.me/api/portraits/women/50.jpg" 
            alt="" 
            className='w-14 h-14 rounded-full'/>
          <div>
            <h3 className='font-semibold text-lg text-gray-800'>Clara Schürer</h3>
            <p className='text-xs text-gray-500'>Lorem ipsum dolor sit amet...</p>
          </div>
        </article>
  )
}

export default FriendsItem