
import './App.css';
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
    <div className="App">
      <Header navigation={navigation} />
      <nav></nav>
      <main>
        <div className='container mx-auto p-4'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
