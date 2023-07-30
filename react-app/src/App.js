
import './App.css';
import './assets/css/styles.css'
import './assets/css/messenger.css'
import Header from './containers/layout/Header';
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home, Chat, Contact, Login, Logout, Profile } from './containers/pages'
import { logoutUser } from './Ajax';

const navigation = [
  { name: 'Home', href: '/', requiresAuth: false },
  { name: 'Chat', href: '/chat', requiresAuth: true },
  { name: 'Profile', href: '/profile', requiresAuth: true },
  { name: 'Contact', href: '/contact', requiresAuth: false },
]

function App() {
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [session, setSession] = useState(() => {
    // Get the user session data from localStorage on initial load
    const storedSession = localStorage.getItem('session');
    return storedSession ? JSON.parse(storedSession) : null;
  });
  const [prevLocation, setPrevLocation] = useState(null);

  useEffect(() => {
    if (prevLocation && message && prevLocation.pathname !== "/login" && prevLocation.pathname !== "/logout") {
      setMessage(null)
    }
    setPrevLocation(location)
  }, [location]);

  const handleLogin = (data) => {
    setSession({ username: data.username, token: data.token });
    setMessage(data.message)
  };

  const handleLogout = (data) => {
    logoutUser(session ? session.username : null)

    // Perform logout logic and clear the user session state here
    setSession(null);
    setMessage(data.message)
    localStorage.removeItem('token')
    localStorage.removeItem('session')
  }

  const handleRegister = (data) => {
    setMessage(data.message)
  };


  return (
    <div className="App h-full flex flex-col" >
      <Header navigation={navigation} session={session} handleLogout={handleLogout} />
      {message && <div className={`w-full alert alert-${message.type}`}>{message.text}</div>}
      <main className='App-main w-full flex-1'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat session={session} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} handleRegister={handleRegister} navigateTo="/home" />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          </Routes>
      </main>
    </div>
  );
}

export default App;
