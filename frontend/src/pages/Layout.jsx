import { Outlet } from 'react-router-dom'
import TopNav from '../sections/TopNav'
import LoginModal from '../modals/LoginModal'
import useModalStore from '../stores/useModalStore'
import ScrollToTopAndFocus from '../components/ScrollToTopAndFocus'
import AriaLiveRegion from '../components/AriaLiveRegion'

const Layout = () => {
  const { loginModalOpen, closeLoginModal } = useModalStore()

  return (
    <div className='flex flex-col'>
      <ScrollToTopAndFocus />
      <AriaLiveRegion />
      <TopNav />
      <Outlet />
      {loginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </div>
  )
}

export default Layout