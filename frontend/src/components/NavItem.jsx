import { Link } from 'react-router-dom'

const NavItem = ({ icon: Icon, ariaLabel, linkTo, text }) => {
  return (
    <Link
      to={linkTo}
      className='flex flex-col items-center rounded-full p-1 hover:bg-hover '
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Icon className='w-[22px] md:w-[24px]' />
      <p className='text-xs'>{text}</p>
    </Link>
  )
}

export default NavItem