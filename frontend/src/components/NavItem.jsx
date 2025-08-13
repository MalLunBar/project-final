import { Link } from 'react-router-dom'

const NavItem = ({ icon: Icon, text, linkTo }) => {
  return (
    <Link to={linkTo}>
      <div
        className='flex rounded-full p-2 flex-col items-center hover:bg-hover '
      >
        <Icon />
        {text}
      </div>
    </Link>
  )
}

export default NavItem