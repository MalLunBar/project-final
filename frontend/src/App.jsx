import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import LoppisInfo from './pages/LoppisInfo'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import AddLoppis from './pages/AddLoppis'
import NotFound from './pages/NotFound'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/search' element={<Search />} />
          <Route path='/loppis/:loppisId' element={<LoppisInfo />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/profile/:tab" element={<Profile />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/add' element={<AddLoppis />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
