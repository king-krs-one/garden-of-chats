import axios from "axios";
import config from './config';
import jwt_decode from "jwt-decode";

const apiUrl = config.apiUrl;

///// General Ajax Call 
//////////////////////////////////////////////////

const makeAjaxRequest = (url, method, data, callback) => {
  axios({
    url: apiUrl + url,
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

const loginUser = (username, password, callback) => axios.post(apiUrl + '/login', {
    username,
    password,
  })
  .then((response) => {
    callback(null, response.data);
  })
  .catch((error) => {
    callback(error);
  });

const logoutUser = (username, callback) => axios.post(apiUrl + '/logout', { username: username })
  .then((response) => {
    console.log(response.data);    
    callback(null, response.data);
  })
  .catch((error) => {
    console.error('Error logging out:', error);    
    callback(error);
  });

///// Specific Ajax Calls - Request/Send Data
//////////////////////////////////////////////////


const getUsers = (callback) => {
  axios.get(apiUrl + '/api/users')
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
}

const getMessages = (username, callback) => axios.get(apiUrl + '/api/chat-messages')
  .then((response) => {
    callback(response.data.map(msg => {
      return {
        ...msg,
        isPublic: msg.type === "public",
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
const sendMessage = (username, text, type, receiver, callback) => {
  axios.post(apiUrl + '/api/send-message', { text, type, receiver }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
    .then(() => {
      // Refresh the chat messages after sending the message
      axios.get(apiUrl + '/api/chat-messages')
        .then((response) => {
          console.log(response)
          callback(response.data);
        })
        .catch((error) => {
          console.error('Error fetching chat messages:', error);
        })
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    })
}

const checkTokenValidity = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null; // No token in local storage, user is not logged in
  }

  try {
    const response = await axios.post(apiUrl + '/validateToken', { token });

    // Token is valid, return the user
    return response.data.user;
  } catch (error) {
    const decodedToken = jwt_decode(token);

    // if the token is not valid/expired, we still want to log out the user in the backend,
    // because otherwise the user is still listed as online 
    // properly implemented, we should maybe try to refresh the token first
    if (decodedToken.username) {
      // callback to be added, to check if logout was successfull
      logoutUser(decodedToken.username, () => {})
    }
    // Token is invalid or expired, remove the token from local storage    
    localStorage.removeItem('token');
    return null;
  }
};

export { getUsers, getMessages, sendMessage, loginUser, logoutUser, checkTokenValidity }