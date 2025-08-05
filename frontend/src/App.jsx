import {BrowserRouter, Routes, Route} from 'react-router-dom'

export const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home />} />
        <Route path='/loppis' element={ <Search />} />
        <Route path='/loppis/:loppisId' element={ <LoppisInfo />} />
        <Route path='/profile' element={ <Profile />} />
        <Route path='/add' element={ <AddLoppis />} />
        <Route path='*' element={ <NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
