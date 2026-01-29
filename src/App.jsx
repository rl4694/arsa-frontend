import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Cities from './Cities/Cities'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/cities' element={<Cities />} />
    </Routes>
  )
}

export default App
