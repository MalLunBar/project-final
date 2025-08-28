import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import LoppisInfo from './pages/LoppisInfo'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import AddLoppis from './pages/AddLoppis'
import NotFound from './pages/NotFound'
import AboutUs from './pages/AboutUs'
import ProtectedPage from './pages/ProtectedPage'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} title='Startsida' />
          <Route path='/search' element={<Search />} title='Söksida' />
          <Route path='/loppis/:loppisId' element={<LoppisInfo />} title='Loppissida' />
          <Route
            path='/profile'
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
            title='Profilsida' />
          <Route
            path="/profile/:tab"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            } />
          <Route path='/signup' element={<SignUp />} />
          <Route
            path='/add'
            element={
              <ProtectedPage>
                <AddLoppis />
              </ProtectedPage>
            } />
          <Route path='/about' element={<AboutUs />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
