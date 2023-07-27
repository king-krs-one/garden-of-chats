
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import Logo from '../../assets/images/logo.png'

function Header(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { navigation } = props

  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src={Logo} alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className='menuItem text-sm font-semibold leading-6'>{item.name}</Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="/login" className='menuItem text-sm font-semibold leading-6'>Sign in</Link>
        </div>
      </nav>
      <SidePanel navigation={navigation} setIsOpen={setMobileMenuOpen} isOpen={mobileMenuOpen} />
    </header>
  )
}


function SidePanel(props) {
  const { navigation, isOpen, setIsOpen } = props

  return (
    <Dialog as="div" className="lg:hidden" open={isOpen} onClose={setIsOpen}>
      <div className="fixed inset-0 z-50" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="#" className="-m-1.5 p-1.5">
            <img className="h-8 w-auto" src={Logo} alt="" />
          </a>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className='menuItem block text-base font-semibold leading-7'>{item.name}</Link>
              ))}
            </div>
            <div className="py-6">
              <Link to="/login" className='menuItem block text-base font-semibold leading-7'>Sign In</Link>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

export default Header