import { Home, Search, Heart } from 'lucide-react'
import NavItem from "../components/NavItem"

const BottomNav = () => {


  const navItems = [
    { id: 1, text: 'Hem', icon: Home, linkTo: '/' },
    { id: 2, text: 'Sök', icon: Search, linkTo: '/loppis' },
    { id: 3, text: 'Favoriter', icon: Heart, linkTo: '/profile' },
  ]

  return (
    <nav
      className="fixed md:hidden bottom-0 left-0 z-50 w-full py-1 bg-white border-t border-nav"
      aria-label="Bottom"
    >
      <ul className="flex items-center justify-around">
        {navItems.map(item => (
          <li
            key={item.id}
          >
            <NavItem text={item.text} icon={item.icon} linkTo={item.linkTo} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNav