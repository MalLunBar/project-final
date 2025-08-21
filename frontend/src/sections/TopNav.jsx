import { useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { CircleUserRound, Moon, CirclePlus, Search } from 'lucide-react'
import Menu from '../components/Menu'
import MenuItem from '../components/MenuItem'
import NavItem from '../components/NavItem'
import MenuLogo from '../components/MenuLogo'

const TopNav = () => {

  const [isOpen, setIsOpen] = useState(false)

  // close menu when an item is clicked
  const handleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { id: 1, text: 'HEM', linkTo: '/' },
    { id: 2, text: 'SÖK LOPPIS', linkTo: '/loppis' },
    { id: 3, text: 'LÄGG TILL LOPPIS', linkTo: '/add' },
    { id: 4, text: 'OM OSS', linkTo: '/about' },
    { id: 5, text: 'KONTAKT', linkTo: '/contact' },
  ]

  return (
    <header className="sticky top-0 w-full left-0 z-1100 bg-white border-b border-border shadow-sm">
      <nav
        className="flex items-center justify-between p-3 lg:p-4"
        aria-label="Main"
      >
        {/* Logo - only show when hamburger menu is closed? */}
        <MenuLogo  />


        {/* Mobile Navigation */}
        <div className='lg:hidden'>
          {isOpen &&
            <div
              className='fixed right-0 top-0 w-[70%] h-full p-2 pt-20 bg-white border-r border-border shadow-sm  transition-transform duration-400 ease-in-out'
              onClick={handleMenu}
            >
              {/* show menulogo here? */}
              <Menu type='mobile'>
                {menuItems.map(item => (
                  <li
                    key={item.id}
                    className='pb-4'
                  >
                    <MenuItem text={item.text} linkTo={item.linkTo} />
                  </li>
                ))}
              </Menu>
            </div>
          }

          <div className='flex items-center justify-end'>
            {/* add */}
            <NavItem
              icon={CirclePlus}
              linkTo='/add'
              text="Ny Loppis" />

            {/* Search */}
            <NavItem
              icon={Search}
              linkTo='/loppis'
              text="Sök Loppis" />

            {/* profile */}
            <NavItem
              icon={CircleUserRound}
              linkTo='/profile'
              text="Profil" />

            <Hamburger
              toggled={isOpen}
              size={20}
              toggle={setIsOpen} label='Show menu' rounded />

          </div>
        </div>



        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center justify-between px-5'>
          <Menu type='desktop'>
            {menuItems.map(item => (
              <li
                key={item.id}
                className=''
              >
                <MenuItem text={item.text} linkTo={item.linkTo} />
              </li>
            ))}
          </Menu>
        </div>






      </nav>
    </header>
  )
}

export default TopNav