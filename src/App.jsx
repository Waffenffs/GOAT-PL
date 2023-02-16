import Home from './pages/Home'
import RegisterPage from './pages/Register'
import { Route, Routes} from 'react-router-dom'

export default function App(){
  return(
    <Routes>
      <Route path='/' element={ <Home />} />
      <Route path='/register' element={ <RegisterPage /> }/>
    </Routes>
  )
}