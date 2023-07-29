import { useState } from "react";

const users = [
  {
    key: 1,
    name: "Ava Nickels",
    color: "bg-sky-400",
    isOnline: true,
    isLoggedIn: true,
    image: require("../../media/images/profiles/ava.png"),
  },
  {
    key: 2,
    name: "Una Nickels",
    color: "bg-yellow-500",
    isOnline: true,
    isLoggedIn: false,
    image: require("../../media/images/profiles/una.png"),
  }
]

const messages = [
  {
    key: 1,
    user: users[0],
    time: "13:34",
    date: "2023-07-27",
    text: "Hello there"
  },
  {
    key: 2,
    user: users[1],
    time: "13:42",
    date: "2023-07-27",
    text: "Good Afternoon, how are you ?"
  },
  {
    key: 3,
    user: users[0],
    time: "14:01",
    date: "2023-07-27",
    text: "I am great, how are you ?"
  },
  {
    key: 4,
    user: users[1],
    time: "14:24",
    date: "2023-07-27",
    text: "Thanks, I am fine too"
  }
]

function Chat() {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState(messages)

  const onChatMessageChange = (e) => {
    setChatMessage(e.target.value)
  }
  const onChatMessageEnter = (e) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      console.log(e.target.value);
      setChatHistory([...chatHistory, {
        key: chatHistory.length,
        user: users[1],
        time: "14:26",
        date: "2023-07-27",
        text: e.target.value
      }])
      setChatMessage("")
      // return console.log(e.target.value);
    }
  }

  return (
    <div className="Chat flex w-full min-h-full">
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
            {users.map((user, index) => {
              return (
                <div key={user.key} className={`Chat-user ${user.isLoggedIn && "Chat-user-online"} flex`}>
                  <img className="Chat-user-image" src={user.image} />
                  <div className="Chat-user-details flex-1">
                    <p className="Chat-user-name">{user.name}</p>
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
              const classNameContainer = item.user.isLoggedIn ? "flex flex-row-reverse Message-private lg:ml-24" : "flex flex-row lg:mr-24"
              // const classNameMessage =  item.user.isLoggedIn ? "lg:ml-24" : "lg:mr-24"
              return (
                <div key={item.key} className={`Message-container ${classNameContainer}`}>
                  <img className="Message-user-image hidden lg:flex" src={item.user.image} />
                  <div className={`Message ${item.user.color} ${item.user.isLoggedIn ? "ml-8" : "mr-8"}`}>
                    <div className="Message-head">
                      <div className="Message-user">{item.user.name}</div>
                      <div className="Message-date">{item.time}</div>
                    </div>
                    <div className="Message-body">{item.text}</div>
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