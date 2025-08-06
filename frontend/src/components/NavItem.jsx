import { Link } from 'react-router-dom'

const NavItem = ({ icon: Icon, text, linkTo }) => {
  return (
    <Link to={linkTo}>
      <div
        className='flex flex-col items-center p-2'
      >
        <Icon />
        {text}
      </div>
    </Link>
  )
}

export default NavItem