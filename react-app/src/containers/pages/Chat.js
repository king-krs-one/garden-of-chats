import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import { getUsers, getMessages, sendMessage } from "../../Ajax"
import io from 'socket.io-client'
import moment from "moment"
import config from '../../config';

const apiUrl = config.apiUrl;

const filterMessages = (chatHistory, isPublic, receiver) => {
  if (isPublic) {
    return [...chatHistory].filter(msg => msg.isPublic)
  } else {
    return [...chatHistory].filter(msg => msg.receiver === receiver)
  }
}

function Chat(props) {
  const { user } = props
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
  }

  const [chatUsers, setChatUsers] = useState([])
  const [chatReceiver, setReceiver] = useState({ isPublic: true, type: "public", userId: null })
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [chatHistoryFiltered, setChatHistoryFiltered] = useState([])
  const socket = io(apiUrl) // Connect to the WebSocket server

  const chatContainerRef = useRef(null) // Ref to reference the chat container element

  // Get users and messages
  useEffect(() => {
    if (user) {
      getUsers(setChatUsers)
      getMessages(user.username, setChatHistory)
    }
  }, []);

  // useEffect to make a connection to WebSocket 
  useEffect(() => {
    const connectSocket = () => {
      socket.current = io('http://localhost:5000');

      socket.current.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        // Implement reconnection logic here if needed
      });

      socket.current.on('chatMessage', (newMessage) => {
        console.log('received chat message from socket')

        setChatHistory((prevMessages) => {
          return [...prevMessages, { ...newMessage, user: { ...newMessage.user, isLoggedIn: user.username === newMessage.user.username } }]
        });

      });
    };

    // Establish WebSocket connection
    connectSocket();

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Use useEffect to scroll the chat container to the bottom when the messages state changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    setChatHistoryFiltered(
      filterMessages(chatHistory, chatReceiver.isPublic, chatReceiver.userId)
    )
  }, [chatHistory]);

  const selectChatUser = (isPublic, receiver) => {
    setChatHistoryFiltered(
      filterMessages(chatHistory, isPublic, receiver)
    )
    setReceiver({ isPublic, type: isPublic ? "public" : "private", userId: receiver })
  }

  const updateChatMessage = (e) => {
    setChatMessage(e.target.value)
  }

  // Textarea send message
  const sendChatMessage = (e) => {
    // Check if the user pressed enter and prevent default
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();

      socket.emit('chatMessage', {
        user,
        isPublic: chatReceiver.isPublic,
        type: chatReceiver.type,
        text: e.target.value,
        receiver: chatReceiver.userId,
        timestamp: new Date().toISOString(),
      });

      console.log('socket emit chat message')

      // hand over sender and receiver to properly address the message  
      sendMessage(user.username, e.target.value, chatReceiver.type, chatReceiver.userId, (response) => { })
      setChatMessage("")
    }
  }

  return (
    <div className="Chat flex w-full h-full max-h-full">
      {/* Chat Container */}
      {user ? (
        <div className="Chat-container max-w-screen-2xl flex flex-row flex-1">
          {/* Chat Sidebar */}
          < div className="Chat-sidebar border-r hidden md:flex flex-col w-2/5 overflow-y-auto">
            {/* Chat Search */}
            <div className="Chat-search py-4 px-2">
              <input type="text" placeholder="search chatting" className="input-field" />
            </div>
            {/* Chat List User */}
            <div className="Chat-list-user">

              {/* Chat with everybody */}
              <ChatUser onSelect={selectChatUser} user={null} isPublic={true} receiver={null} selected={chatReceiver.isPublic} />

              {/* Chat with users */}
              {chatUsers.map((chatUser, index) => {
                return (
                  <ChatUser onSelect={selectChatUser} key={index} user={chatUser} isPublic={false} receiver={chatUser.id} selected={chatReceiver.userId === chatUser.id} />
                )
              })}
            </div>
          </div>


          {/* Chat Window */}
          <div className="Chat-window w-full h-full px-5 flex flex-col justify-between">
            <div ref={chatContainerRef} className="Chat-messages flex flex-col mt-5">
              {chatHistoryFiltered.map((item, index) => {
                return <ChatMessage key={index} message={item} />
              })}
            </div>
            <div className="Chat-input">
              <textarea value={chatMessage} onChange={updateChatMessage} className="input-field" rows="3" onKeyPress={sendChatMessage} ></textarea>
            </div>
          </div>

          < div className="Chat-sidebar border-l hidden md:flex flex-col w-2/5 overflow-y-auto">
            <ChatUserProfile user={user} />
          </div>

        </div>
      ) :
        <></>
      }
    </div >
  )
}

function ChatUser(props) {
  const { onSelect, isPublic, user, receiver, selected } = props

  const publicImg = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-4 text-gray-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )

  return (
    <div onClick={() => onSelect(isPublic, receiver)} key={user ? user.id : false} className={`Chat-user ${selected ? "selected" : ""} flex`}>
      <span className="Chat-user-image">
        {isPublic ? publicImg : <img className="Chat-user-image w-16" src={user.image} alt="user image" />}
      </span>

      <div className="Chat-user-details flex-1">
        <p className="Chat-user-name inline-block">{isPublic ? "Public Chat" : user.username}</p>
        {!isPublic && <p className={`${user.online ? "Chat-user-online" : "Chat-user-offline"}`}></p>}
        <p className="Chat-user-last-msg">text text text...</p>
      </div>
    </div>
  )
}

function ChatMessage(props) {
  const { message } = props

  const classNameContainer = message.user && message.user.isLoggedIn ? "flex flex-row-reverse Message-private lg:ml-24" : "flex flex-row lg:mr-24"
  return (
    <div key={message.id} className={`Message-container ${classNameContainer}`}>
      <img className="Message-user-image hidden lg:flex" src={message.user.image} alt="profile" />
      <div className={`Message ${message.user && message.user.isLoggedIn ? "bg-sky-400 ml-8" : "bg-yellow-500 mr-8"}`}>
        <div className="Message-head">
          <div className="Message-user">{message.user.username}</div>
          <div className="Message-date">{moment(message.timestamp).format("MMM Do, hh:mm")}</div>
        </div>
        <div className="Message-body">{message.text}</div>
      </div>
    </div>
  )
}


function ChatUserProfile(props) {
  const { user } = props
  
  return (
    <div className="Chat-profile">
      <img className="Chat-profile-image" src={user.image} alt="profile image" />
      <h3 className="text-center uppercase">{user.username}</h3>
    </div>
  )
}

export default Chat