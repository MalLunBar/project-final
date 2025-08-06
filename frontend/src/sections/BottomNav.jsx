import { Home, Map, Heart } from 'lucide-react'
import NavItem from "../components/NavItem"

const BottomNav = () => {

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full py-1 bg-white border-t border-nav"
      aria-label="Bottom"
    >
      <ul className="flex items-center justify-around">
        <li><NavItem text="Hem" icon={Home} linkTo="/" /></li>
        <li><NavItem text="Karta" icon={Map} linkTo="/loppis" /></li>
        <li><NavItem text="Favoriter" icon={Heart} linkTo="/profile" /></li>
      </ul>
    </nav>
  )
}

export default BottomNav