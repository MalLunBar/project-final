import { NavLink } from 'react-router-dom'

const MenuItem = ({ text, linkTo }) => {
  return (
    <NavLink
      className='font-medium text-gray-700 p-2 hover:bg-hover rounded'
      to={linkTo}
    >
      {text}
    </NavLink>
  )
}

export default MenuItem