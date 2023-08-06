
import './App.css';
import './assets/css/styles.css'
import './assets/css/messenger.css'
import Header from './containers/layout/Header';
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home, Chat, Contact, Login, Logout, Profile } from './containers/pages'
import { checkTokenValidity } from './Ajax';
import ProtectedRoute from './containers/utils/ProtectedRoutes';

const navigation = [
  { name: 'Home', href: '/', requiresAuth: false },
  { name: 'Chat', href: '/chat', requiresAuth: true },
  { name: 'Profile', href: '/profile', requiresAuth: true },
  { name: 'Contact', href: '/contact', requiresAuth: false },
]

function App() {
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null)
  const [prevLocation, setPrevLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the token in the localStorage is still valid
    const checkTokenAndSetUser = async () => {
      const user = await checkTokenValidity();
      setUser(user);
      setLoading(false);
    };

    checkTokenAndSetUser();
  }, [location]);

  useEffect(() => {
    // if (prevLocation && message && prevLocation.pathname !== "/login" && prevLocation.pathname !== "/logout") {
    //   setMessage(null)
    // }
    if (location.state && location.state.message) {
      setMessage(location.state.message)
    }
    else {
      setMessage(null)
    }
    // setPrevLocation(location)
  }, [location]);

  const handleLogin = (data) => {
    if (data.user) {
      setUser(data.user);
    }
  };

  const handleLogout = (data) => {
    // Perform logout logic and clear the user state here
    setUser(null);
    localStorage.removeItem('token')
  }

  const handleRegister = (data) => {
    setMessage(data.message)
  };

  // Conditional rendering based on loading state
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App h-full flex flex-col" >
      <Header navigation={navigation} user={user} handleLogout={handleLogout} />
      {message && <div className={`w-full alert alert-${message.type}`}>{message.text}</div>}
      <main className='App-main w-full flex-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ProtectedRoute element={<Chat user={user} />} />} />
          {/* <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to='/login' />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} handleRegister={handleRegister} navigateTo="/home" />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
