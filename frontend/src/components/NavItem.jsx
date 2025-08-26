// src/components/NavItem.jsx
import { Link } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import useModalStore from '../stores/useModalStore'

const NavItem = ({ icon: Icon, ariaLabel, linkTo, text, onClick, requiresAuth = false }) => {
  const user = useAuthStore(s => s.user)
  const openLoginModal = useModalStore(s => s.openLoginModal)

  const handleClick = (e) => {
    if (requiresAuth && !user) {
      e.preventDefault()
      openLoginModal('Du behöver vara inloggad för att komma vidare.')
    }
    onClick?.(e) // t.ex. stäng meny
  }

  return (
    <Link
      to={linkTo}
      className='flex flex-col items-center rounded-xl p-2 min-w-12 hover:bg-hover'
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={handleClick}
    >
      <Icon className='w-[22px] md:w-[24px]' />
      <p className='text-xs'>{text}</p>
    </Link>
  )
}

export default NavItem
