// src/components/MenuItem.jsx
import { NavLink } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'

const MenuItem = ({ text, linkTo, onClick, requiresAuth = false }) => {
  const user = useAuthStore(s => s.user)
  const openLoginModal = useModalStore(s => s.openLoginModal)

  const handleClick = (e) => {

    if (requiresAuth && !user) {
      e.preventDefault()
      openLoginModal('Logga in för att använda den här funktionen.')
    }
    onClick?.(e) // t.ex. stäng meny
  }

  return (
    <NavLink
      className='font-medium text-gray-700 p-2 hover:bg-hover rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-button'
      to={linkTo}
      onClick={handleClick}
    >
      {text}
    </NavLink>
  )
}

export default MenuItem
