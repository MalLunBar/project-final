import { useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { CircleUserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import Menu from '../components/Menu'
import MenuItem from '../components/MenuItem'
import NavItem from '../components/NavItem'

const TopNav = () => {

  const [isOpen, setIsOpen] = useState(false)

  // close menu when an item is clicked
  const handleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { id: 1, text: 'Hem', linkTo: '/' },
    { id: 2, text: 'Hitta en loppis', linkTo: '/loppis' },
    { id: 3, text: 'Lägg till loppis', linkTo: '/add' },
  ]

  return (
    <header className="sticky top-0 w-full left-0 z-2">
      <nav
        className="flex items-center justify-between p-2"
        aria-label="Main"
      >
        {/* Logo */}
        <Link
          className='hidden md:block'
          to='/'
        >
          <h1>LoppisApp</h1>
        </Link>


        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <Hamburger toggled={isOpen} size={24} toggle={setIsOpen} label='Show menu' rounded />

          {isOpen &&
            <div
              className='fixed left-0 top-12 w-[60%] h-full bg-background p-2'
              onClick={handleMenu}
            >
              <Menu type='mobile'>
                {menuItems.map(item => (
                  <li
                    key={item.id}
                  >
                    <MenuItem text={item.text} linkTo={item.linkTo} />
                  </li>
                ))}
              </Menu>
            </div>
          }
        </div>

        <div className='flex items-center gap-5 px-2'>
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center justify-between px-5'>
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
          {/* Profile */}
          <NavItem icon={CircleUserRound} linkTo='/profile' />
        </div>

      </nav>
    </header>
  )
}

export default TopNav