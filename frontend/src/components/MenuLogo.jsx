import { Link } from 'react-router-dom'
import { House } from 'lucide-react'

const MenuLogo = () => {
  return (
    <Link
      className='hover:text-text'
      to='/'
    >
      <div className='flex gap-1 md:gap-2'>
        <House strokeWidth={3} className='w-[22px] md:w-[24px] text-text' />
        <h1 className='font-semibold text-lg md:text-xl'>Runt Hörnet</h1>
      </div>
    </Link>
  )
}

export default MenuLogo