import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Squash as Hamburger } from 'hamburger-react'
import { CircleUserRound, Moon, CirclePlus, Search } from 'lucide-react'
import Menu from '../components/Menu'
import MenuItem from '../components/MenuItem'
import NavItem from '../components/NavItem'
import MenuLogo from '../components/MenuLogo'

import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'

const TopNav = () => {

  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // auth + modal
  const { user, token, logout } = useAuthStore()
  const openLoginModal = useModalStore(s => s.openLoginModal)
  const isLoggedIn = Boolean(user && token)

  // close menu when an item is clicked
  const handleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleAuthItem = () => {
    if (isLoggedIn) {
      logout()
      navigate('/')        // tillbaka till startsidan efter logout
    } else {
      openLoginModal('Logga in för att fortsätta')
    }
    setIsOpen(false)        // stäng mobilenyn om den är öppen
  }


  const menuItems = [
    { id: 1, text: 'HEM', linkTo: '/' },
    { id: 2, text: 'SÖK LOPPIS', linkTo: '/search' },
    { id: 3, text: 'LÄGG TILL LOPPIS', linkTo: '/add', requiresAuth: true },
    { id: 4, text: 'OM OSS', linkTo: '/about' },
    { id: 5, text: 'KONTAKT', linkTo: '/contact' },
    { id: 6, text: 'PROFIL', linkTo: '/profile', requiresAuth: true },

  ]

  return (
    <header className="sticky top-0 w-full left-0 z-1100 bg-white border-b border-border shadow-sm">
      <nav
        className="p-3 lg:p-4"
        aria-label="Main"
      >

        {/* Mobile Navigation */}
        <div className='lg:hidden'>
          {isOpen &&
            <div
              className='fixed right-0 top-0 w-[60%] max-w-70 h-full p-2 pt-20 bg-white border-r border-border shadow-sm  transition-transform duration-400 ease-in-out'
              onClick={handleMenu}
            >

              <Menu type='mobile'>
                {menuItems.map(item => (
                  <li key={item.id} className='pb-4'>
                    <MenuItem text={item.text} linkTo={item.linkTo} requiresAuth={item.requiresAuth} />
                  </li>
                ))}

                <li className='pb-4'>
                  {/* Använder MenuItem för samma look, men klick hanteras här */}
                  <div onClick={(e) => {
                    e.stopPropagation()
                    handleAuthItem()
                  }}>
                    <MenuItem
                      text={isLoggedIn ? 'LOGGA UT' : 'LOGGA IN'}
                      linkTo={isLoggedIn ? '/' : '#'}
                    />
                  </div>
                </li>
              </Menu>

            </div>
          }

          {/* Logo - only show when hamburger menu is closed? */}

          <div className='flex items-center justify-between'>
            <MenuLogo />

            <div className='flex items-center justify-between md:min-w-60 gap-2'>
              {/* add */}
              <NavItem
                icon={CirclePlus}
                linkTo='/add'
                text="Skapa"
                requiresAuth />

              {/* Search */}
              <NavItem
                icon={Search}
                linkTo='/search'
                text="Sök" />

              {/* profile */}
              <NavItem
                icon={CircleUserRound}
                linkTo='/profile'
                text="Profil"
                requiresAuth />
            </div>

            <Hamburger
              className='mb-2'
              toggled={isOpen}
              size={30}
              toggle={setIsOpen} label='Show menu' rounded />

          </div>
        </div>



        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center justify-between px-5'>
          <MenuLogo />
          <Menu type='desktop'>
            {menuItems.map(item => (
              <li key={item.id}>
                <MenuItem text={item.text} linkTo={item.linkTo} requiresAuth={item.requiresAuth} />
              </li>
            ))}

            {/* NYTT: Dynamiskt Login/Logout på desktop */}
            <li>
              <div onClick={handleAuthItem}>
                <MenuItem
                  text={isLoggedIn ? 'LOGGA UT' : 'LOGGA IN'}
                  linkTo={isLoggedIn ? '/' : '#'}
                />
              </div>
            </li>
          </Menu>
        </div>






      </nav>
    </header>
  )
}

export default TopNav