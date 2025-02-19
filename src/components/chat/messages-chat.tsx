import React from 'react'
import { useEffect, useRef } from 'react';
import Message from './message';
import { ref } from 'firebase/storage';

const MessagesChat = () => {
const containerRef = useRef<HTMLDivElement>(null);
console.log(containerRef);

useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }   
}, []);
//este corchete va hacer pendiente de que algo cambie
  return (
    
<main ref={containerRef} className='p-4 flex-1 bg-green-200 space-y-2 cursor-pointer custom-scrollbar'>
        <Message 
         message='Hola, ¿cómo estás?'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/men/40.jpg'
            isCurrentUser={false}   
        />
        <Message 
         message='Aún así 🙅‍♂️ pues no el que esta persona 👩 haya estado en mi vida ⛺🌌 no ✖ ha hecho que me sienta 
                    mejor ✔📈 porque tu lugar 🏞 y lo que significas 🫵 para mí 🧏🏻‍♂️ en mi vida´⛺🌌 es algo irremplazable 
                    🗑️✖ es algo que no voy a volver a vivir 🙁🥤💧 y es algo que literalmente 👍✔ forma parte de de mi 
                    👦👈 y de mi vida 🧏🏻‍♂️🌌 y va a ser así siempre ♾️ y yo no sé por qué no 😕✖ o sea 🤔💭 por qué solo 
                    dejaba pasar el tiempo ⏳⏰ y no hacía nada 😐✖ y sabía que lo tenía que hacer y no 🤚⛔✖ y no podía 
                    😐⛔✖ y no podía 😕⛔✖ y no podía 😿⛔✖ o sea 🙁 cuando estaba a punto de hacerlo 🏃🏽 sentía que me 
                    bloqueaba 🚫🛑🚧 y no podía 😕🚫'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/med/men/44.jpg'
            isCurrentUser={true}/>
        <Message 
         message='Hola, ¿cómo estás?'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/men/40.jpg'
            isCurrentUser={false}   
        />
        <Message 
         message='Aún así 🙅‍♂️ pues no el que esta persona 👩 haya estado en mi vida ⛺🌌 no ✖ ha hecho que me sienta 
                    mejor ✔📈 porque tu lugar 🏞 y lo que significas 🫵 para mí 🧏🏻‍♂️ en mi vida´⛺🌌 es algo irremplazable 
                    🗑️✖ es algo que no voy a volver a vivir 🙁🥤💧 y es algo que literalmente 👍✔ forma parte de de mi 
                    👦👈 y de mi vida 🧏🏻‍♂️🌌 y va a ser así siempre ♾️ y yo no sé por qué no 😕✖ o sea 🤔💭 por qué solo 
                    dejaba pasar el tiempo ⏳⏰ y no hacía nada 😐✖ y sabía que lo tenía que hacer y no 🤚⛔✖ y no podía 
                    😐⛔✖ y no podía 😕⛔✖ y no podía 😿⛔✖ o sea 🙁 cuando estaba a punto de hacerlo 🏃🏽 sentía que me 
                    bloqueaba 🚫🛑🚧 y no podía 😕🚫'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/med/men/44.jpg'
            isCurrentUser={true}/>
        <Message 
         message='Hola, ¿cómo estás?'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/men/40.jpg'
            isCurrentUser={false}   
        />
        <Message 
         message='Aún así 🙅‍♂️ pues no el que esta persona 👩 haya estado en mi vida ⛺🌌 no ✖ ha hecho que me sienta 
                    mejor ✔📈 porque tu lugar 🏞 y lo que significas 🫵 para mí 🧏🏻‍♂️ en mi vida´⛺🌌 es algo irremplazable 
                    🗑️✖ es algo que no voy a volver a vivir 🙁🥤💧 y es algo que literalmente 👍✔ forma parte de de mi 
                    👦👈 y de mi vida 🧏🏻‍♂️🌌 y va a ser así siempre ♾️ y yo no sé por qué no 😕✖ o sea 🤔💭 por qué solo 
                    dejaba pasar el tiempo ⏳⏰ y no hacía nada 😐✖ y sabía que lo tenía que hacer y no 🤚⛔✖ y no podía 
                    😐⛔✖ y no podía 😕⛔✖ y no podía 😿⛔✖ o sea 🙁 cuando estaba a punto de hacerlo 🏃🏽 sentía que me 
                    bloqueaba 🚫🛑🚧 y no podía 😕🚫'
            time='Hoy'
            photoURL='https://randomuser.me/api/portraits/med/men/44.jpg'
            isCurrentUser={true}/>


      </main>  )
}

export default MessagesChat;