/*
 * This file provides the top-level app component
 */
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Users/Login/Login'
import Register from './Users/Register/Register'
import Navbar from './components/Navbar/Navbar'
import CityList from './Cities/CityList/CityList'
import StateList from './States/StateList/StateList'
import NationList from './Nations/NationList/NationList'
import DisasterList from './Disasters/DisasterList/DisasterList'

function App() {
  return (
    <div className="app">
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cities' element={<CityList />} />
            <Route path='/states' element={<StateList />} />
            <Route path='/nations' element={<NationList />} />
            <Route path='/disasters' element={<DisasterList />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
