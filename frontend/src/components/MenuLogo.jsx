import { Link } from 'react-router-dom'
import logo from '../assets/logo-1.png'


const MenuLogo = () => {
  return (
    <Link
      to='/'
    >
      <div className='w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18'>
        <img
          src={logo}
          alt="Runt hörnet logga" />
      </div>
    </Link>
  )
}

export default MenuLogo