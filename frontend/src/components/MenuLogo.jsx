import { Link } from 'react-router-dom'


const MenuLogo = () => {
  return (
    <Link
      className='hover:text-text'
      to='/'
    >
      <div className='flex gap-1 md:gap-2 w-14 h-14'>
        <img 
          src="logo-1.png" 
          alt="Runt hörnet logga" />
      </div>
    </Link>
  )
}

export default MenuLogo