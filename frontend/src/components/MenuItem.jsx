import { NavLink } from 'react-router-dom'

const MenuItem = ({ text, linkTo }) => {
  return (
    <NavLink
      className='p-2'
      to={linkTo}>
      {text}
    </NavLink>
  )
}

export default MenuItem