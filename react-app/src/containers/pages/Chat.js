import { useState, useEffect } from "react";
import axios from "axios";
import { getUsers, getMessages, sendMessage } from "../../Ajax";

function Chat(props) {
  const [username, setUsername] = useState(props.session ? props.session.username : null)
  const [chatUsers, setChatUsers] = useState([])
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  // Get users and messages
  useEffect(() => {
    getUsers(setChatUsers)
    getMessages(username, setChatHistory)

  }, []);

  const onChatMessageChange = (e) => {
    setChatMessage(e.target.value)
  }

  // Textarea send message
  const onChatMessageEnter = (e) => {
    // Check if the user pressed enter and prevent default
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();

      sendMessage(e.target.value, username, setChatMessage, setChatHistory)
    }
  }

  return (
    <div className="Chat flex w-full h-full max-h-full">
      {/* Chat Container */}
      <div className="Chat-container container flex flex-row flex-1">

        {/* Chat Sidebar */}
        <div className="Chat-sidebar hidden md:flex flex-col w-2/5 border-r-2 overflow-y-auto">
          {/* Chat Search */}
          <div className="border-b-2 py-4 px-2">
            <input type="text" placeholder="search chatting" className="input-field" />
          </div>
          {/* Chat List User */}
          <div className="Chat-list-user">
            {chatUsers.map((user, index) => {
              debugger
              return (
                <div key={user.id} className={`Chat-user flex`}>
                  <img className="Chat-user-image" src={ user.online ? "../../media/images/profiles/ava.png" : "../../media/images/profiles/una.png"} />
                  <div className="Chat-user-details flex-1">
                    <p className="Chat-user-name inline-block">{user.username}</p>
                    <p className={`${user.online ? "Chat-user-online" : "Chat-user-offline"}`}></p>
                    <p className="Chat-user-last-msg">text text text...</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>


        {/* Chat Window */}
        <div className="Chat-window w-full h-full px-5 flex flex-col justify-between">
          <div className="Chat-messages flex flex-col mt-5">
            {chatHistory.map((item, index) => {
              const user = chatUsers.find(user => user.id === item.userId)
              const classNameContainer = item.user && item.user.isLoggedIn ? "flex flex-row-reverse Message-private lg:ml-24" : "flex flex-row lg:mr-24"
              // const classNameMessage =  item.user.isLoggedIn ? "lg:ml-24" : "lg:mr-24"
              debugger
              return (
                <div key={item.id} className={`Message-container ${classNameContainer}`}>
                  <img className="Message-user-image hidden lg:flex" src={item.user.isLoggedIn ? "../../media/images/profiles/ava.png" :"../../media/images/profiles/una.png" } />
                  <div className={`Message ${item.user && item.user.isLoggedIn ? "bg-sky-400 ml-8" : "bg-yellow-500 mr-8"}`}>
                    <div className="Message-head">
                      <div className="Message-user">{item.user.username}</div>
                      <div className="Message-date">{item.timestamp}</div>
                    </div>
                    <div className="Message-body">{item.message}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="Chat-input">
            <textarea value={chatMessage} onChange={onChatMessageChange} className="input-field" rows="3" onKeyPress={onChatMessageEnter} ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat