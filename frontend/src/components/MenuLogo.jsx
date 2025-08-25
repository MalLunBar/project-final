import { Link } from 'react-router-dom'


const MenuLogo = () => {
  return (
    <Link
      to='/'
    >
      <div className='w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18'>
        <img
          src="logo-1.png"
          alt="Runt hörnet logga" />
      </div>
    </Link>
  )
}

export default MenuLogo