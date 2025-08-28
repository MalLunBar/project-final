import { Outlet } from 'react-router-dom'
import TopNav from '../sections/TopNav'
import LoginModal from '../modals/LoginModal'
import useModalStore from '../stores/useModalStore'
import ScrollToTopAndFocus from '../components/ScrollToTopAndFocus'

const Layout = () => {
  const { loginModalOpen, closeLoginModal } = useModalStore()

  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollToTopAndFocus />
      <TopNav />
      <Outlet />
      {loginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </div>
  )
}

export default Layout