import {BrowserRouter, Routes, Route} from 'react-router-dom'

export const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home />} />
        <Route path='/loppisar' element={ <Loppisar />} />
        <Route path='/loppisar/:loppisId' element={ <LoppisInfo />} />
        <Route path='/profile' element={ <Profile />} />
        <Route path='/map' element={ <MapView />} />
        <Route path='/add' element={ <AddLoppis />} />
        <Route path='*' element={ <NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
