import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Cities from './Cities/Cities'
import Navbar from './Navbar/Navbar'

function App() {
  return (
    <div className="app">
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cities' element={<Cities />} />
        </Routes>
    </div>
  )
}

export default App
