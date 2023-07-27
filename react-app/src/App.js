
import './App.css';
import Header from './containers/layout/Header';


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
          Page Content
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
