
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import Logo from '../../assets/images/logo.png'
import LogoText from '../../assets/images/logo_text.png'
import LogoTextWhite from '../../assets/images/logo_text_white.png'

function Header(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { navigation, user } = props
  const navigationAuth = user ? navigation : [...navigation].filter(item => !item.requiresAuth)

  return (
    <header className="App-header sticky inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-4 py-2 lg:px-4" aria-label="Global">
        {/* Header Logo */}
        <div className="App-logo flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Garden of Chats</span>
            <img className="h-10 w-auto inline-block" src={Logo} alt="" />
            <img className="h-8 w-auto inline-block pl-2 align-bottom" src={LogoTextWhite} alt="" />
          </a>
        </div>
        {/* Panel Menu Open */}
        <div className="App-panel-open flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* Header Menu */}
        <div className="App-menu hidden lg:flex lg:gap-x-12">
          {navigationAuth.map((item) => (
            <Link key={item.name} to={item.href} className='menuItem text-sm font-semibold leading-6'>{item.name}</Link>
          ))}
        </div>
        {/* App Profile */}
        <div className="App-profile hidden lg:flex lg:flex-1 lg:justify-end">
          {user ?
            <>
              <div className='menuItem mr-4'>{user.username}</div>
              <Link to="/logout" className='menuItem text-sm font-semibold leading-6'>Sign Out</Link>
            </>
            :
            <Link to="/login" className='menuItem text-sm font-semibold leading-6'>Sign In</Link>
          }
        </div>
      </nav>
      <SidePanel navigation={navigationAuth} setIsOpen={setMobileMenuOpen} isOpen={mobileMenuOpen} user={user} />
    </header>
  )
}


function SidePanel(props) {
  const { navigation, isOpen, setIsOpen, user } = props

  return (
    <Dialog as="div" className="App-panel lg:hidden" open={isOpen} onClose={setIsOpen}>
      <div className="fixed inset-0 z-50" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="App-panel-header flex items-end justify-between">
          {/* Panel Close */}
          <div className="App-panel-logo flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Garden of Chats</span>
              <img className="h-10 w-auto inline-block" src={Logo} alt="" />
              <img className="h-8 w-auto inline-block pl-2 align-bottom" src={LogoText} alt="" />
            </a>
          </div>
          <div className="App-panel-close">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <hr className='divider' />
        <div className="App-panel-menu flow-root">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className='menuItem'>{item.name}</Link>
          ))}
          <hr className='divider' />
          {user ?
            <>
              <div className='menuItem mr-4'>{user.username}</div>
              <Link to="/logout" className='menuItem text-sm font-semibold leading-6'>Sign Out</Link>
            </>
            :
            <Link to="/login" className='menuItem'>Login</Link>
          }
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

export default Header