import { useState } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { CircleUserRound, House, Moon } from 'lucide-react'
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
    <header className="sticky top-0 w-full left-0 z-1100 font-primary bg-white border-b border-border shadow-sm">
      <nav
        className="flex items-center justify-between p-3 md:p-5"
        aria-label="Main"
      >

        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <Hamburger toggled={isOpen} size={24} toggle={setIsOpen} label='Show menu' rounded className='text-text' />

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

        {/* Logo */}
        <Link
          className='hover:text-text'
          to='/'
        >
          <div className='flex gap-1 md:gap-2'>
            <House strokeWidth={3} className='w-[22px] md:w-[24px] text-text' />
            <h1 className='font-semibold text-lg md:text-xl'>Runt Hörnet</h1>
          </div>
        </Link>

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

        {/* Icons menu */}
        <div className='flex items-center gap-1'>
          {/* light/dark mode toggle */}
          <NavItem icon={Moon} linkTo='/' />
          {/* profile */}
          <NavItem icon={CircleUserRound} linkTo='/profile' />
        </div>

      </nav>
    </header>
  )
}

export default TopNav