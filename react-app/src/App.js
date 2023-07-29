
import './App.css';
import './assets/css/styles.css'
import './assets/css/messenger.css'
import Header from './containers/layout/Header';
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home, Chat, Contact, Login, Logout, Profile } from './containers/pages'


const navigation = [
  { name: 'Home', href: '/', requiresAuth: false },
  { name: 'Chat', href: '/chat', requiresAuth: true },
  { name: 'Profile', href: '/profile', requiresAuth: true },
  { name: 'Contact', href: '/contact', requiresAuth: false },
]


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userSession, setUserSession] = useState(null);
  const [message, setMessage] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);

  useEffect(() => {
    if (prevLocation && prevLocation.pathname !== "/login" && prevLocation.pathname !== "/logout") {
      setMessage(null)
    }
    setPrevLocation(location)
  }, [location]);

  const handleLogin = (data) => {
    setUserSession({ username: data.username });
    setMessage(data.message)
  };

  const handleLogout = (data) => {
    // Perform logout logic and clear the user session state here
    setUserSession(null);
    setMessage(data.message)
  };

  const handleRegister = (data) => {
    setMessage(data.message)
  };

  return (
    <div className="App h-full flex flex-col" >
      <Header navigation={navigation} userSession={userSession} handleLogout={handleLogout} />
      {message && <div className={`w-full alert alert-${message.type}`}>{message.text}</div>}
      <main className='App-main w-full flex-1'>
        {userSession ? (
          <Routes>
            <Route path="/" element={<Home message={message} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} handleRegister={handleRegister} navigateTo="/home" />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          </Routes>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login handleLogin={handleLogin} handleRegister={handleRegister} navigateTo="/home" />} />
              <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            </Routes>
          </>
        )
        }
      </main>
    </div>
  );
}

export default App;
