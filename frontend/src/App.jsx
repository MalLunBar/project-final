import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import LoppisInfo from './pages/LoppisInfo'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import AddLoppis from './pages/AddLoppis'
import NotFound from './pages/NotFound'
import TopNav from './sections/TopNav'
import LoginModal from './modals/LoginModal'
import useModalStore from './stores/useModalStore'
import ProtectedPage from './pages/ProtectedPage'

export const App = () => {
  const { loginModalOpen, closeLoginModal } = useModalStore()

  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/loppis' element={<Search />} />
        <Route path='/loppis/:loppisId' element={<LoppisInfo />} />
        <Route
          path='/profile'
          element={
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          } />
        <Route path="/profile/:tab" element={<Profile />} />
        <Route path='/signup' element={<SignUp />} />
        <Route
          path='/add'
          element={
            <ProtectedPage>
              <AddLoppis />
            </ProtectedPage>
          } />
        <Route path='*' element={<NotFound />} />
      </Routes>
      {loginModalOpen && <LoginModal onClose={closeLoginModal} />}
      {/* <BottomNav /> */}
    </BrowserRouter>
  )
}
