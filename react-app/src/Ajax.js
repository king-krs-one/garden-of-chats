import axios from "axios";

///// General Ajax Call 
//////////////////////////////////////////////////

const makeAjaxRequest = (url, method, data, callback) => {
  axios({
    url: "http://localhost:5000" + url,
    method: method,
    data: data
  })
    .then(response => {
      callback(response.data); // Execute the callback function with the response data
    })
    .catch(error => {
      console.error('Error making request:', error);
    });
};


///// Functional Ajax Calls - Login/logout
//////////////////////////////////////////////////

const logoutUser = (username) => axios.post('http://localhost:5000/logout', { username: username })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error logging out:', error);
  });

///// Specific Ajax Calls - Request/Send Data
//////////////////////////////////////////////////


const getUsers = (callback) => {
  axios.get('http://localhost:5000/api/users')
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}

const getMessages = (username, callback) => axios.get('http://localhost:5000/api/chat-messages')
  .then((response) => {
    callback(response.data.map(msg => {
      return {
        ...msg,
        user: {
          ...msg.user,
          isLoggedIn: msg.user.username === username
        }
      }
    }));
  })
  .catch((error) => {
    console.error('Error fetching messages:', error);
  });


// Send message to backend
const sendMessage = (message, username, setMessage, callback) => axios.post('http://localhost:5000/api/send-message', { message: message }, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
})
  .then(() => {
    // Clear the textarea after sending the message
    setMessage("")
    // Refresh the chat messages after sending the message
    axios.get('http://localhost:5000/api/chat-messages')
      .then((response) => {
        callback(response.data.map(msg => {
          return {
            ...msg,
            user: {
              ...msg.user,
              isLoggedIn: msg.user.username === username
            }
          }
        }));
      })
      .catch((error) => {
        console.error('Error fetching chat messages:', error);
      });
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });

export { getUsers, getMessages, sendMessage, logoutUser }