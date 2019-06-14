// @ts-check
import React, { useState, useRef, useEffect } from 'react'
import dayjs from "dayjs";

export function Chatroom({ messages, username, chatroomRef, hasUnreadMessages, onScroll }) {
  return (
    <section className="chatroom">
      <div className='messages' onScroll={onScroll} ref={chatroomRef}>
        {[...messages]
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(msg => (
            <div
              className={`message ${
                username === msg.username ? "myself" : "others"
              }`}
              key={msg.id}
            >
              <div className="message-avatar">
                <svg width="40" height="40" data-jdenticon-value={msg.username} />
              </div>
              <div className="message-body">
                <div className="message-metadata">
                  <div className="username">{msg.username}</div>
                  <div className="timestamp">
                    {dayjs(msg.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
      </div>
      {hasUnreadMessages && (
        <div className="unread-messages"
          onClick={() => chatroomRef.current.scrollTo(0, chatroomRef.current.scrollHeight)}
        >Unread Messages 👇</div>
      )}
    </section>
  );
}

export function Singup({ setUsername }) {
  const [draftUsername, setDraftUsername] = useState("");
  return (
    <section className="footer signup">
      <div>
        <label>Type in your username to start chating: </label>
        <div>
          <input
            placeholder="username"
            value={draftUsername}
            onChange={e => setDraftUsername(e.target.value)}
          />
        </div>
      </div>
      <button className="send" onClick={() => setUsername(draftUsername)}>
        Join
      </button>
    </section>
  );
}

export function Messenger({ sendMessage, username, onFocus }) {
  const [draftMessage, setDraftMessage] = useState("");
  const _sendMessage = () => {
    if (!draftMessage) return;
    sendMessage({
      text: draftMessage,
      timestamp: Date.now(),
      username: username
    });
    setDraftMessage("");
  };

  return (
    <section className="footer">
      <TextArea
        placeholder="say something..."
        value={draftMessage}
        onChange={e => setDraftMessage(e.target.value)}
        onFocus={onFocus}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            if (e.shiftKey) {
              return;
            }
            e.preventDefault();
            return _sendMessage();
          }
        }}
      />
      <button className="send" onClick={_sendMessage}>
        Send
      </button>
    </section>
  );
}

export function TextArea(props) {
  const ref = useRef(null);

  useEffect(() => {
    const text = ref.current;
    const observe = function(element, event, handler) {
      element.addEventListener(event, handler, false);
    };

    function resize() {
      text.style.height = "auto";
      text.style.height = text.scrollHeight + "px";
    }

    function delayedResize() {
      window.setTimeout(resize, 0);
    }

    observe(text, "change", resize);
    observe(text, "cut", delayedResize);
    observe(text, "paste", delayedResize);
    observe(text, "drop", delayedResize);
    observe(text, "keydown", delayedResize);
  }, []);

  return <textarea ref={ref} {...props} />;
}
