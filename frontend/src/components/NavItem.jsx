import { Link } from 'react-router-dom'

const NavItem = ({ icon: Icon, ariaLabel, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className='rounded-full p-1 hover:bg-hover '
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Icon className='w-[22px] md:w-[24px]' />
    </Link>
  )
}

export default NavItem