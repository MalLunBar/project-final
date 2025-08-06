import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import LoppisInfo from './pages/LoppisInfo'
import Profile from './pages/Profile'
import AddLoppis from './pages/AddLoppis'
import NotFound from './pages/NotFound'
import TopNav from './sections/TopNav'
import BottomNav from './sections/BottomNav'

export const App = () => {

  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/loppis' element={<Search />} />
        <Route path='/loppis/:loppisId' element={<LoppisInfo />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/add' element={<AddLoppis />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}
