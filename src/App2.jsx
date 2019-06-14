import React from "react";
import Gun from "gun/gun";
import jdenticon from "jdenticon";
import {
  Chatroom,
  Messenger,
  Singup,
} from './components'

const chatroomId = "react-hooks-demo/fb802dca";
const gun = Gun(["https://gunjs.herokuapp.com/gun"]);

export default class App2 extends React.Component {
  state = {
    username: undefined,
    messages: []
  }

  chatroomRef = React.createRef()

  sendMessage = (msg) => {
    msg.id = msg.username + "_" + msg.timestamp
    gun.get(chatroomId).set(msg)
  }

  setUsername = (username) => {
    this.setState({ username }, () => {
      if (!username) {
        localStorage.removeItem('username')
      } else {
        localStorage.setItem('username', username)
      }
    })
  }

  componentDidMount() {
    // subscribe to message source
    gun
      .get(chatroomId)
      .map(item => (item ? item : undefined))
      .once(({ id, text, username, timestamp }, key) => {
        const msg = { id, text, username, timestamp, key }
        this.setState({ messages: [...this.state.messages, msg] })
        if (msg.username === username) {
          const r = this.chatroomRef.current
          if (r) r.scrollTo(0, r.scrollHeight)
        }
      })
    
    // add avatar
    jdenticon()

    // get username
    this.setState({ username: localStorage.getItem('username') })
  }

  componentDidUpdate() {
    jdenticon()
  }

  render() {
    const { username, messages } = this.state

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
          chatroomRef={this.chatroomRef}
        />

        {username ? (
          <Messenger sendMessage={this.sendMessage} username={username} />
        ) : (
          <Singup setUsername={(username) => this.setState({ username })} />
        )}
      </>
    )
  }
}
