import React, { useState, useCallback, useEffect, useRef } from "react"
import Gun from "gun/gun"
import jdenticon from "jdenticon"
import {
  Chatroom,
  Messenger,
  Singup,
} from './components'

const chatroomId = "react-hooks-demo/fb802dca";
const gun = Gun(["https://gunjs.herokuapp.com/gun"]);

export default function App1() {
  const [self] = useState({ mounting: true });
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState();
  self.messages = messages;

  const chatroomRef = useRef(null);

  const sendMessage = useCallback(function sendMessage(msg) {
    msg.id = msg.username + "_" + msg.timestamp;
    gun.get(chatroomId).set(msg);
  }, [])

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
  }, [])

  useEffect(() => {
    if (self.mounting) return
    if (!username) {
      localStorage.removeItem('username')
    } else {
      localStorage.setItem('username', username)
    }
  }, [username])

  useEffect(() => {
    gun
      .get(chatroomId)
      .map(item => (item ? item : undefined))
      .once(({ id, text, username, timestamp }, key) => {
        const msg = { id, text, username, timestamp, key };
        setMessages([...self.messages, msg]);
        const r = chatroomRef.current;
        if (r) r.scrollTo(0, r.scrollHeight);
      });
  }, []);

  
  useEffect(() => {
    jdenticon();
  });

  return (
    <>
      <section className="header">
        <div className="heading">
          {username ? 
            <span>{username}</span>
          : <span>Hi! Let's chat</span>
          }
        </div>
        {username && <button className='logout' onClick={() => {this.setUsername(null)}}>Log out</button>}
      </section>

      <Chatroom
        messages={messages}
        username={username}
        chatroomRef={chatroomRef}
      />

      {username ? (
        <Messenger sendMessage={sendMessage} username={username} />
      ) : (
        <Singup setUsername={setUsername} />
      )}
    </>
  );
}
