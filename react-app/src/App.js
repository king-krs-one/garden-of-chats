
import './App.css';
import './assets/css/styles.css'
import './assets/css/messenger.css'
import Header from './containers/layout/Header';
import { Route, Routes } from 'react-router-dom';
import { Home, Chat, Contact, Login, Profile } from './containers/pages'


const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Profile', href: '/profile' },
  { name: 'Contact', href: '/contact' },
]


function App() {

  return (
    <div className="App h-full flex flex-col">
      <Header navigation={navigation} />
      <main className='App-main w-full flex-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
