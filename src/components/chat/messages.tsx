import React from 'react';
import MessagesHeader from './messages-header';
import MessagesFooter from './messages-footer';
import MessagesChat from './messages-chat';
const Messages = () => {
  return (
    <article className='grid grid-rows-[auto_1fr_auto] h-screen border-r'>
      <MessagesHeader />
      <MessagesChat />
      <MessagesFooter />
      </article>
  )
}

export default Messages;