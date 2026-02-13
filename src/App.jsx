/*
 * This file provides the top-level app component
 */
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Login/Login'
import Navbar from './Navbar/Navbar'
import CityList from './Cities/CityList'
import StatesList from './States/StatesList'
import NationsList from './Nations/NationsList'
import DisastersList from './Disasters/DisasterList'

function App() {
  return (
    <div className="app">
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cities' element={<CityList />} />
            <Route path='/states' element={<StatesList />} />
            <Route path='/nations' element={<NationsList />} />
            <Route path='/disasters' element={<DisastersList />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  )
}

export default App
